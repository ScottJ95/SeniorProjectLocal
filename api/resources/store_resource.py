from flask import request
from flask_restful import reqparse, marshal_with
# import Store database model
from database.model import db, Store
from common.utils import email  # used for custom email type and reqparse
from resources.base_resource import BaseResource

# call description on the object

response_to_sql_map = {'id': Store.store_id,
                       'merchant': Store.merchant_id,
                       'name': Store.store_name,
                       'address': Store.store_address,
                       'offline': Store.store_offline,
                       'open': Store.store_open_time,
                       'close': Store.store_close_time,
                       'delivery': Store.store_delivery,
                       'phone': Store.store_phone
                       }


class StoreResource(BaseResource):
    def __init__(self):
        super(StoreResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, store_id=None):
        # Get a store from the DB
        if store_id is None:
            store_info = Store.query.all()
        else:
            store_info = Store.query.get(store_id)
        if store_info is None or store_info == []:
            # Could not find that persons id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'store_id provided does not exist'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(store_info), 200

    def put(self, store_id):
        # Updates a Store in the db
        store_info = Store.query.get(store_id)
        if store_info is None:
            # Could not find that store id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'store_id provided does not exist'}, 400

        parser = reqparse.RequestParser()
        parser.add_argument('merchant', type=int)
        parser.add_argument('name', type=str)
        parser.add_argument('offline', type=bool)
        parser.add_argument('address', type=str)
        parser.add_argument('phone', type=str)
        parser.add_argument('open', type=str)
        parser.add_argument('close', type=str)
        parser.add_argument('delivery', type=int)
        # now actually do the parsing
        # strict will throw an error and return a response if something like invalid email or a unrecognized param
        args = parser.parse_args(strict=True)
        store_info = self.update_sqlachemy_object(store_info, args)
        db.session.commit()  # write the updated Store object to the database
        return self.make_response_from_sqlalchemy(store_info), 202  # HTTP 202 ACCEPTED

    def post(self):
        # Creates a Store in the db. Do not pass in a store_id, the DB created this!
        parser = reqparse.RequestParser()
        parser.add_argument('merchant', type=int)
        parser.add_argument('name', type=str)
        parser.add_argument('offline', type=bool)
        parser.add_argument('address', type=str)
        parser.add_argument('phone', type=str)
        parser.add_argument('open', type=str)
        parser.add_argument('close', type=str)
        parser.add_argument('delivery', type=int)
        args = parser.parse_args(strict=True)
        new_store = self.update_sqlachemy_object(Store(), args)
        db.session.add(new_store)
        db.session.commit()
        return self.make_response_from_sqlalchemy(new_store), 201  # HTTP 201 CREATED

    def delete(self, store_id):
        # An example of how to do deletion
        pass
