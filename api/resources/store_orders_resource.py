from flask import request
from flask_restful import reqparse, marshal_with
# import Order database model
from database.model import db, Order, Product, OrderContent, User
from resources.base_resource import BaseResource

# resource to get all the orders for a store
# call description on the object

response_to_sql_map = {'id': Order.order_id,
                       'user': Order.user_id,
                       'status': Order.status_id,
                       'date': Order.order_date,
                       'address': Order.order_address,
                       'user_first_name': User.user_first_name,
                       'user_last_name': User.user_last_name
                       }


class StoreOrdersResource(BaseResource):
    def __init__(self):
        super(StoreOrdersResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, store_id):
   #     Select *
   #     from Order
   #     Where order_id in (
   #         select  order_id
   #         from OrderContent
   #         Where product_id in(
   #             Select product_id
   #             from Product
   #             where store_id EQUAL store_id
   #         )
   #     )

        product_ids = Product.query.filter(Product.store_id == store_id).with_entities(Product.product_id)
        order_ids = OrderContent.query.filter(OrderContent.product_id.in_(product_ids)).with_entities(OrderContent.order_id)
        num_order_id = OrderContent.query.filter(OrderContent.product_id.in_(product_ids)).count()
        store_order_info = Order.query.filter(Order.order_id.in_(order_ids)).all()

        if store_order_info is None or not store_order_info:
            # Could not find orders for the store
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'No orders are associated with the store id were found.'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(store_order_info), 200

    def put(self, order_id):
        # Updates a order in the db
        pass

    def post(self):
        # Creates an order in the db. Do not pass in a order_id, the DB created this!
        pass

    def delete(self, order_id):
        # An example of how to do deletion
        pass
