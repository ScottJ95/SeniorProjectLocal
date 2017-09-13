from flask import request
from flask_restful import reqparse, marshal_with
# import Store database model
from database.model import db, Store, Product
from common.utils import email  # used for custom email type and reqparse
from resources.base_resource import BaseResource

# call description on the object

response_to_sql_map = {'product_id': Product.product_id,
                       'store_id': Product.store_id,
                       'product_name': Product.product_name,
                       'product_price': Product.product_price,
                       'product_description': Product.product_description,
                       'product_type': Product.product_type,
                       'product_unit_amount': Product.product_unit_amount,
                       'product_picture': Product.product_picture
                       }


class StoreMenuResource(BaseResource):
    def __init__(self):
        super(StoreMenuResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, store_id):
        # Get a store from the DB
        if not self.is_valid_store_id(store_id):
            return {'status': 400, 'message': 'store_id does not exist'}, 400
        store_info = Product.query.filter_by(store_id=store_id).all()
        if store_info is None or not store_info:
            # Could not find that persons id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'store_id has no menu'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(store_info), 200

    def put(self, store_id):
        pass

    def post(self):
       pass

    def delete(self, store_id):
        # An example of how to do deletion
        pass
