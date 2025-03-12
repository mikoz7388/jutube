import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { comments } from "@/db/schema/comments";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        value: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { videoId, value } = input;

      const [createdComment] = await db
        .insert(comments)
        .values({
          userId,
          videoId,
          value,
        })
        .returning();

      return createdComment;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.userId, userId), eq(comments.id, id)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deletedComment;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      const { videoId, cursor, limit } = input;

      const totalCountPromise = db
        .select({ count: count(comments.id) })
        .from(comments)
        .where(eq(comments.videoId, videoId));

      const itemsPromise = db
        .select({
          ...getTableColumns(comments),
          user: users,
        })
        .from(comments)
        .where(
          cursor
            ? and(
                eq(comments.videoId, videoId),
                or(
                  lt(comments.updatedAt, cursor.updatedAt),
                  and(eq(comments.updatedAt, cursor.updatedAt), lt(comments.id, cursor.id)),
                ),
              )
            : eq(comments.videoId, videoId),
        )
        .innerJoin(users, eq(comments.userId, users.id))
        .orderBy(desc(comments.updatedAt), desc(comments.id))
        .limit(limit + 1);

      const [totalCountResult, items] = await Promise.all([totalCountPromise, itemsPromise]);

      const hasMore = items.length > limit;
      if (hasMore) {
        items.pop();
      }

      const lastItem = items[items.length - 1];

      const nextCursor =
        hasMore && items.length > 0
          ? {
              id: lastItem.id,
              updatedAt: lastItem.updatedAt,
            }
          : null;
      return { items, nextCursor, totalCount: totalCountResult[0].count };
    }),
});
