/*
  Warnings:

  - You are about to drop the column `admin_id` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_admin_id_fkey`;

-- DropIndex
DROP INDEX `Employee_admin_id_fkey` ON `employee`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `admin_id`;

-- DropTable
DROP TABLE `admin`;
