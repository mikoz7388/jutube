import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { videos } from "@/db/schema/videos";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        videoId: z.string().uuid(),
      }),
    )
    .middleware(async ({ input }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      const user = session?.user;

      if (!user) throw new UploadThingError("Unauthorized");

      const [existingVideo] = await db
        .select({
          thumbnailKey: videos.thumbnailKey,
        })
        .from(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));

      if (!existingVideo) throw new UploadThingError("NOT_FOUND");

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({
            thumbnailKey: null,
            thumbnailUrl: null,
          })
          .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));
      }
      return { user, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(videos)
        .set({
          thumbnailUrl: file.ufsUrl,
          thumbnailKey: file.key,
        })
        .where(
          and(
            eq(videos.id, metadata.videoId),
            eq(videos.userId, metadata.user.id),
          ),
        );
      return { uploadedBy: metadata.user.id };
    }),
  bannerUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      const user = session?.user;

      if (!user) throw new UploadThingError("Unauthorized");

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id));

      if (!existingUser) throw new UploadThingError("INTERNAL_SERVER_ERROR");

      if (existingUser.bannerKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingUser.bannerKey);
        await db
          .update(users)
          .set({
            bannerKey: null,
            bannerUrl: null,
          })
          .where(eq(users.id, existingUser.id));
      }
      return { userId: existingUser.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(users)
        .set({
          bannerUrl: file.ufsUrl,
          bannerKey: file.key,
        })
        .where(eq(users.id, metadata.userId));
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
