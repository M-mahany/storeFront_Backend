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
            ON  UPDATE CASCADE
 );