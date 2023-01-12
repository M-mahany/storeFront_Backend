CREATE TABLE product(
    id SERIAL PRIMARY KEY, 
    product_name varchar(150) NOT NULL,
    price int NOT NULL,
    category varchar(150) NOT NULL
     );