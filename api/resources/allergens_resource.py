from flask import request
from flask_restful import reqparse, marshal_with
# import Order database model
from database.model import db, Product, Allergen
from resources.base_resource import BaseResource

# call description on the object
# resource for the content of an order

response_to_sql_map = {'product_id': Allergen.product_id,
                       'allergen': Allergen.allergy_type
                       }


class AllergenResource(BaseResource):
    def __init__(self):
        super(AllergenResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, product_id):
        allergen_info= Allergen.query.filter(Allergen.product_id == product_id).all()
        if allergen_info is None or not allergen_info:
            # Could not find orders for the store
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'No allergens associated with this product where found.'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(allergen_info), 200

    def put(self, order_id):
        # Updates a order in the db
        pass

    def post(self):
        # Creates an order in the db. Do not pass in a order_id, the DB created this!
        parser = reqparse.RequestParser()
        parser.add_argument('product_id', type=int, required=True)
        parser.add_argument('allergen', type=str, required=True)
        args = parser.parse_args(strict=True)
        product_id = args.get('product_id', None)

        if product_id is None or not self.is_valid_product_id(product_id):
            # Could not find orders for the store
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'Could not add allergens for this product as the product id provided does not exist'}, 400

        new_order_content = self.update_sqlachemy_object(Allergen(), args)
        db.session.add(new_order_content)
        db.session.commit()

        return self.make_response_from_sqlalchemy(new_order_content), 201  # HTTP 201 CREATED

    def delete(self, order_id):
        # An example of how to do deletion
        pass
