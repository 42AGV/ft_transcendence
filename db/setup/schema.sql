CREATE DATABASE ft_transcendence;

\c ft_transcendence;

CREATE TABLE IF NOT EXISTS users(
    UUID        UUID DEFAULT gen_random_uuid()  PRIMARY KEY,
    USERNAME    VARCHAR(20)                     NOT NULL,
    EMAIL       VARCHAR(50)                     NOT NULL,
    IMG         VARCHAR(150)                    NOT NULL
);
