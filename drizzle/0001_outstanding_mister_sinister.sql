ALTER TYPE "public"."frequency" ADD VALUE 'hourly' BEFORE 'daily';--> statement-breakpoint
ALTER TABLE "income" ADD COLUMN "is_work_hours" boolean DEFAULT false NOT NULL;