CREATE TABLE
  IF NOT EXISTS LocalFile (
    "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    "filename" VARCHAR(100) NOT NULL UNIQUE,
    "path" VARCHAR(255) NOT NULL UNIQUE,
    "mimetype" VARCHAR(255) NOT NULL,
    "size" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS Users (
    "id" UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    "username" VARCHAR(20) NOT NULL UNIQUE,
    "email" VARCHAR(50) NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "password" TEXT,
    "avatarId" UUID UNIQUE REFERENCES LocalFile (id) ON DELETE SET NULL,
    "avatarX" SMALLINT DEFAULT 0,
    "avatarY" SMALLINT DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

CREATE TYPE ProviderType AS ENUM ('42');

CREATE TABLE
  IF NOT EXISTS AuthProvider (
    "providerId" TEXT NOT NULL,
    "provider" ProviderType NOT NULL,
    "userId" UUID REFERENCES Users (id) ON DELETE CASCADE,
    PRIMARY KEY ("providerId", "provider")
  );

CREATE TABLE
  IF NOT EXISTS ChatRoom (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "password" TEXT,
    "avatarId" UUID REFERENCES LocalFile(id) UNIQUE,
    "avatarX" SMALLINT DEFAULT 0,
    "avatarY" SMALLINT DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "ownerId" UUID REFERENCES Users(id)
  );

CREATE TABLE
  IF NOT EXISTS ChatRoomMembers (
  "chatId" UUID REFERENCES ChatRoom (id) ON DELETE CASCADE,
  "userId" UUID REFERENCES Users (id) ON DELETE CASCADE,
  "joinedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "admin" BOOLEAN DEFAULT false,
  "muted" BOOLEAN DEFAULT false,
  "banned" BOOLEAN DEFAULT false,
  PRIMARY KEY ("chatId", "userId")
  );

