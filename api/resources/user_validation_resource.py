from flask import request
from flask_restful import reqparse, marshal_with
# import User database model
from database.model import db, User
from common.utils import email  # used for custom email type and reqparse
from resources.base_resource import BaseResource
from sqlalchemy import func

# look at this: http://flask-restful-cn.readthedocs.io/en/0.3.5/intermediate-usage.html

# call description on the object


class UserValidationResource(BaseResource):
    def __init__(self):
        super(UserValidationResource, self).__init__()
        # self.field_map = response_to_sql_map

    def get(self, user_email, user_password):
        # Get a user from the DB
        # filtering the user table for users that have the email provided(should only ever be 1)
        #   and the password provided
        # getting the value of id for the resulting entry

        user_info = User.query.filter(func.lower(User.user_email) == func.lower(user_email)).filter(User.user_password == user_password)\
                .value(User.user_id)
        print(user_info)
        if user_info is None:
            # Could not find that persons id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'id': None, 'succeeded': False}
            # return {'status': 400, 'message': 'no user exists with the provided email'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return {'succeeded': True, 'id': user_info}, 200

    def put(self, user_id):
        pass

    def post(self):
        pass

    def delete(self, user_id):
        # An example of how to do deletion
        pass