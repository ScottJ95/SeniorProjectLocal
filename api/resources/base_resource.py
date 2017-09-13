# A base resource with custom functionality
from flask_restful import Resource
from decimal import Decimal
from database.model import db, Store, Merchant, Product, User, Order
import datetime


class BaseResource(Resource):
    def __init__(self):
        self.field_map = {}
        super(BaseResource, self).__init__()

    def is_valid_store_id(self, store_id):
        """Returns True if the store_id is valid, False otherwise"""
        if not self._is_numeric(store_id):
            return False
        row_count = Store.query.filter_by(store_id=store_id).count()
        return row_count > 0

    def is_valid_order_id(self, order_id):
        """Returns True if the store_id is valid, False otherwise"""
        if not self._is_numeric(order_id):
            return False
        row_count = Order.query.filter_by(order_id=order_id).count()
        return row_count > 0

    def is_valid_product_id(self, product_id):
        """Returns True if the product_id is valid, False otherwise"""
        if not self._is_numeric(product_id):
            return False
        row_count = Product.query.filter_by(product_id=product_id).count()
        return row_count > 0

    def is_valid_merchant_id(self, merchant_id):
        """Returns True if the merchant_id is valid, False otherwise"""
        if not self._is_numeric(merchant_id):
            return False
        row_count = Merchant.query.filter_by(merchant_id=merchant_id).count()
        return row_count > 0

    def is_valid_user_id(self, user_id):
        """Returns True if the user_id is valid, False otherwise"""
        if not self._is_numeric(user_id):
            return False
        row_count = User.query.filter_by(user_id=user_id).count()
        return row_count > 0

    @staticmethod
    def _is_numeric(int_to_check):
        try:
            int(int_to_check)
            return True
        except ValueError:
            return False

    def update_sqlachemy_object(self, sqlalchemy_obj, parser_args):
        """Updates and returns a SQLAlchemy Object given arguments from the parser
           This is for PUT operations
           After running this method, call db.session.commit() to write to the database
           It converts arguments from the parser (which come from the API data) to SQL field names by using
           the field_map
        """
        parser_args = dict(parser_args)
        for response_field, sql_field in self.field_map.iteritems():
            if parser_args.get(response_field, None) is not None:  # ensure field is present and not None
                if hasattr(sqlalchemy_obj, sql_field.description):
                    # Not nested, don't need table name
                    setattr(sqlalchemy_obj, sql_field.description, parser_args[response_field])
                else:
                    # Nested, need a table name
                    # The table name might have an 's' that the model truncates (e.g. table is users, model is User)
                    nested_object = getattr(sqlalchemy_obj, str(sql_field.table), None) or\
                                    getattr(sqlalchemy_obj, str(sql_field.table)[:-1])
                    setattr(nested_object, sql_field.description, parser_args[response_field])

        return sqlalchemy_obj

    def make_response_from_sqlalchemy(self, sqlalchemy_obj):
        """Given a sqlalchemy_object as the result of a Model.query.get() operation, returns a JSON
           response. It converts the SQL field names to a JSON response by using the field_map.
           If there is only one row, you are returned a dictionary, e.g. {'key': 'value'}
           If there are multiple rows, you are returned a list of dicts: e.g. [{'key': 'val'}, {'key': 'val'}]
           It will handle nested objects, e.g. sqlalchemy_obj.user.user_first_name if you are doing a join
           """
        full_response = list()

        # First see if sqlalchemy_obj is one row or multiple rows
        try:
            is_iterable = iter(sqlalchemy_obj)
        except TypeError as te:
            # If it's not iterable, force it to be iterable by putting it in a list
            sqlalchemy_obj = [sqlalchemy_obj]

        for row in sqlalchemy_obj:
            current_row_response = dict()
            for response_field, sql_field in self.field_map.iteritems():
                # This is incredibly hacky
                # The ORM will map properties from joins into individual objects
                # E.g. instead of sqlalchemy_obj.first_name we have to do sqlalchemy_obj.user.first_name
                # This next line will automatically check the nesting for us
                row_value = getattr(row, sql_field.description, None)

                # If we can't find the field, check to see if it's nested
                if row_value is None:
                    # Get the nested object, e.g. sqlalchemy_object.User
                    # We might need to remove the "s" that is stripped out when the models were generated
                    nested_object = getattr(row, str(sql_field.table), None) or getattr(row, str(sql_field.table)[:-1])
                    row_value = getattr(nested_object, sql_field.description)

                if isinstance(row_value, datetime.date):
                    # We must convert this datetime to be JSON serializable
                    row_value = row_value.isoformat()
                elif isinstance(row_value, Decimal):
                    # Must convert to be JSON serializable
                    row_value = float(row_value)
                current_row_response[response_field] = row_value
            # Append the current row's response to our full response
            full_response.append(current_row_response)

        # If there is only one row, return that dictionary. Otherwise return the list of dictionaries.
        if len(full_response) == 1:
            return full_response[0]  # only return the first dictionary
        return full_response
