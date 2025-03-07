import { db } from "@/db";
import { videos } from "@/db/schema/videos";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { HfInference } from "@huggingface/inference";
import { UTApi } from "uploadthing/server";

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  const existingVideo = await context.run("get-video", async () => {
    const data = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!data[0]) {
      throw new Error(`video with id ${videoId} NOT_FOUND`);
    }

    return data[0];
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${existingVideo.muxPlaybackId}/text/${existingVideo.muxTrackId}.txt`;

    const response = await fetch(trackUrl);
    const text = await response.text();

    if (!text) {
      throw new Error("BAD_REQUEST");
    }

    return text;
  });

  const generatedThumbnail = await context.run(
    "generate-thumbnail",
    async () => {
      const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
      const prompt = `High quality YouTube thumbnail for a video about: ${transcript.slice(0, 500)}`;

      const response = await hf.textToImage({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: prompt,
        parameters: {
          width: 1024,
          height: 576,
        },
      });

      const imageBuffer = await response.arrayBuffer();
      const utapi = new UTApi();

      const file = new File(
        [Buffer.from(imageBuffer)],
        `thumbnail-${videoId}.png`,
        {
          type: "image/png",
        },
      );

      const upload = await utapi.uploadFiles(file);

      if (!upload?.data) {
        throw new Error("THUMBNAIL_UPLOAD_FAILED");
      }

      if (existingVideo.thumbnailKey) {
        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({
            thumbnailKey: null,
            thumbnailUrl: null,
          })
          .where(
            and(
              eq(videos.id, input.videoId),
              eq(videos.userId, existingVideo.id),
            ),
          );
      }

      return {
        key: upload.data.key,
        url: upload.data.ufsUrl,
      };
    },
  );

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        thumbnailKey: generatedThumbnail.key,
        thumbnailUrl: generatedThumbnail.url,
      })
      .where(
        and(
          eq(videos.id, existingVideo.id),
          eq(videos.userId, existingVideo.userId),
        ),
      );
  });

  return { success: true, thumbnailUrl: generatedThumbnail.url };
});
