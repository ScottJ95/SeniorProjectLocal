from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from database.model import db
from resources import user_resource, product_resource, store_resource, merchant_resource, ratings_user_product_resource,\
    store_feedback_resource, store_menu_resource, ratings_user_all_resource, ratings_user_average_resource, ratings_products_all_resource, \
    ratings_products_average_resource, store_search_store_resource, store_search_product_resource, product_search_products_resource, \
    all_orders_resource, single_order_resource, order_content_resource, order_status_resource, \
    store_fulfilled_orders_resource, store_unfulfilled_orders_resource, store_orders_resource, user_validation_resource,\
    merchant_validation_resource, user_transaction_resources, store_transaction_resource, allergens_resource

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://seniorproject:seniorproject@rwsmith.me/seniorproject'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # reduce overhead
api = Api(app)
api.add_resource(user_resource.UserResource, '/users/<int:user_id>', '/users/')
api.add_resource(product_resource.ProductResource, '/products/<int:product_id>', '/products/')
api.add_resource(store_resource.StoreResource, '/stores/<int:store_id>', '/stores/')
api.add_resource(merchant_resource.MerchantResource, '/merchants/<int:merchant_id>', '/merchants/')
api.add_resource(ratings_user_product_resource.UserProductRatingResource, '/ratings/user/<int:user_id>/product/<int:product_id>/',
                 '/ratings/user/add/')
api.add_resource(store_feedback_resource.StoreFeedbackResource, '/storefeedback/<store_id>')
api.add_resource(store_menu_resource.StoreMenuResource, '/store_menu/<store_id>')
api.add_resource(ratings_user_all_resource.UserAllRatingsResource, '/ratings/all/users/<int:user_id>')
api.add_resource(ratings_user_average_resource.UserAverageRatingsResource, '/ratings/average/users/<int:user_id>')
api.add_resource(ratings_products_all_resource.ProductAllRatingsResource, '/ratings/all/products/<int:product_id>')
api.add_resource(ratings_products_average_resource.ProductAverageRatingsResource, '/ratings/average/products/<int:product_id>')
api.add_resource(store_search_store_resource.StoreSearchStoreResource, '/stores/search/<store_string>/')
api.add_resource(store_search_product_resource.StoreSearchProductResource,
                 '/stores/search/<int:store_id>/products/<product_type>/')
api.add_resource(product_search_products_resource.ProductSearchProductResource, '/products/search/type=<product_type>/')

api.add_resource(single_order_resource.OrderResource, '/orders/<int:order_id>', '/orders', '/orders/')
api.add_resource(all_orders_resource.OrdersResource, '/users/orders/<int:user_id>')

api.add_resource(order_status_resource.OrderStatusResource, '/orders/<int:order_id>/status')
api.add_resource(order_content_resource.OrderContentResource, '/orders/<int:order_id>/content', '/orders/content/')
api.add_resource(store_fulfilled_orders_resource.StoreFulfilledOrdersResource, '/stores/<int:store_id>/fulfilled-orders/')
api.add_resource(store_unfulfilled_orders_resource.StoreUnfulfilledOrdersResource, '/stores/<int:store_id>/unfulfilled-orders/')
api.add_resource(store_orders_resource.StoreOrdersResource, '/stores/<int:store_id>/orders')
api.add_resource(user_validation_resource.UserValidationResource, '/users/validate/<user_email>/<user_password>/')
api.add_resource(merchant_validation_resource.MerchantValidationResource, '/merchants/validate/<merchant_email>/<merchant_password>/')
api.add_resource(user_transaction_resources.UserTransactionResource, '/users/<int:user_id>/transactions/<time_string>')
api.add_resource(store_transaction_resource.StoreTransactionResource, '/stores/<int:store_id>/transactions/<time_string>')
api.add_resource(allergens_resource.AllergenResource, '/products/<int:product_id>/allergens', '/products/allergens')

@app.route('/', methods=['GET'])
def index():
    return jsonify({'msg': 'This endpoint is not valid, please use another one'})


# Generic 404 handler
@app.errorhandler(404)
def not_found(error):
    return jsonify({'status': 404, 'message': '404 NOT FOUND ' + request.url}), 404


@app.errorhandler(500)
def internal_servere_error(error):
    return jsonify({'status': 500, 'message': '500 INTERNAL SERVER ERROR ' + repr(error)})


if __name__ == '__main__':
    db.init_app(app)  # make the database model aware of our application
    app.run(debug=True, threaded=True, use_reloader=False)  # start the server
