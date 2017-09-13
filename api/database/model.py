# A SQLAlchemy Model for the Database
# Generated from the existing DDL with `sqlacodegen` tool
# With some hand modifications
# The only need to touch this file is if any DDLs need to be written
# TODO: Check into using Alembic for database migrations here

from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, Text, text, Numeric
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy

# useful link: http://stackoverflow.com/questions/9692962/flask-sqlalchemy-import-context-issue/9695045#9695045
db = SQLAlchemy()


class Allergen(db.Model):
    __tablename__ = 'allergens'

    product_id = Column(ForeignKey(u'product.product_id'), primary_key=True, nullable=False, server_default=text("nextval('allergens_product_id_seq'::regclass)"))
    allergy_type = Column(Text, primary_key=True, nullable=False)

    product = relationship(u'Product')


class Baker(db.Model):
    __tablename__ = 'baker'

    baker_id = Column(Integer, primary_key=True, server_default=text("nextval('baker_baker_id_seq'::regclass)"))
    baker_fname = Column(Text, nullable=False)
    baker_lname = Column(Text, nullable=False)
    baker_email = Column(Text, nullable=False)
    baker_phone = Column(Text, nullable=False)
    baker_password = Column(Text, nullable=False)
    bakerpaypal_id = Column(Text, nullable=False)
    baker_license = Column(Text, nullable=False)


class Bakery(db.Model):
    __tablename__ = 'bakery'

    bakery_id = Column(Integer, primary_key=True, server_default=text("nextval('bakery_bakery_id_seq'::regclass)"))
    baker_id = Column(ForeignKey(u'baker.baker_id'), nullable=False)
    bakery_name = Column(Text, nullable=False)
    bakery_address = Column(Text, nullable=False)
    bakery_offline = Column(Boolean, nullable=False)
    close_time = Column(Text, nullable=False)
    open_time = Column(Text, nullable=False)
    delivery = Column(Integer, nullable=False)
    phone_number = Column(Text, nullable=False)

    baker = relationship(u'Baker')


class Bakeryfeedback(db.Model):
    __tablename__ = 'bakeryfeedback'

    bakery_id = Column(ForeignKey(u'bakery.bakery_id'), primary_key=True, nullable=False, server_default=text("nextval('bakeryfeedback_bakery_id_seq'::regclass)"))
    user_id = Column(Integer, primary_key=True, nullable=False)
    entry = Column(Text, nullable=False)
    feedback_date = Column(Date, nullable=False)

    bakery = relationship(u'Bakery')


class HelloWorld(db.Model):
    __tablename__ = 'hello_world'

    some_stuff = Column(Text, primary_key=True)


class Merchant(db.Model):
    __tablename__ = 'merchant'

    merchant_id = Column(Integer, primary_key=True, server_default=text("nextval('merchant_merchant_id_seq'::regclass)"))
    merchant_fname = Column(Text, nullable=False)
    merchant_lname = Column(Text, nullable=False)
    merchant_email = Column(Text, nullable=False)
    merchant_phone = Column(Text, nullable=False)
    merchant_password = Column(Text, nullable=False)
    merchant_paypal_id = Column(Text, nullable=False)
    merchant_license = Column(Text, nullable=False)


class OrderContent(db.Model):
    __tablename__ = 'ordercontent'

    order_id = Column(ForeignKey(u'orders.order_id'), primary_key=True, nullable=False, server_default=text("nextval('ordercontent_order_id_seq'::regclass)"))
    product_id = Column(ForeignKey(u'product.product_id'), primary_key=True, nullable=False, server_default=text("nextval('ordercontent_product_id_seq'::regclass)"))
    order_quantity = Column(Integer, nullable=False)

    order = relationship(u'Order')
    product = relationship(u'Product')


class Order(db.Model):
    __tablename__ = 'orders'

    order_id = Column(Integer, primary_key=True, server_default=text("nextval('orders_order_id_seq'::regclass)"))
    user_id = Column(ForeignKey(u'users.user_id'), nullable=False, server_default=text("nextval('orders_user_id_seq'::regclass)"))
    status_id = Column(Integer, nullable=False)
    order_date = Column(Date, nullable=False)
    order_address = Column(Text, nullable=False)

    user = relationship(u'User')


class Product(db.Model):
    __tablename__ = 'product'

    product_id = Column(Integer, primary_key=True, server_default=text("nextval('product_product_id_seq'::regclass)"))
    store_id = Column(ForeignKey(u'bakery.bakery_id'), nullable=False, server_default=text("nextval('product_store_id_seq'::regclass)"))
    product_name = Column(Text, nullable=False)
    product_price = Column(Numeric, nullable=False)
    product_picture = Column(Text, nullable=False)
    product_description = Column(Text, nullable=False)
    product_type = Column(Text, nullable=False)
    product_unit_amount = Column(Integer, nullable=False)

    store = relationship(u'Bakery')


class Rating(db.Model):
    __tablename__ = 'rating'

    product_id = Column(ForeignKey(u'product.product_id'), primary_key=True, nullable=False, server_default=text("nextval('rating_product_id_seq'::regclass)"))
    user_id = Column(ForeignKey(u'users.user_id'), primary_key=True, nullable=False, server_default=text("nextval('rating_user_id_seq'::regclass)"))
    entry = Column(Text)
    rating_value = Column(Integer, nullable=False)
    rating_date = Column(Date, nullable=False)

    product = relationship(u'Product')
    user = relationship(u'User')


class Status(db.Model):
    __tablename__ = 'status'

    status_id = Column(Integer, primary_key=True, server_default=text("nextval('status_status_id_seq'::regclass)"))
    status_definition = Column(Text, nullable=False)


class Store(db.Model):
    __tablename__ = 'store'

    store_id = Column(Integer, primary_key=True, server_default=text("nextval('store_store_id_seq'::regclass)"))
    merchant_id = Column(ForeignKey(u'merchant.merchant_id'), nullable=False, server_default=text("nextval('store_merchant_id_seq'::regclass)"))
    store_name = Column(Text, nullable=False)
    store_address = Column(Text, nullable=False)
    store_offline = Column(Boolean, nullable=False)
    store_close_time = Column(Text, nullable=False)
    store_open_time = Column(Text, nullable=False)
    store_delivery = Column(Integer, nullable=False)
    store_phone = Column(Text, nullable=False)

    merchant = relationship(u'Merchant')


class Storefeedback(db.Model):
    __tablename__ = 'storefeedback'

    store_id = Column(ForeignKey(u'store.store_id'), primary_key=True, nullable=False, server_default=text("nextval('storefeedback_store_id_seq'::regclass)"))
    user_id = Column(ForeignKey(u'users.user_id'), primary_key=True, nullable=False, server_default=text("nextval('storefeedback_user_id_seq'::regclass)"))
    entry = Column(Text, nullable=False)
    feedback_date = Column(Date, nullable=False)

    store = relationship(u'Store')
    user = relationship(u'User')


class User(db.Model):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, server_default=text("nextval('users_user_id_seq'::regclass)"))
    user_first_name = Column(Text, nullable=False)
    user_last_name = Column(Text, nullable=False)
    user_address = Column(Text)
    user_email = Column(Text, nullable=False)
    user_phone = Column(Text, nullable=False)
    user_password = Column(Text, nullable=False)
    user_paypal_id = Column(Text, nullable=False)