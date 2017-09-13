DROP TABLE IF EXISTS Merchant CASCADE;
CREATE TABLE Merchant(
merchant_ID SERIAL PRIMARY KEY NOT NULL,
merchant_Fname TEXT NOT NULL,
merchant_Lname TEXT NOT NULL,
merchant_Email TEXT NOT NULL,
merchant_Phone TEXT NOT NULL,
merchant_Password TEXT NOT NULL,
merchant_PayPal_ID TEXT NOT NULL,
merchant_License TEXT NOT NULL
);

DROP TABLE IF EXISTS Store CASCADE;
CREATE TABLE Store(
store_ID SERIAL PRIMARY KEY NOT NULL,
merchant_ID SERIAL NOT NULL REFERENCES Merchant(merchant_ID),
store_Name TEXT NOT NULL,
store_Address TEXT NOT NULL,
store_Offline boolean NOT NULL,
store_Close_Time TEXT NOT NULL,
store_Open_Time TEXT NOT NULL,
store_Delivery int NOT NULL,
store_Phone TEXT NOT NULL
);

DROP TABLE IF EXISTS Product CASCADE;
CREATE TABLE Product(
product_ID SERIAL PRIMARY KEY NOT NULL,
store_ID SERIAL NOT NULL REFERENCES Store(store_ID),
product_Name TEXT NOT NULL,
product_Price NUMERIC NOT NULL,
product_Picture TEXT NOT NULL,
product_Description TEXT NOT NULL,
product_Type TEXT NOT NULL,
product_Unit_Amount int NOT NULL
);

DROP TABLE IF EXISTS Allergens CASCADE;

CREATE TABLE Allergens(
product_ID SERIAL NOT NULL REFERENCES Product(product_ID),
allergy_Type TEXT NOT NULL,
PRIMARY KEY (product_ID, allergy_Type)
);

DROP TABLE IF EXISTS Users CASCADE;

CREATE TABLE Users(
user_ID SERIAL PRIMARY KEY NOT NULL,
user_First_Name TEXT NOT NULL,
user_Last_Name TEXT NOT NULL,
user_Address TEXT,
user_Email TEXT NOT NULL,
user_Phone TEXT NOT NULL,
user_Password TEXT NOT NULL,
user_PayPal_ID TEXT NOT NULL
);

DROP TABLE IF EXISTS StoreFeedback CASCADE;
CREATE TABLE StoreFeedback(
store_ID SERIAL NOT NULL REFERENCES Store(store_ID),
user_ID SERIAL NOT NULL REFERENCES Users(user_ID),
entry TEXT NOT NULL,
feedback_Date DATE NOT NULL,
PRIMARY KEY (store_ID, user_ID)
);

DROP TABLE IF EXISTS Rating CASCADE;
CREATE TABLE Rating(
product_ID SERIAL NOT NULL REFERENCES Product(product_ID),
user_ID SERIAL NOT NULL REFERENCES Users(user_ID),
entry TEXT,
rating_Value int NOT NULL,
rating_Date DATE NOT NULL,
PRIMARY KEY (product_ID, user_ID)
);

DROP TABLE IF EXISTS Orders CASCADE;
CREATE TABLE Orders(
order_ID SERIAL PRIMARY KEY NOT NULL,
user_ID SERIAL NOT NULL REFERENCES Users(user_ID),
status_ID int NOT NULL,
order_Date DATE NOT NULL,
order_Address TEXT NOT NULL
);

DROP TABLE IF EXISTS Status CASCADE;
CREATE TABLE Status(
status_ID SERIAL PRIMARY KEY NOT NULL,
status_Definition TEXT NOT NULL
);

DROP TABLE IF EXISTS OrderContent CASCADE;
CREATE TABLE OrderContent(
order_ID SERIAL NOT NULL REFERENCES Orders(order_ID),
product_ID SERIAL NOT NULL REFERENCES Product(product_ID),
order_Quantity int NOT NULL,
PRIMARY KEY (order_ID, product_ID)
);
