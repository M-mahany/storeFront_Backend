  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name varchar(150) NOT NULL,
    last_name varchar(150) NOT NULL,
    username varchar(150) UNIQUE NOT NULL,
    password varchar(150) NOT NULL,
    isAdmin BOOLEAN DEFAULT false
);