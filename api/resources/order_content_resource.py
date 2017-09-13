from flask import request
from flask_restful import reqparse, marshal_with
# import Order database model
from database.model import db, Order, OrderContent, Product
from resources.base_resource import BaseResource

# call description on the object
# resource for the content of an order

response_to_sql_map = {'order_id': OrderContent.order_id,
                       'product_id': OrderContent.product_id,
                       'quantity': OrderContent.order_quantity
                       }


class OrderContentResource(BaseResource):
    def __init__(self):
        super(OrderContentResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, order_id):
        order_content_info = OrderContent.query.filter(OrderContent.order_id == order_id).all()
        if order_content_info is None or not order_content_info:
            # Could not find orders for the store
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'No content for an order associated with the given order_id.'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(order_content_info), 200

    def put(self, order_id):
        # Updates a order in the db
        pass

    def post(self):
        # Creates an order in the db. Do not pass in a order_id, the DB created this!
        parser = reqparse.RequestParser()
        parser.add_argument('order_id', type=int, required=True)
        parser.add_argument('product_id', type=int, required=True)
        parser.add_argument('quantity', type=int, required=True)
        args = parser.parse_args(strict=True)
        order_id = args.get('order_id', None)
        product_id = args.get('product_id', None)
        quantity = args.get('quantity', 0)

        print('order_id', order_id)
        if product_id is None or not self.is_valid_product_id(product_id):
            # Could not find orders for the store
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'Could not create the content for the order as the provided product_id does not exist'}, 400

        if order_id is None or not self.is_valid_order_id(order_id):
            # could not find a product with the provided product id
            # return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400,'message': 'Could not create the content for the order as the provided order_id does not exist'}, 400

        if quantity < 1:
            # quantity is either 0 or smaller. Dont want to create an order with negitive products
            # return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400,'message': 'Could not create the content for the order as the quantity is not greater than 0'}, 400

        print (args.get('order_id'))
        new_order_content = self.update_sqlachemy_object(OrderContent(), args)
        db.session.add(new_order_content)
        db.session.commit()

        return self.make_response_from_sqlalchemy(new_order_content), 201  # HTTP 201 CREATED

    def delete(self, order_id):
        # An example of how to do deletion
        pass
