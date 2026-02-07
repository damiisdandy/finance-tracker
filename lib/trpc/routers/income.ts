import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db, income } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const incomeInput = z.object({
  name: z.string().min(1),
  amount: z.string(),
  frequency: z.enum(["hourly", "daily", "weekly", "monthly", "quarterly", "yearly", "one-time"]),
  isWorkHours: z.boolean().default(false),
  currency: z.enum(["NGN", "USD"]),
  type: z.enum(["salary", "interest", "other"]),
  date: z.string(),
});

export const incomeRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.select().from(income).where(eq(income.userId, ctx.session.user.id));
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const result = await db
      .select()
      .from(income)
      .where(and(eq(income.id, input.id), eq(income.userId, ctx.session.user.id)));
    return result[0] ?? null;
  }),

  create: protectedProcedure.input(incomeInput).mutation(async ({ ctx, input }) => {
    const result = await db
      .insert(income)
      .values({ ...input, userId: ctx.session.user.id })
      .returning();
    return result[0];
  }),

  update: protectedProcedure
    .input(incomeInput.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const result = await db
        .update(income)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(income.id, id), eq(income.userId, ctx.session.user.id)))
        .returning();
      return result[0];
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db
      .delete(income)
      .where(and(eq(income.id, input.id), eq(income.userId, ctx.session.user.id)));
    return { success: true };
  }),
});
