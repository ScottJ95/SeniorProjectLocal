# Nick Pieros
from flask import request
from flask_restful import reqparse, marshal_with
# import Product database model
from database.model import db, Product, Store
from resources.base_resource import BaseResource
from decimal import *

# look at this: http://flask-restful-cn.readthedocs.io/en/0.3.5/intermediate-usage.html

# call description on the object

response_to_sql_map = {'id': Product.product_id,
                       'store_id': Product.store_id,
                       'name': Product.product_name,
                       'price': Product.product_price,
                       'picture': Product.product_picture,
                       'description': Product.product_description,
                       'type': Product.product_type,
                       'unit_amount': Product.product_unit_amount
                       }


class ProductResource(BaseResource):
    def __init__(self):
        super(ProductResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, product_id):
        # Get a product from the DB
        product_info = Product.query.get(product_id)
        if product_info is None:
            # Could not find a product with the given ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'product_id provided does not exist'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(product_info), 200

    def put(self, product_id):
        # Updates a Product in the db
        product_info = Product.query.get(product_id)
        if product_info is None:
            # Could not find a product with the given ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'product_id provided does not exist'}, 400

        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        # TODO verify that the correct type is float
        # stored in the database as a Numeric, and handled by SQLAlchemy as a Numeric
        parser.add_argument('price', type=Decimal)
        parser.add_argument('picture', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('type', type=str)
        parser.add_argument('unit_amount', type=int)
        # now actually do the parsing
        # strict will throw an error and return a response if something like invalid email or a unrecognized param
        args = parser.parse_args(strict=True)
        user_info = self.update_sqlachemy_object(product_info, args)
        db.session.commit()  # write the updated User object to the database
        return self.make_response_from_sqlalchemy(user_info), 202  # HTTP 202 ACCEPTED

    def post(self):
        # Creates a Product in the db. Do not pass in a product_id, the DB created this!
        parser = reqparse.RequestParser()
        parser.add_argument('store_id', type=int, required=True)
        parser.add_argument('name', type=str, required=True)
        # TODO double check that this is the correct way to represent numeric
        parser.add_argument('price', type=Decimal, required=True)
        parser.add_argument('picture', type=str, required=True)
        parser.add_argument('description', type=str, required=True)
        parser.add_argument('type', type=str, required=True)
        parser.add_argument('unit_amount', type=int, required=True)
        args = parser.parse_args(strict=True)
        new_product = self.update_sqlachemy_object(Product(), args)
        db.session.add(new_product)
        db.session.commit()
        return self.make_response_from_sqlalchemy(new_product), 201  # HTTP 201 CREATED

    def delete(self, product_id):
        # An example of how to do deletion
        pass