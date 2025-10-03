
-- Init db with some buildin data

INSERT INTO "user" ("username", "password", "email", "display_name") VALUES
('admin', '123456', 'admin@example.com', 'admin'),
('user1', '123456', 'user1@example.com', 'user 1'),
('user2', '123456', 'user2@example.com', 'user 2'),
('user3', '123456', 'user3@example.com', 'user 3'),
('bob', '123456', 'bobbuilder@example.com', 'Bob Builder'),
('archi', '123456', 'archieachitect@example.com', 'Archie Achitect'),
('owen', '123456', 'owenowner@example.com', 'Owen Owner');

INSERT INTO "project" ("name") VALUES
('Demo project');

INSERT INTO "permission" ("key") VALUES
('Annotation.View'),
('Annotation.Add'),
('Annotation.Update'),
('Annotation.Delete'),
('Measurement.View'),
('Measurement.Add'),
('Measurement.Update'),
('Measurement.Delete');

-- Get the ID of the "Demo project" for association
DO $$
DECLARE
    projId INTEGER;
    userId1 INTEGER;
    userId2 INTEGER;
    userId3 INTEGER;
    userId4 INTEGER; -- bob
    userId5 INTEGER; -- archi
    userId6 INTEGER; -- owen
    permIdAnnoView INTEGER;
    permIdAnnoAdd INTEGER;
    permIdAnnoUpdate INTEGER;
    permIdAnnoDelete INTEGER;
    permIdMeasView INTEGER;
    permIdMeasAdd INTEGER;
    permIdMeasUpdate INTEGER;
    permIdMeasDelete INTEGER;
BEGIN
    -- Find the project_id of the "Demo project"
    SELECT "id" INTO projId FROM "project" WHERE "name" = 'Demo project';
    SELECT "id" INTO userId1 FROM "user" WHERE "username" = 'user1';
    SELECT "id" INTO userId2 FROM "user" WHERE "username" = 'user2';
    SELECT "id" INTO userId3 FROM "user" WHERE "username" = 'user3';
    SELECT "id" INTO userId4 FROM "user" WHERE "username" = 'bob';
    SELECT "id" INTO userId5 FROM "user" WHERE "username" = 'archi';
    SELECT "id" INTO userId6 FROM "user" WHERE "username" = 'owen';
    SELECT "id" INTO permIdAnnoView FROM "permission" WHERE "key" = 'Annotation.View';
    SELECT "id" INTO permIdAnnoAdd FROM "permission" WHERE "key" = 'Annotation.Add';
    SELECT "id" INTO permIdAnnoUpdate FROM "permission" WHERE "key" = 'Annotation.Update';
    SELECT "id" INTO permIdAnnoDelete FROM "permission" WHERE "key" = 'Annotation.Delete';
    SELECT "id" INTO permIdMeasView FROM "permission" WHERE "key" = 'Measurement.View';
    SELECT "id" INTO permIdMeasAdd FROM "permission" WHERE "key" = 'Measurement.Add';
    SELECT "id" INTO permIdMeasUpdate FROM "permission" WHERE "key" = 'Measurement.Update';
    SELECT "id" INTO permIdMeasDelete FROM "permission" WHERE "key" = 'Measurement.Delete';

    -- Insert users into the "project_user" table associated with the "Demo project"
    INSERT INTO "project_user" ("user_id", "proj_id") VALUES
    (userId1, projId),
    (userId2, projId),
    (userId3, projId),
    (userId4, projId),
    (userId5, projId),
    (userId6, projId);

    INSERT INTO "project_user_permission" ("proj_id", "user_id", "perm_id") VALUES
    -- Annotation
    (projId, userId1, permIdAnnoView),    -- user1 has all permissions
    (projId, userId1, permIdAnnoAdd),
    (projId, userId1, permIdAnnoUpdate),
    (projId, userId1, permIdAnnoDelete),
    (projId, userId2, permIdAnnoView),    -- user2 can view, add, update
    (projId, userId2, permIdAnnoAdd),
    (projId, userId2, permIdAnnoUpdate),
    (projId, userId3, permIdAnnoView),    -- user3 can view
    (projId, userId4, permIdAnnoView),    -- bob has all permissions
    (projId, userId4, permIdAnnoAdd),
    (projId, userId4, permIdAnnoUpdate),
    (projId, userId4, permIdAnnoDelete),
    (projId, userId5, permIdAnnoView),    -- archi can view, add, update
    (projId, userId5, permIdAnnoAdd),
    (projId, userId5, permIdAnnoUpdate),
    (projId, userId6, permIdAnnoView),    -- owen can delete
    -- Measurement
    (projId, userId1, permIdMeasView),    -- user1 has all permissions
    (projId, userId1, permIdMeasAdd),
    (projId, userId1, permIdMeasUpdate),
    (projId, userId1, permIdMeasDelete),
    (projId, userId2, permIdMeasView),    -- user2 can view, add, update
    (projId, userId2, permIdMeasAdd),
    (projId, userId2, permIdMeasUpdate),
    (projId, userId3, permIdMeasView),    -- user3 can view
    (projId, userId4, permIdMeasView),    -- bob has all permissions
    (projId, userId4, permIdMeasAdd),
    (projId, userId4, permIdMeasUpdate),
    (projId, userId4, permIdMeasDelete),
    (projId, userId5, permIdMeasView),    -- archi can view, add, update
    (projId, userId5, permIdMeasAdd),
    (projId, userId5, permIdMeasUpdate),
    (projId, userId6, permIdMeasView);    -- owen can delete

    INSERT INTO "annotation" ("proj_id", "data", "created_by") VALUES
    (projId, '{ "message": "Test annotation 1" }', userId1),
    (projId, '{ "message": "Test annotation 2" }', userId1),
    (projId, '{ "message": "Test annotation 3" }', userId2);

    INSERT INTO "measurement" ("proj_id", "data", "created_by") VALUES
    (projId, '{ "message": "Test measurement 1" }', userId1),
    (projId, '{ "message": "Test measurement 2" }', userId1),
    (projId, '{ "message": "Test measurement 3" }', userId2);

    INSERT INTO "room" ("name", "owner", "proj_id") VALUES
    ('Room 1', userId1, projId);

    INSERT INTO "stamp_template" ("name", "type", "data") VALUES
    ('Stamp1', 'CustomStamp', '{"name":"Stamp1","type":"image/svg+xml","content":"CiAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEzMSIgaGVpZ2h0PSI2MSI+CiAgICAgIDxyZWN0IHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iMTMwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMSIgcng9IjgiIHJ5PSI4Ii8+CiAgICAgIDx0ZXh0IHg9IjY1LjUiIHk9IjM2LjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsOyBmaWxsOiAjRTRBNDlDRkY7Ij4KICAgICAgICA8dHNwYW4+RHJhZnQ8L3RzcGFuPgogICAgICAgIAogICAgICA8L3RleHQ+CiAgICA8L3N2Zz4KICA="}'),
    ('Stamp2', 'UploadStamp', '{"content":"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","name":"Stamp2","type":"image/png"}');
END
$$;