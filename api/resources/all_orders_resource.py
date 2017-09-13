from flask import request
from flask_restful import reqparse, marshal_with
# import Order database model
from database.model import db, Order, User
from resources.base_resource import BaseResource

# call description on the object

response_to_sql_map = {'id': Order.order_id,
                       'user': Order.user_id,
                       'status': Order.status_id,
                       'date': Order.order_date,
                       'address': Order.order_address,
                       }


class OrdersResource(BaseResource):
    def __init__(self):
        super(OrdersResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, user_id):
        all_orders = Order.query.filter_by(user_id=user_id)\
            .filter(User.user_id == Order.user_id)\
            .all()

        if all_orders is None or not all_orders :
            # Could not find that user
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'No orders are associated with this id or this id may be invalid.'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(all_orders), 200

    def put(self, order_id):
        # Updates a order in the db
        pass

    def post(self):
        # Creates an order in the db. Do not pass in a order_id, the DB created this!
        pass

    def delete(self, order_id):
        # An example of how to do deletion
        pass
