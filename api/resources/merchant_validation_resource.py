from flask import request
from flask_restful import reqparse, marshal_with
# import User database model
from database.model import db, Merchant, Store
from common.utils import email  # used for custom email type and reqparse
from resources.base_resource import BaseResource
from sqlalchemy import func

# look at this: http://flask-restful-cn.readthedocs.io/en/0.3.5/intermediate-usage.html

# call description on the object


class MerchantValidationResource(BaseResource):
    def __init__(self):
        super(MerchantValidationResource, self).__init__()
        # self.field_map = response_to_sql_map

    def get(self, merchant_email, merchant_password):
        # Get a user from the DB
        # filtering the user table for users that have the email provided(should only ever be 1)
        #   and the password provided
        # getting the value of id for the resulting entry

        merchant_id = Merchant.query.filter(func.lower(Merchant.merchant_email) == func.lower(merchant_email)).filter(
            Merchant.merchant_password == merchant_password) \
            .value(Merchant.merchant_id)
        if merchant_id is None:
            # Could not find that persons id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'id': None, 'succeeded': False}, 200
            # return {'status': 400, 'message': 'no user exists with the provided email'}, 400

        store_id = Store.query.filter_by(merchant_id=merchant_id).one().store_id

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return {'succeeded': True, 'merchant_id': merchant_id, 'store_id': store_id}, 200

    def put(self, user_id):
        pass

    def post(self):
        pass

    def delete(self, user_id):
        # An example of how to do deletion
        pass