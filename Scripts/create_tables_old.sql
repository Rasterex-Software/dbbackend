
-- Create the "user" table
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL, -- simply use plain text
    "display_name" VARCHAR(255),
    "email" VARCHAR(255), -- don't need to be unique
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the "project" table
CREATE TABLE "project" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "desc" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the "permission" table
CREATE TABLE "permission" (
    "id" SERIAL PRIMARY KEY,
    "key" VARCHAR(255) NOT NULL UNIQUE,
    "desc" TEXT
);

-- Create the "project_user" table
CREATE TABLE "project_user" (
    "id" SERIAL PRIMARY KEY,
    "proj_id" INTEGER NOT NULL REFERENCES "project" ("id") ON DELETE CASCADE,
    "user_id" INTEGER NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("proj_id", "user_id")  -- Ensures unique combination of proj_id and user_id
);

-- Create the "project_user_permission" table
-- This table will have foreign keys to both "project" and "permission"
CREATE TABLE "project_user_permission" (
    "id" SERIAL PRIMARY KEY,
    "proj_id" INTEGER NOT NULL REFERENCES "project" ("id") ON DELETE CASCADE,
    "user_id" INTEGER NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "perm_id" INTEGER NOT NULL REFERENCES "permission" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("proj_id", "user_id", "perm_id")  -- Ensures unique combination of proj_id, user_id, and perm_id
);

-- Create the "annotation" table
CREATE TABLE "annotation" (
    "id" SERIAL PRIMARY KEY,
    "proj_id" INTEGER NOT NULL REFERENCES "project" ("id") ON DELETE CASCADE,
    "data" TEXT, -- json data
    "created_by" INTEGER REFERENCES "user" ("id"),
    "updated_by" INTEGER REFERENCES "user" ("id"), -- last updated by
    "is_deleted" BOOLEAN, -- soft delete
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the "measurement" table
CREATE TABLE "measurement" (
    "id" SERIAL PRIMARY KEY,
    "proj_id" INTEGER NOT NULL REFERENCES "project" ("id") ON DELETE CASCADE,
    "data" TEXT, -- json data
    "created_by" INTEGER REFERENCES "user" ("id"),
    "updated_by" INTEGER REFERENCES "user" ("id"), -- last updated by
    "is_deleted" BOOLEAN, -- soft delete
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the collab "room" table
CREATE TABLE "room" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE, -- may remove "UNIQUE"
    "desc" TEXT,
    "owner" INTEGER REFERENCES "user" ("id"),
    "proj_id" INTEGER REFERENCES "project" ("id"), -- optional
    "is_closed" BOOLEAN,
    "created_by" INTEGER REFERENCES "user" ("id"),
    "updated_by" INTEGER REFERENCES "user" ("id"), -- last updated by
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "stamp_template" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "type" TEXT NOT NULL,
    "desc" TEXT,
    "data" TEXT NOT NULL,
    "created_by" INTEGER REFERENCES "user" ("id"),
    "updated_by" INTEGER REFERENCES "user" ("id"), -- last updated by
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project - annotation view
CREATE VIEW "project_annotation" AS
SELECT
    a.id AS anno_id,
    a.created_by,
    a.updated_by,
    a.created_at,
    a.updated_at,
    p.id AS proj_id,
    p.name AS proj_name,
    p.desc AS proj_desc
FROM
    annotation a
JOIN
    project p ON a.proj_id = p.id;