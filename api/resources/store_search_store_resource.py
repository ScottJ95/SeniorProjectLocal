# Nick Pieros
from flask_restful import reqparse
# import Product database model
from database.model import db, Store
from resources.base_resource import BaseResource

# look at this: http://flask-restful-cn.readthedocs.io/en/0.3.5/intermediate-usage.html

# call description on the object

response_to_sql_map = {'store_id': Store.store_id,
                       'store_name': Store.store_name,
                       'store_address': Store.store_address,
                       'store_offline': Store.store_offline,
                       'store_open_time': Store.store_open_time,
                       'store_close_time': Store.store_close_time,
                       'store_delivery': Store.store_delivery,
                       'store_phone': Store.store_phone
                       }


class StoreSearchStoreResource(BaseResource):
    def __init__(self):
        super(StoreSearchStoreResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, store_string):
        # Get all the ratings made by a user
        # Checking to see if there is at lesat one result
        search_string = "%"+store_string+"%"
        store_info = Store.query.filter(Store.store_name.ilike(search_string)).all()
        if store_info is None or not store_info:
            # Could not find ratings for a product with the given ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'no products found with from the provided store with the provided type'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(store_info), 200

    def put(self):
        # Put is not used in this situation
        pass

    def post(self):
        # post is not used in this situation
        pass

    def delete(self):
        # An example of how to do deletion
        pass
