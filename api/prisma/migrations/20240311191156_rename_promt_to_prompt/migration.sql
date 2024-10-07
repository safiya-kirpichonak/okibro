BEGIN;

-- Drop the primary key constraint
ALTER TABLE "promts" DROP CONSTRAINT "promts_pkey";

-- Drop the unique index
DROP INDEX "promts_code_key";

-- Rename the table
ALTER TABLE "promts" RENAME TO "prompts";

-- Add the primary key constraint to the renamed table
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_pkey" PRIMARY KEY ("id");

-- Create the unique index on the renamed table
CREATE UNIQUE INDEX "prompts_code_key" ON "prompts"("code");

COMMIT;