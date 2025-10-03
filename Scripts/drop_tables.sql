-- Drop all tables, views and sequences

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.viewname) || ' CASCADE';
    END LOOP;
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- DROP VIEW IF EXISTS project_annotation CASCADE;
-- DROP TABLE IF EXISTS annotation CASCADE;
-- DROP TABLE IF EXISTS project_user_permission CASCADE;
-- DROP TABLE IF EXISTS project_user CASCADE;
-- DROP TABLE IF EXISTS permission CASCADE;
-- DROP TABLE IF EXISTS project CASCADE;
-- DROP TABLE IF EXISTS user CASCADE;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public')
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END $$;
