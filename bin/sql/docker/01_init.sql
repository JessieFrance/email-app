CREATE TABLE account(
    id                 SERIAL PRIMARY KEY,
    email              VARCHAR(64),
    hashed_password    CHARACTER(145)
);
