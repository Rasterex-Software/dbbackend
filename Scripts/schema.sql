-- Create a database named "postgres" if it does not exist
DO $$
BEGIN
    -- Check if the database already exists
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'postgres') THEN
        -- Create the database
        CREATE DATABASE "postgres";
    END IF;
END
$$;

-- For now, always drop everything, re-create tables and insert initial data
\i drop_tables.sql
\i create_tables.sql
\i insert_data.sql
