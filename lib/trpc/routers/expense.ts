import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db, expenses } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const expenseInput = z.object({
  name: z.string().min(1),
  amount: z.string(),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly", "one-time"]),
  currency: z.enum(["NGN", "USD"]),
  category: z.enum([
    "groceries",
    "transport",
    "utilities",
    "entertainment",
    "healthcare",
    "education",
    "shopping",
    "rent",
    "food-and-dining",
    "insurance",
    "personal-care",
    "other",
  ]),
  date: z.string().optional(),
});

export const expenseRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(expenses).where(eq(expenses.userId, ctx.session.user.id));
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const result = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, input.id), eq(expenses.userId, ctx.session.user.id)));
    return result[0] ?? null;
  }),

  create: protectedProcedure.input(expenseInput).mutation(async ({ ctx, input }) => {
    const { date, ...rest } = input;
    const result = await db
      .insert(expenses)
      .values({
        ...rest,
        date: date && date.length > 0 ? date : null,
        userId: ctx.session.user.id,
      })
      .returning();
    return result[0];
  }),

  update: protectedProcedure
    .input(expenseInput.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, date, ...data } = input;
      const result = await db
        .update(expenses)
        .set({
          ...data,
          date: date && date.length > 0 ? date : null,
          updatedAt: new Date(),
        })
        .where(and(eq(expenses.id, id), eq(expenses.userId, ctx.session.user.id)))
        .returning();
      return result[0];
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db
      .delete(expenses)
      .where(and(eq(expenses.id, input.id), eq(expenses.userId, ctx.session.user.id)));
    return { success: true };
  }),
});
