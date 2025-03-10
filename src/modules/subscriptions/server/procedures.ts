import { db } from "@/db";
import { subscriptions } from "@/db/schema/subscriptions";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const subscriptionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.userId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [createdSubscription] = await db
        .insert(subscriptions)
        .values({ viewerId: ctx.userId, creatorId: input.userId })
        .returning();

      return createdSubscription;
    }),

  remove: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.userId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [deletedSubscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.viewerId, ctx.userId),
            eq(subscriptions.creatorId, input.userId),
          ),
        )
        .returning();

      return deletedSubscription;
    }),
});
