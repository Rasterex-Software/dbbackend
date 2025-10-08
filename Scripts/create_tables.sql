-- ==========================================================
--  CREATE TABLES SCRIPT (Full Variant with Legacy Tables)
--  Project: rx-back-end
--  Purpose: Includes all current live tables plus legacy ones
-- ==========================================================

-- ==========================================================
-- 1. Table: public.user
-- ==========================================================
DROP TABLE IF EXISTS public."user" CASCADE;

CREATE TABLE IF NOT EXISTS public."user"
(
    id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    display_name character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_username_key UNIQUE (username)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to postgres;



-- ==========================================================
-- 2. Table: public.project
-- ==========================================================
DROP TABLE IF EXISTS public.project CASCADE;

CREATE TABLE IF NOT EXISTS public.project
(
    id integer NOT NULL DEFAULT nextval('project_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "desc" text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT project_pkey PRIMARY KEY (id),
    CONSTRAINT project_name_key UNIQUE (name)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project
    OWNER to postgres;



-- ==========================================================
-- 3. Table: public.permission
-- ==========================================================
DROP TABLE IF EXISTS public.permission CASCADE;

CREATE TABLE IF NOT EXISTS public.permission
(
    id integer NOT NULL DEFAULT nextval('permission_id_seq'::regclass),
    key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "desc" text COLLATE pg_catalog."default",
    CONSTRAINT permission_pkey PRIMARY KEY (id),
    CONSTRAINT permission_key_key UNIQUE (key)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.permission
    OWNER to postgres;



-- ==========================================================
-- 4. Table: public.project_user
-- ==========================================================
DROP TABLE IF EXISTS public.project_user CASCADE;

CREATE TABLE IF NOT EXISTS public.project_user
(
    id integer NOT NULL DEFAULT nextval('project_user_id_seq'::regclass),
    proj_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT project_user_pkey PRIMARY KEY (id),
    CONSTRAINT project_user_proj_id_user_id_key UNIQUE (proj_id, user_id),
    CONSTRAINT project_user_proj_id_fkey FOREIGN KEY (proj_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT project_user_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_user
    OWNER to postgres;



-- ==========================================================
-- 5. Table: public.project_user_permission
-- ==========================================================
DROP TABLE IF EXISTS public.project_user_permission CASCADE;

CREATE TABLE IF NOT EXISTS public.project_user_permission
(
    id integer NOT NULL DEFAULT nextval('project_user_permission_id_seq'::regclass),
    proj_id integer NOT NULL,
    user_id integer NOT NULL,
    perm_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT project_user_permission_pkey PRIMARY KEY (id),
    CONSTRAINT project_user_permission_proj_id_user_id_perm_id_key UNIQUE (proj_id, user_id, perm_id),
    CONSTRAINT project_user_permission_perm_id_fkey FOREIGN KEY (perm_id)
        REFERENCES public.permission (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT project_user_permission_proj_id_fkey FOREIGN KEY (proj_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT project_user_permission_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_user_permission
    OWNER to postgres;



-- ==========================================================
-- 6. Table: public.room
-- ==========================================================
DROP TABLE IF EXISTS public.room CASCADE;

CREATE TABLE IF NOT EXISTS public.room
(
    id integer NOT NULL DEFAULT nextval('room_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "desc" text COLLATE pg_catalog."default",
    owner integer,
    proj_id integer,
    is_closed boolean,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT room_pkey PRIMARY KEY (id),
    CONSTRAINT room_name_key UNIQUE (name),
    CONSTRAINT room_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT room_owner_fkey FOREIGN KEY (owner)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT room_proj_id_fkey FOREIGN KEY (proj_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT room_updated_by_fkey FOREIGN KEY (updated_by)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.room
    OWNER to postgres;



-- ==========================================================
-- 7. Table: public.annotation
-- ==========================================================
DROP TABLE IF EXISTS public.annotation CASCADE;

CREATE TABLE IF NOT EXISTS public.annotation
(
    id integer NOT NULL DEFAULT nextval('annotation_id_seq'::regclass),
    proj_id integer NOT NULL,
    doc_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    data text COLLATE pg_catalog."default",
    created_by integer,
    updated_by integer,
    is_deleted boolean,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    room_id text COLLATE pg_catalog."default",
    CONSTRAINT annotation_pkey PRIMARY KEY (id),
    CONSTRAINT annotation_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT annotation_proj_id_fkey FOREIGN KEY (proj_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT annotation_updated_by_fkey FOREIGN KEY (updated_by)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.annotation
    OWNER to postgres;



-- ==========================================================
-- 8. Function: public.trg_after_annotation_insert_func()
-- ==========================================================
DROP FUNCTION IF EXISTS public.trg_after_annotation_insert_func() CASCADE;

CREATE OR REPLACE FUNCTION public.trg_after_annotation_insert_func()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    IF NEW.room_id = '' THEN
        INSERT INTO annotation_event_log (event_type, event_data)
        VALUES ('add_annotation', row_to_json(NEW)::jsonb);
    END IF;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.trg_after_annotation_insert_func()
    OWNER TO postgres;



-- ==========================================================
-- 9. Trigger: trg_after_annotation_insert
-- ==========================================================
DROP TRIGGER IF EXISTS trg_after_annotation_insert ON public.annotation;

CREATE OR REPLACE TRIGGER trg_after_annotation_insert
    AFTER INSERT
    ON public.annotation
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_after_annotation_insert_func();



-- ==========================================================
-- 10. Table: public.annotation_event_log
-- ==========================================================
DROP TABLE IF EXISTS public.annotation_event_log CASCADE;

CREATE TABLE IF NOT EXISTS public.annotation_event_log
(
    id bigint NOT NULL DEFAULT nextval('annotation_event_log_id_seq'::regclass),
    event_type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    event_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    processed_at timestamp with time zone,
    CONSTRAINT annotation_event_log_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.annotation_event_log
    OWNER to postgres;



-- ==========================================================
-- 11. Table: public.measurement
-- ==========================================================
DROP TABLE IF EXISTS public.measurement CASCADE;

CREATE TABLE IF NOT EXISTS public.measurement
(
    id integer NOT NULL DEFAULT nextval('measurement_id_seq'::regclass),
    proj_id integer NOT NULL,
    data text COLLATE pg_catalog."default",
    created_by integer,
    updated_by integer,
    is_deleted boolean,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT measurement_pkey PRIMARY KEY (id),
    CONSTRAINT measurement_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT measurement_proj_id_fkey FOREIGN KEY (proj_id)
        REFERENCES public.project (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT measurement_updated_by_fkey FOREIGN KEY (updated_by)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.measurement
    OWNER to postgres;



-- ==========================================================
-- 12. Legacy Table: public.stamp_template
-- ==========================================================
DROP TABLE IF EXISTS public.stamp_template CASCADE;

CREATE TABLE IF NOT EXISTS public.stamp_template
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type TEXT NOT NULL,
    "desc" TEXT,
    data TEXT NOT NULL,
    created_by INTEGER REFERENCES public."user" (id),
    updated_by INTEGER REFERENCES public."user" (id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.stamp_template
    OWNER TO postgres;



-- ==========================================================
-- 13. Legacy View: public.project_annotation
-- ==========================================================
DROP VIEW IF EXISTS public.project_annotation CASCADE;

CREATE VIEW public.project_annotation AS
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

-- ==========================================================
-- END OF FILE
-- ==========================================================
