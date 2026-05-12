-- Migration: change_ids_to_uuid
-- Drops and recreates User and Org to change id columns from TEXT (CUID) to UUID.
-- Safe for dev — no production data exists at this stage.

-- DropForeignKey
ALTER TABLE "Org" DROP CONSTRAINT "Org_createdBy_fkey";

-- DropTable
DROP TABLE "Org";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Org" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "onChainId" TEXT,
    "contractAddress" TEXT,
    "safeAddress" TEXT,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "status" "OrgStatus" NOT NULL DEFAULT 'PENDING_DEPLOYMENT',
    "chainId" INTEGER NOT NULL,
    "createdBy" UUID NOT NULL,
    "deployedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Org" ADD CONSTRAINT "Org_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
