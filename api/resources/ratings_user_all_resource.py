# Nick Pieros
from flask_restful import reqparse
# import Product database model
from database.model import db, Rating
from resources.base_resource import BaseResource
from datetime import *

# look at this: http://flask-restful-cn.readthedocs.io/en/0.3.5/intermediate-usage.html

# call description on the object

response_to_sql_map = {'product_id': Rating.product_id,
                       'user_id': Rating.user_id,
                       'entry': Rating.entry,
                       'rating_value': Rating.rating_value,
                       'rating_date': Rating.rating_date
                       }


class UserAllRatingsResource(BaseResource):
    def __init__(self):
        super(UserAllRatingsResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, user_id):
        # Get all the ratings made by a user
        # Checking to see if there is at least one result
        user_rating_info = Rating.query.filter(Rating.user_id == user_id).all()

        if user_rating_info is None or not user_rating_info:
            # Could not find ratings for a product with the given ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'ratings with the provided user_id do not exist'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(user_rating_info), 200

    def put(self):
        # Put is not used in this situation
        pass

    def post(self):
        # post is not used in this situation
        pass

    def delete(self):
        # An example of how to do deletion
        pass
