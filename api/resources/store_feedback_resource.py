from flask import request
from flask_restful import reqparse
# import Store database model
import datetime
from database.model import db, User, Storefeedback
from common.utils import email  # used for custom email type and reqparse
from resources.base_resource import BaseResource

# call description on the object

response_to_sql_map = {'store_id': Storefeedback.store_id,
                       'user_id': Storefeedback.user_id,
                       'feedback_text': Storefeedback.entry,
                       'feedback_date': Storefeedback.feedback_date,
                       'reviewer_first_name': User.user_first_name
                       }


class StoreFeedbackResource(BaseResource):
    def __init__(self):
        super(StoreFeedbackResource, self).__init__()
        self.field_map = response_to_sql_map

    def get(self, store_id):

        store_info = Storefeedback.query.filter_by(store_id=store_id)\
            .filter(User.user_id == Storefeedback.user_id)\
            .all()

        if store_info is None or not store_info:
            # Could not find that persons id
            # Return HTTP 400 BAD REQUEST and give some error context
            return {'status': 400, 'message': 'store_id provided does not exist'}, 400

        # Convert the SQLAlchemy object to a response
        # Also return HTTP 200 OK
        return self.make_response_from_sqlalchemy(store_info), 200

    def post(self, store_id):

        # Creates a Merchant in the db. Do not pass in a merchant_id, the DB created this!
        parser = reqparse.RequestParser()
        parser.add_argument('store_id', type=int, required=True)
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('feedback_text', type=str, required=True)
        args = parser.parse_args(strict=False)
        new_review = self.update_sqlachemy_object(Storefeedback(), args)
        new_review.feedback_date = datetime.datetime.now()  # don't make the client provide this
        db.session.add(new_review)
        db.session.commit()
        return self.make_response_from_sqlalchemy(new_review), 201  # HTTP 201 CREATED

    def put(self):
        pass

    def delete(self):
        pass