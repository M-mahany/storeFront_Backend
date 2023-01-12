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