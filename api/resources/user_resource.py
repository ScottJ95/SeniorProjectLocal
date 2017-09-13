from flask import request
from flask_restful import reqparse, marshal_with
# import User database model
from database.model import db, User
from common.utils import email  # used for custom email type and reqparse
from resources.base_resource import BaseResource

# look at this: http://flask-restful-cn.readthedocs.io/en/0.3.5/intermediate-usage.html

# call description on the object

response_to_sql_map = {'id': User.user_id,
                       'email': User.user_email,
                       'first_name': User.user_first_name,
                       'last_name': User.user_last_name,
                       'saved_address': User.user_address,
                       'password': User.user_password,
                       'phone': User.user_phone,
                       'paypal_id': User.user_paypal_id
                       }


class UserResource(BaseResource):
    def __init__(self):
        super(UserResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, user_id):
        # Get a user from the DB
        user_info = User.query.get(user_id)
        if user_info is None:
            # Could not find that persons id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'user_id provided does not exist'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(user_info), 200

    def put(self, user_id):
        # Updates a User in the db
        user_info = User.query.get(user_id)
        if user_info is None:
            # Could not find that persons id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'user_id provided does not exist'}, 400

        parser = reqparse.RequestParser()
        parser.add_argument('first_name', type=str)
        parser.add_argument('last_name', type=str)
        parser.add_argument('email', type=str)
        parser.add_argument('phone', type=str)
        parser.add_argument('paypal_id', type=str)
        parser.add_argument('password', type=str)
        parser.add_argument('saved_address', type=str)
        # now actually do the parsing
        # strict will throw an error and return a response if something like invalid email or a unrecognized param
        args = parser.parse_args(strict=True)
        email_addr = args.get('email', None)
        if email_addr is None or not email(email_addr):
            return {'status': 400, 'message': 'Email provided is not a Rowan email address'}, 400
        print (email_addr)
        email_count = User.query.filter(User.user_email == email_addr).count()
        if email_count > 0:
            return {'status': 400, 'message': 'User with this email address already exists'}, 400

        user_info = self.update_sqlachemy_object(user_info, args)
        db.session.commit()  # write the updated User object to the database
        return self.make_response_from_sqlalchemy(user_info), 202  # HTTP 202 ACCEPTED

    def post(self):
        # Creates a User in the db. Do not pass in a user_id, the DB created this!
        parser = reqparse.RequestParser()
        parser.add_argument('first_name', type=str, required=True)
        parser.add_argument('last_name', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('phone', type=str, required=True)
        parser.add_argument('paypal_id', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('saved_address', type=str, required=True)
        args = parser.parse_args(strict=True)
        new_user = self.update_sqlachemy_object(User(), args)
        email_addr = args.get('email', None)
        if email_addr is None or not email(email_addr):
            return {'status': 400, 'message': 'Email provided is not a Rowan email address'}, 400

        email_count = User.query.filter(User.user_email == email_addr).count()
        if email_count > 0:
            return {'status': 400, 'message': 'User with this email address already exists'}, 400

        db.session.add(new_user)
        db.session.commit()
        return self.make_response_from_sqlalchemy(new_user), 201  # HTTP 201 CREATED

    def delete(self, user_id):
        # An example of how to do deletion
        pass