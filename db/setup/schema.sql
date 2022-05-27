CREATE DATABASE ft_transcendence;

\c ft_transcendence;

CREATE TABLE IF NOT EXISTS users(
    ID          UUID DEFAULT gen_random_uuid()  PRIMARY KEY,
    USERNAME    VARCHAR(20)                     NOT NULL UNIQUE,
    EMAIL       VARCHAR(50)                     NOT NULL UNIQUE,
    AVATAR      VARCHAR(150),
    CREATED_AT  TIMESTAMPTZ                     NOT NULL DEFAULT now()
);
