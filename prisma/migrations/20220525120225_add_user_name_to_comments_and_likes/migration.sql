-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "user_name" TEXT;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "user_name" TEXT;

-- AlterTable
ALTER TABLE "commentLike" ADD COLUMN     "user_name" TEXT;
