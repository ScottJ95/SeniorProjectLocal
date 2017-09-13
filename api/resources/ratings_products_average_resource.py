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


class ProductAverageRatingsResource(BaseResource):
    def __init__(self):
        super(ProductAverageRatingsResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, product_id):
        # Get all the ratings made by a user
        # Checking to see if there is at lesat one result
        product_rating_info = Rating.query.filter(Rating.user_id == product_id).all()

        if product_rating_info is None or not product_rating_info == 0 :
            # Could not find ratings for a product with the given ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'ratings with the product_id provided do not exist'}, 400

        product_rating_count = Rating.query.filter(Rating.user_id == product_id).count()
        # getting the sum of all the ratings for a particular product
        product_rating_sum = 0
        for row in product_rating_info:
            rating_value = getattr(row, 'rating_value', 0)
            product_rating_sum = product_rating_sum + rating_value

        decimal_average = Decimal(product_rating_sum)/Decimal(product_rating_count)
        average_rating = float("{0:.2f}".format(decimal_average))

        # returning the user's id, the number of ratings and the average
        # returning a HTTP 200 OK
        return {'product_id': product_id, 'rating_count': product_rating_count, 'rating_average': average_rating}, 200

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(product_rating_info), 200

    def put(self):
        # Put is not used in this situation
        pass

    def post(self):
        # post is not used in this situation
        pass

    def delete(self):
        # An example of how to do deletion
        pass
