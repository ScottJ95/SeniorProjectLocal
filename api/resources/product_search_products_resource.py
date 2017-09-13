# Nick Pieros
from flask_restful import reqparse
# import Product database model
from database.model import db, Product
from resources.base_resource import BaseResource
from sqlalchemy import or_

# look at this: http://flask-restful-cn.readthedocs.io/en/0.3.5/intermediate-usage.html

# call description on the object

# searches producst based on type

response_to_sql_map = {'id': Product.product_id,
                       'store': Product.store_id,
                       'name': Product.product_name,
                       'price': Product.product_price,
                       'picture': Product.product_picture,
                       'description': Product.product_description,
                       'type': Product.product_type,
                       'unit_amount': Product.product_unit_amount
                       }


class ProductSearchProductResource(BaseResource):
    def __init__(self):
        super(ProductSearchProductResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, product_type):
        # Get all the ratings made by a user
        # Checking to see if there is at lesat one result
        search_string = "%"+product_type+"%"
        product_type_info = Product.query.filter(Product.product_type.ilike(search_string)).with_entities(Product.product_id)

        product_name_info = Product.query.filter(Product.product_name.ilike(search_string)).with_entities(Product.product_id)

        product_info = Product.query.filter(or_(Product.product_id.in_(product_type_info), Product.product_id.in_(product_name_info)))
        if product_info is None or not product_info:
            # Could not find ratings for a product with the given ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'no stores found with the type provided'}, 400

        return self.make_response_from_sqlalchemy(product_info), 200

    def put(self):
        # Put is not used in this situation
        pass

    def post(self):
        # post is not used in this situation
        pass

    def delete(self):
        # An example of how to do deletion
        pass
