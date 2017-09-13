# Nick Pieros
from flask_restful import reqparse
# import Product database model
from database.model import db, Rating
from resources.base_resource import BaseResource
from decimal import *

# look at this: http://flask-restful-cn.readthedocs.io/en/0.3.5/intermediate-usage.html

# call description on the object

response_to_sql_map = {'product_id': Rating.product_id,
                       'user_id': Rating.user_id,
                       'entry': Rating.entry,
                       'rating_value': Rating.rating_value,
                       'rating_date': Rating.rating_date
                       }


class UserAverageRatingsResource(BaseResource):
    def __init__(self):
        super(UserAverageRatingsResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, user_id):
        # Get all the ratings made by a user
        # Checking to see if there is at lesat one result
        user_rating_info = Rating.query.filter(Rating.user_id == user_id).all()

        if user_rating_info is None or not user_rating_info:
            # Could not find ratings for a product with the given ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'ratings with the provided user_id do not exist'}, 400

        user_rating_count = Rating.query.filter(Rating.user_id == user_id).count()
        rating_sum = 0
        for row in user_rating_info:
            current_rating = getattr(row, 'rating_value', 0)
            rating_sum = rating_sum + current_rating

        average_rating_decimal = Decimal(rating_sum)/Decimal(user_rating_count)
        average_rating = float("{0:.2f}".format(average_rating_decimal))

        # returning the user's id, the number of ratings and the average
        # returning a HTTP 200 OK
        return {'user_id': user_id, 'rating_count': user_rating_count, 'rating_average': average_rating}, 200

    def put(self):
        # Put is not used in this situation
        pass

    def post(self):
        # post is not used in this situation
        pass

    def delete(self):
        # An example of how to do deletion
        pass
