# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index [GET]`(/products)`
- Show BY ID [GET]`(/products/:productid)`
- Create [POST]`(/users/:userid/products)`
- DELETE [DELETE] `(/users/:userid/products/:productid)`
- UPDATE [PUT] `(/users/:userid/products)`

#### Users

- Index [GET]`(/users)`
- Show BY ID [GET]`(/users/:userid)`
- Create N [POST] `(/auth/register)`
- LOGIN [GET]`(auth/login)`
- DELETE USER [DELETE] `(/users/:userid)`
- UPDATE USER PASSWORD [PUT] `(/users/)`

#### Orders

- SHOW ALL ORDERS [GET] `(/orders)`
- GET ORDERS BY ID [GET] `(/users/:userid/orders)`
- DELETE ORDER [DELETE]`(/users/:userid/orders/:orderid)`
- CREATE NEW ORDER [POST]`(/users/:userid/orders")`
- UPDATE ORDER STATUS [PUT]`(/users/:userid/orders/:orderid)`
- ADD PRODUCTS TO ORDERS [POST]`(/users/:userid/orders/:orderid)`

## Data Shapes

#### Product

CREATE TABLE product(
id SERIAL PRIMARY KEY,
product_name varchar(150) NOT NULL,
price int NOT NULL,
category varchar(150) NOT NULL
);

#### User

CREATE TABLE users(
id SERIAL PRIMARY KEY,
first_name varchar(150) NOT NULL,
last_name varchar(150) NOT NULL,
username varchar(150) UNIQUE NOT NULL,
password varchar(150) NOT NULL,
isAdmin BOOLEAN DEFAULT false
);

#### Orders

CREATE TABLE orders(
id SERIAL PRIMARY KEY,
user_id BIGINT NOT NULL,
status varchar(50) DEFAULT 'active',
CONSTRAINT fk_orders_users
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE
ON UPDATE CASCADE
);

#### Product_Orders

CREATE TABLE product_order(
id SERIAL PRIMARY KEY,
order_id BIGINT NOT NULL,
product_id BIGINT NOT NULL,
quantity INT NOT NULL,
CONSTRAINT fk_order
FOREIGN KEY (order_id)
REFERENCES orders(id)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT fk_products
FOREIGN KEY (product_id)
REFERENCES product(id)
ON DELETE CASCADE
ON UPDATE CASCADE
);
