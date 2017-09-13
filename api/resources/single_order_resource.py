import datetime
import string

from flask import request
from flask_restful import reqparse, marshal_with
# import Order database model
from database.model import db, Order, OrderContent, User, Product, Store, Merchant
from resources.base_resource import BaseResource
from twilio.rest import TwilioRestClient
import json
# call description on the object
response_to_sql_map = {'id': Order.order_id,
                       'user': Order.user_id,
                       'status': Order.status_id,
                       'date': Order.order_date,
                       'address': Order.order_address,
                       }

# Store using rot13 to prevent automated git bots from using our credentials
# Ideally these would be stored in some credentials file
r13 = string.maketrans(
    "ABCDEFGHIJKLMabcdefghijklmNOPQRSTUVWXYZnopqrstuvwxyz",
    "NOPQRSTUVWXYZnopqrstuvwxyzABCDEFGHIJKLMabcdefghijklm")
account_sid = string.translate("NP5qon2nqp519210844rr9q20or173r413", r13)
auth_token = string.translate("sq643oo1q6088849ss277o2r695032p6", r13)
client = TwilioRestClient(account_sid, auth_token)



class OrderResource(BaseResource):
    def __init__(self):
        super(OrderResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, order_id):
        order_info = Order.query.get(order_id)
        if order_info is None:
            # Could not find that id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'order_id provided does not exist'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(order_info), 200

    def put(self, order_id):
        # Updates a order in the db
        order_info = Order.query.get(order_id)
        if order_info is None:
            # Could not find that persons id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'order_id provided does not exist'}, 400

        parser = reqparse.RequestParser()
        parser.add_argument('user', type=str)
        parser.add_argument('status', type=int)
        # now actually do the parsing
        # strict will throw an error and return a response if something like invalid email or a unrecognized param
        args = parser.parse_args(strict=True)
        order_info = self.update_sqlachemy_object(order_info, args)
        db.session.commit()  # write the updated Order object to the database
        return self.make_response_from_sqlalchemy(order_info), 202  # HTTP 202 ACCEPTED

    def post(self):
        # Creates an order in the db. Do not pass in a order_id, the DB created this!

        # We must loop through the json. We should be given something like this:
        # [{product_id: quantity}]

        parsed_json = request.get_json(force=True)
        parsed_json_dict = json.loads(request.data)

        user_id = parsed_json.get('user_id')
        if user_id is None:
            return {'status': 400,
                    'message': 'Request poorly formatted, missing the user_id'}, 400

        address = parsed_json.get('address')

        delivery = parsed_json.get('delivery')

        user = User.query.get(user_id)
        if user is None:
            return {'status': 400, 'message': 'User provided does not exist'}, 400

        if delivery == 0:
            address = 'N/A'
        if address is None and delivery == 1:
            address = User.query.filter(User.user_id == user_id).value(User.user_address)
            if address is None:
                return {'status': 400,
                        'message': 'No address to ship to'}, 400

        new_order = Order()
        new_order.user_id = user_id
        new_order.status_id = 1
        new_order.order_date = datetime.datetime.utcnow()
        new_order.order_address = address  # assume the one on file for now
        db.session.add(new_order)
        db.session.commit()

        # Now put the first and last name of the buyer into the sms string
        user_obj = User.query.get(new_order.user_id)  # get the User object of the person who placed the order
        name_to_display = user_obj.user_first_name + ' ' + user_obj.user_last_name
        sms_str = "Order from " + name_to_display

        # Create a row in OrderContent for each item in our order
        order_total = 0.0
        for row in parsed_json.get('products'):
            new_order_content_row = OrderContent()
            new_order_content_row.product_id = row.get('product_id')
            new_order_content_row.order_quantity = row.get('quantity')
            if int(row.get('quantity')) == 0:
                continue  # don't include quantity of 0
            new_order_content_row.order_id = new_order.order_id
            db.session.add(new_order_content_row)
            product_obj = Product.query.get(new_order_content_row.product_id)  # get Product object part of this order
            order_total += (float(product_obj.product_price)) * float(row.get('quantity'))
            sms_str = " " + product_obj.product_name + ":" + str(row.get('quantity')) + ","

        db.session.commit()
        # remove trailing comma
        sms_str = sms_str[:-1] + "-> Total: $" + str(order_total)
        user_sms_str = "New order: " + sms_str
        baker_sms_str = "Order from " + name_to_display + sms_str
        # Get store associated with any product
        store_obj = Store.query.get(product_obj.store_id)
        phone = store_obj.store_phone
        user_phone = user_obj.user_phone

        db.session.add(new_order)
        db.session.commit()

        # Send a twilio message. Ideally this will be done async in future
        # from_ is the number provided by Twilio
        client.messages.create(body=user_sms_str, to=user_phone.replace('-', ''), from_="+19083325066")
        client.messages.create(body=baker_sms_str, to=phone.replace('-', ''), from_="+19083325066")
        return self.make_response_from_sqlalchemy(new_order), 201  # HTTP 201 CREATED

    def delete(self, order_id):
        # An example of how to do deletion
        pass
