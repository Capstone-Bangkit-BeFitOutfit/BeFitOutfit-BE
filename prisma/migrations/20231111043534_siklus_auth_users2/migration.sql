/*
  Warnings:

  - You are about to drop the `categoriesonposts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `categoriesonposts` DROP FOREIGN KEY `CategoriesOnPosts_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `categoriesonposts` DROP FOREIGN KEY `CategoriesOnPosts_postId_fkey`;

-- DropTable
DROP TABLE `categoriesonposts`;

-- DropTable
DROP TABLE `category`;

-- DropTable
DROP TABLE `post`;
