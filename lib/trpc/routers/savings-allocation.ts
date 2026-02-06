import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db, savingsAllocations } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const savingsAllocationInput = z.object({
  name: z.string().min(1),
  amount: z.string(),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly", "one-time"]),
  currency: z.enum(["NGN", "USD"]),
  savingsAccountId: z.number().nullable().optional(),
  date: z.string(),
});

export const savingsAllocationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(savingsAllocations)
      .where(eq(savingsAllocations.userId, ctx.session.user.id));
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const result = await db
      .select()
      .from(savingsAllocations)
      .where(and(eq(savingsAllocations.id, input.id), eq(savingsAllocations.userId, ctx.session.user.id)));
    return result[0] ?? null;
  }),

  create: protectedProcedure.input(savingsAllocationInput).mutation(async ({ ctx, input }) => {
    const result = await db
      .insert(savingsAllocations)
      .values({ ...input, userId: ctx.session.user.id })
      .returning();
    return result[0];
  }),

  update: protectedProcedure
    .input(savingsAllocationInput.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const result = await db
        .update(savingsAllocations)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(savingsAllocations.id, id), eq(savingsAllocations.userId, ctx.session.user.id)))
        .returning();
      return result[0];
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db
      .delete(savingsAllocations)
      .where(and(eq(savingsAllocations.id, input.id), eq(savingsAllocations.userId, ctx.session.user.id)));
    return { success: true };
  }),
});
