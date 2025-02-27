import { db } from "@/db";
import { users as userSchema } from "@/db/schema/auth";
import { auth } from "@/lib/auth";
import { ratelimit } from "@/lib/ratelimit";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const session = await auth.api.getSession({ headers: await headers() });

  return { userId: session?.user.id };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  async function isAuthorized(opts) {
    const { ctx } = opts;

    if (!ctx.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const [user] = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, ctx.userId));

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const { success } = await ratelimit.limit(user.id);

    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Easy boy...",
      });
    }

    return opts.next({
      ctx: {
        ...ctx,
        user,
        userId: user.id,
      },
    });
  },
);
