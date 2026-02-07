import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db, subscriptions } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const subscriptionInput = z.object({
  name: z.string().min(1),
  amount: z.string(),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly", "one-time"]),
  currency: z.enum(["NGN", "USD"]),
  nextPaymentDate: z.string().optional().transform((val) => val && val.length > 0 ? val : undefined),
});

export const subscriptionRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.session.user.id));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
    const result = await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.id, input.id), eq(subscriptions.userId, ctx.session.user.id)));
    return result[0] ?? null;
  }),

  create: protectedProcedure.input(subscriptionInput).mutation(async ({ ctx, input }) => {
    const { nextPaymentDate, ...rest } = input;
    const result = await db
      .insert(subscriptions)
      .values({
        ...rest,
        nextPaymentDate: nextPaymentDate && nextPaymentDate.length > 0 ? nextPaymentDate : null,
        userId: ctx.session.user.id,
      })
      .returning();
    return result[0];
  }),

  update: protectedProcedure
    .input(subscriptionInput.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, nextPaymentDate, ...data } = input;
      const result = await db
        .update(subscriptions)
        .set({
          ...data,
          nextPaymentDate: nextPaymentDate && nextPaymentDate.length > 0 ? nextPaymentDate : null,
          updatedAt: new Date(),
        })
        .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, ctx.session.user.id)))
        .returning();
      return result[0];
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await db
      .delete(subscriptions)
      .where(and(eq(subscriptions.id, input.id), eq(subscriptions.userId, ctx.session.user.id)));
    return { success: true };
  }),
});
