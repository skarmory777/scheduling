/*
  Warnings:

  - You are about to drop the column `bio` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `professionals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `professionals` DROP COLUMN `bio`,
    DROP COLUMN `specialization`;
