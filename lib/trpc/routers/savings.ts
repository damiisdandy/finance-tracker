import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db, savingsAccounts } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const savingsInput = z.object({
  name: z.string().min(1),
  balance: z.string(),
  monthlyContribution: z.string().optional(),
  interestRate: z.string().optional(),
  currency: z.enum(["NGN", "USD"]),
});

export const savingsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(savingsAccounts)
      .where(eq(savingsAccounts.userId, ctx.session.user.id));
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const result = await db
      .select()
      .from(savingsAccounts)
      .where(and(eq(savingsAccounts.id, input.id), eq(savingsAccounts.userId, ctx.session.user.id)));
    return result[0] ?? null;
  }),

  create: protectedProcedure.input(savingsInput).mutation(async ({ ctx, input }) => {
    const result = await db
      .insert(savingsAccounts)
      .values({ ...input, userId: ctx.session.user.id })
      .returning();
    return result[0];
  }),

  update: protectedProcedure
    .input(savingsInput.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const result = await db
        .update(savingsAccounts)
        .set({ ...data, lastUpdated: new Date(), updatedAt: new Date() })
        .where(and(eq(savingsAccounts.id, id), eq(savingsAccounts.userId, ctx.session.user.id)))
        .returning();
      return result[0];
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db
      .delete(savingsAccounts)
      .where(and(eq(savingsAccounts.id, input.id), eq(savingsAccounts.userId, ctx.session.user.id)));
    return { success: true };
  }),
});
