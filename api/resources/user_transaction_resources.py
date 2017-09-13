from flask import request
from flask_restful import reqparse, marshal_with
# import Order database model
import datetime

from database.model import db, Order, User, OrderContent, Product
from resources.base_resource import BaseResource

# call description on the object


class UserTransactionResource(BaseResource):
    def __init__(self):
        super(UserTransactionResource, self).__init__()

    def get(self, user_id, time_string):

        end_date = datetime.datetime.utcnow()
        if time_string == 'a':
            all_orders = Order.query.filter_by(user_id=user_id) \
                .filter(User.user_id == Order.user_id) \
                .all()

        else:
            if time_string == 'w':
                end_date = end_date - datetime.timedelta(days=7)

            elif time_string == 'm':
                new_month = end_date.month
                if new_month > 1:
                    new_month -= 1
                else:
                    new_month = 12
                    new_year = end_date.year - 1
                    end_date = end_date.replace(year=new_year)
                end_date = end_date.replace(month=new_month)

            elif time_string == 'y':
                new_year = end_date.year - 1
                end_date = end_date.replace(year=new_year)

            all_orders = Order.query.filter_by(user_id=user_id).filter(Order.order_date >= end_date).all()
            end_date_string = end_date.isoformat()

        if all_orders is None or not all_orders:
            # Could not find that user
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'No orders are associated with this id or this id may be invalid.'}, 400

        full_response = list()
        try:
            is_iterable = iter(all_orders)
        except TypeError as te:
            # If it's not iterable, force it to be iterable by putting it in a list
            all_orders = [all_orders]
        for row in all_orders:
            current_row_response = dict()
            date = getattr(row, 'order_date')
            order_id = getattr(row, 'order_id')
            current_row_response['order_id'] = order_id
            order_content_info = OrderContent.query.filter(OrderContent.order_id == order_id).all()
            if order_content_info is None or not order_content_info:
                # Could not find orders for the store
                # Return HTTP 400 BAD REQUEST and give some error context
                return {'status': 400, 'message': 'No content for an order associated with the given order_id.'}, 400

            total_price = 0.0
            for content_row in order_content_info:
                product_id = getattr(content_row, 'product_id')
                product_obj = Product.query.get(product_id)  # get Product object part of this order
                total_price += (float(product_obj.product_price)) * float(getattr(content_row, 'order_quantity'))
            current_row_response['price'] = total_price
            current_row_response['date'] = date.isoformat()
            full_response.append(current_row_response)
        # If there is only one row, return that dictionary. Otherwise return the list of dictionaries.
        if len(full_response) == 1:
            return full_response[0]  # only return the first dictionary
        else:
            return full_response

    def put(self, order_id):
        # Updates a order in the db
        pass

    def post(self):
        # Creates an order in the db. Do not pass in a order_id, the DB created this!
        pass

    def delete(self, order_id):
        # An example of how to do deletion
        pass
