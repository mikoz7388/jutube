import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { commentReactions, comments } from "@/db/schema/comments";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
} from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        parentId: z.string().uuid().nullish(),
        value: z.string().trim().min(1).max(1000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { videoId, value, parentId } = input;

      const [existingComment] = await db
        .select()
        .from(comments)
        .where(inArray(comments.id, parentId ? [parentId] : []));

      if (!existingComment && parentId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (existingComment?.parentId && parentId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [createdComment] = await db
        .insert(comments)
        .values({
          userId,
          videoId,
          parentId,
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
        parentId: z.string().uuid().nullish(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { videoId, cursor, limit, parentId } = input;

      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            commentId: commentReactions.commentId,
            type: commentReactions.type,
          })
          .from(commentReactions)
          .where(
            inArray(commentReactions.userId, ctx.userId ? [ctx.userId] : []),
          ),
      );

      const totalCountPromise = db
        .select({ count: count(comments.id) })
        .from(comments)
        .where(eq(comments.videoId, videoId));

      const replies = db.$with("replies").as(
        db
          .select({
            parentId: comments.parentId,
            count: count(comments.id).as("count"),
          })
          .from(comments)
          .where(isNotNull(comments.parentId))
          .groupBy(comments.parentId),
      );

      const itemsPromise = db
        .with(viewerReactions, replies)
        .select({
          ...getTableColumns(comments),
          user: users,
          viewerReaction: viewerReactions.type,
          replyCount: replies.count,
          likeCount: db.$count(
            commentReactions,
            and(
              eq(commentReactions.type, "like"),
              eq(commentReactions.commentId, comments.id),
            ),
          ),
          dislikeCount: db.$count(
            commentReactions,
            and(
              eq(commentReactions.type, "dislike"),
              eq(commentReactions.commentId, comments.id),
            ),
          ),
        })
        .from(comments)
        .where(
          and(
            eq(comments.videoId, videoId),
            parentId
              ? eq(comments.parentId, parentId)
              : isNull(comments.parentId),
            cursor
              ? or(
                  lt(comments.updatedAt, cursor.updatedAt),
                  and(
                    eq(comments.updatedAt, cursor.updatedAt),
                    lt(comments.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .innerJoin(users, eq(comments.userId, users.id))
        .leftJoin(viewerReactions, eq(comments.id, viewerReactions.commentId))
        .leftJoin(replies, eq(comments.id, replies.parentId))
        .orderBy(desc(comments.updatedAt), desc(comments.id))
        .limit(limit + 1);

      const [totalCountResult, items] = await Promise.all([
        totalCountPromise,
        itemsPromise,
      ]);

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
