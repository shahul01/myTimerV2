/*
  Warnings:

  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "timerInput" TEXT NOT NULL,
    "currentTimer" TEXT NOT NULL
);
INSERT INTO "new_Task" ("currentTimer", "id", "timerInput", "title") SELECT "currentTimer", "id", "timerInput", "title" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_id_key" ON "Task"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
