ALTER TYPE "public"."expense_category" ADD VALUE 'rent' BEFORE 'other';--> statement-breakpoint
ALTER TYPE "public"."expense_category" ADD VALUE 'food-and-dining' BEFORE 'other';--> statement-breakpoint
ALTER TYPE "public"."expense_category" ADD VALUE 'insurance' BEFORE 'other';--> statement-breakpoint
ALTER TYPE "public"."expense_category" ADD VALUE 'personal-care' BEFORE 'other';--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "next_payment_date" DROP NOT NULL;