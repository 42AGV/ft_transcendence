CREATE DATABASE ft_transcendence;

\c ft_transcendence;

CREATE TABLE IF NOT EXISTS local_file(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(100) NOT NULL,
  path VARCHAR(255) NOT NULL UNIQUE,
  mimetype VARCHAR(255) NOT NULL,
  size BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL UNIQUE,
  avatar_id UUID REFERENCES local_file(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
