CREATE TABLE account(
    id                 SERIAL PRIMARY KEY,
    email              VARCHAR(64),
    hashed_password    CHARACTER(145)
);

CREATE TABLE message(
    id                 SERIAL PRIMARY KEY,
    subject            VARCHAR(64),
    content            VARCHAR(200)
);

CREATE TABLE account_message(
    account_id  INTEGER REFERENCES account(id),
    message_id  INTEGER REFERENCES message(id),
    used BOOLEAN NOT NULL,
    PRIMARY KEY (account_id, message_id)
);

INSERT INTO message VALUES (DEFAULT, 'Subject 1', 'Content 1');
INSERT INTO message VALUES (DEFAULT, 'Subject 2', 'Content 2');
INSERT INTO message VALUES (DEFAULT, 'Subject 3', 'Content 3');
INSERT INTO message VALUES (DEFAULT, 'Subject 4', 'Content 4');
INSERT INTO message VALUES (DEFAULT, 'Subject 5', 'Content 5');
INSERT INTO message VALUES (DEFAULT, 'Subject 6', 'Content 6');
INSERT INTO message VALUES (DEFAULT, 'Subject 7', 'Content 7');
INSERT INTO message VALUES (DEFAULT, 'Subject 8', 'Content 8');
INSERT INTO message VALUES (DEFAULT, 'Subject 9', 'Content 9');
INSERT INTO message VALUES (DEFAULT, 'Subject 10', 'Content 10');
