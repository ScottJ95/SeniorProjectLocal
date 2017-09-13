from flask import request
from flask_restful import reqparse, marshal_with
# import Order database model
from database.model import db, Order, Status
from resources.base_resource import BaseResource

# call description on the object
# resource to get the status of an order

response_to_sql_map = {'id': Status.status_id,
                       'definition': Status.status_definition
                       }


class OrderStatusResource(BaseResource):
    def __init__(self):
        super(OrderStatusResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, order_id):
        status_id = Order.query.filter(Order.order_id == order_id).value(Order.status_id)
        order_status = Status.query.filter(Status.status_id == status_id)
        order_status_count = Status.query.filter(Status.status_id == status_id).count()
        if order_status == [] or order_status is None:
            # Could not find orders for the store
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'No orders are associated with the given order id were found.'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(order_status), 200

    def put(self, order_id):
        # Updates a order in the db
        pass

    def post(self):
        # Creates an order in the db. Do not pass in a order_id, the DB created this!
        pass

    def delete(self, order_id):
        # An example of how to do deletion
        pass
