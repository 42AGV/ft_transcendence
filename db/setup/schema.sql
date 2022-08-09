CREATE DATABASE ft_transcendence;

\c ft_transcendence;

CREATE TABLE IF NOT EXISTS LocalFile(
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "filename" VARCHAR(100) NOT NULL UNIQUE,
  "path" VARCHAR(255) NOT NULL UNIQUE,
  "mimetype" VARCHAR(255) NOT NULL,
  "size" BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS Users(
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "username" VARCHAR(20) NOT NULL UNIQUE,
  "email" VARCHAR(50) NOT NULL UNIQUE,
  "avatarId" UUID REFERENCES LocalFile(id) UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
