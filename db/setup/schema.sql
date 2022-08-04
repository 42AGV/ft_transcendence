CREATE DATABASE ft_transcendence;

\c ft_transcendence;

CREATE TABLE IF NOT EXISTS Users(
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "username" VARCHAR(20) NOT NULL UNIQUE,
  "email" VARCHAR(50) NOT NULL UNIQUE,
  "avatar" VARCHAR(150),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
