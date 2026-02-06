import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db, userSettings } from "@/lib/db";
import { eq } from "drizzle-orm";

export const settingsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const result = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, ctx.session.user.id));
    // Return first settings record or create default
    if (result.length === 0) {
      const newSettings = await db
        .insert(userSettings)
        .values({
          userId: ctx.session.user.id,
          email: null,
          reminderFrequency: "weekly",
        })
        .returning();
      return newSettings[0];
    }
    return result[0];
  }),

  update: protectedProcedure
    .input(
      z.object({
        email: z.string().email().nullable(),
        reminderFrequency: z.enum(["daily", "weekly", "monthly", "never"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, ctx.session.user.id));

      if (existing.length === 0) {
        const result = await db
          .insert(userSettings)
          .values({
            userId: ctx.session.user.id,
            email: input.email,
            reminderFrequency: input.reminderFrequency,
          })
          .returning();
        return result[0];
      }

      const result = await db
        .update(userSettings)
        .set({
          email: input.email,
          reminderFrequency: input.reminderFrequency,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.id, existing[0].id))
        .returning();

      return result[0];
    }),
});
