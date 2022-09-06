CREATE TABLE
  IF NOT EXISTS LocalFile(
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "filename" VARCHAR(100) NOT NULL UNIQUE,
    "path" VARCHAR(255) NOT NULL UNIQUE,
    "mimetype" VARCHAR(255) NOT NULL,
    "size" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

CREATE TABLE
  IF NOT EXISTS Users(
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "username" VARCHAR(20) NOT NULL UNIQUE,
    "email" VARCHAR(50) NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "password" TEXT,
    "avatarId" UUID REFERENCES LocalFile(id) UNIQUE,
    "avatarX" SMALLINT,
    "avatarY" SMALLINT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

CREATE TYPE ProviderType AS ENUM ('42');

CREATE TABLE
  IF NOT EXISTS AuthProvider (
    "providerId" TEXT NOT NULL,
    "provider" ProviderType NOT NULL,
    "userId" UUID REFERENCES Users(id),
    PRIMARY KEY ("providerId", "provider")
  )
