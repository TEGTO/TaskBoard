CREATE TABLE IF NOT EXISTS "Users"(
    "Id" TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS "BoardTaskLists"(
    "Id" TEXT PRIMARY KEY,
    "UserId" TEXT REFERENCES "Users"("Id") ON DELETE CASCADE NOT NULL,
    "CreationTime" TIMESTAMPTZ NOT NULL,
    "Name" TEXT
);
CREATE TABLE IF NOT EXISTS "BoardTasks"(
    "Id" TEXT PRIMARY KEY,
    "BoardTaskListId" TEXT REFERENCES "BoardTaskLists"("Id")  ON DELETE CASCADE NOT NULL,
    "CreationTime" TIMESTAMPTZ NOT NULL,
    "DueTime" TIMESTAMPTZ,
    "Name" TEXT,
    "Description" TEXT,
    "Priority" INT NOT NULL,
    "PrevTaskId" TEXT,
    "NextTaskId" TEXT
);
CREATE TABLE IF NOT EXISTS "BoardActivities"(
    "Id" TEXT PRIMARY KEY,
    "UserId" TEXT REFERENCES "Users"("Id") ON DELETE CASCADE NOT NULL,
    "ActivityTime" TIMESTAMPTZ NOT NULL,
    "Description" TEXT
);
CREATE TABLE IF NOT EXISTS "BoardTaskActivities"(
    "Id" TEXT PRIMARY KEY,
    "BoardTaskId" TEXT REFERENCES "BoardTasks"("Id") ON DELETE CASCADE NOT NULL,
    "ActivityTime" TIMESTAMPTZ NOT NULL,
    "Description" TEXT
);

INSERT INTO "Users" ("Id") VALUES ('1');
INSERT INTO "BoardTaskLists" ("Id", "UserId", "CreationTime", "Name") VALUES ('1', '1', '2024-05-24 16:09:00', 'To do');
INSERT INTO "BoardTaskLists" ("Id", "UserId", "CreationTime", "Name") VALUES ('2', '1', '2024-05-24 16:09:00', 'Large nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
INSERT INTO "BoardTasks" ("Id", "BoardTaskListId", "CreationTime", "DueTime", "Name", "Description", "Priority", "NextTaskId") VALUES ('1', '1', '2024-05-24 17:09:00','2024-05-24 18:09:00', 'Groceries', 'Buy groceries', 1, '2');
INSERT INTO "BoardTasks" ("Id", "BoardTaskListId", "CreationTime", "DueTime", "Name", "Description", "Priority", "PrevTaskId") VALUES ('2', '1', '2024-05-24 17:09:00','2024-05-24 18:09:00', 
'Large nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', 'Large descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn', 1, '1');
INSERT INTO "BoardActivities" ("Id","UserId", "ActivityTime", "Description") VALUES ('1','1', '2024-05-24 16:15:00', 'Renamed New list to To do');
INSERT INTO "BoardActivities" ("Id","UserId", "ActivityTime", "Description") VALUES ('2','1', '2024-05-24 16:15:00', 'Large activityyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
INSERT INTO "BoardTaskActivities" ("Id", "BoardTaskId", "ActivityTime", "Description") VALUES ('1', '1', '2024-05-24 17:15:00', 'Renamed ⦿ New task to ⦿ Groceries');
INSERT INTO "BoardTaskActivities" ("Id", "BoardTaskId", "ActivityTime", "Description") VALUES ('2', '1', '2024-05-24 17:15:00', 'Large activityyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
