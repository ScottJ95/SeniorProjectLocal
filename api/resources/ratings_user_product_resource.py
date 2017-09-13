# Nick Pieros
from flask_restful import reqparse
# import Product database model
from database.model import db, Rating, User, Product
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


class UserProductRatingResource(BaseResource):
    def __init__(self):
        super(UserProductRatingResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, product_id, user_id):
        # Get the ratings for a Product made by a specific User from the DB
        # Checking to see if there is at lesat one result
        # using .all() on query that has no results does not return none apparently
        user_product_rating_info = Rating.query.filter(Rating.product_id == product_id, Rating.user_id == user_id).first()

        if user_product_rating_info is None:
            # Could not find ratings for a product with the given ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'ratings with a user_id and product_id provided does not exist'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(user_product_rating_info), 200

    def put(self, product_id, user_id):
        # Updates a Product in the db
        pass

    def post(self):
        # Creates a Rating for a particular Product by a particular User in the db.
        parser = reqparse.RequestParser()
        parser.add_argument('product_id', type=int, required=True)
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('entry', type=str, required=False)
        parser.add_argument('rating_value', type=int, required=True)
        args = parser.parse_args(strict=True)
        args['date'] = datetime.utcnow()
        product_id = args.get('product_id', None)
        product_info = Product.query.get(product_id)
        # TODO check to make sure that this will function as expected
        if product_info is None:
            # Could not find a product with a matching ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'product_id provided does not exist'}, 400

        user_id = args.get('user_id', None)
        user_info = User.query.get(user_id)
        if user_info is None:
            # Could not find a User with a matching ID
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'user_id provided does not exist'}, 400

        rating_value = args.get('rating_value', None)
        if (rating_value >5) or (rating_value<0):
            # Rating value is out of range
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'rating provided is not between 0 and 5'}

        user_product_rating_info =  Rating.query.filter(Rating.product_id == product_id, Rating.user_id == user_id).count()

        if user_product_rating_info >0:
            # if there was a record for the specified user and product already the user should not be allowed to rate the product again
            return {'status': 400, 'message': 'a rating with this user_id and product_id already exists'}, 400

        new_rating = self.update_sqlachemy_object(Rating(), args)
        db.session.add(new_rating)
        db.session.commit()
        return self.make_response_from_sqlalchemy(new_rating), 201  # HTTP 201 CREATED

    def delete(self, product_id):
        # An example of how to do deletion
        pass
