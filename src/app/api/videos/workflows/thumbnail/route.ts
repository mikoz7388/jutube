import { db } from "@/db";
import { videos } from "@/db/schema/videos";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { HfInference } from "@huggingface/inference";
import { env } from "@/config/env";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve<InputType>(async (context) => {
  const input = context.requestPayload;
  const { videoId, userId, prompt } = input;

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

  const newThmbnail = await context.run("generate-thumbnail", async () => {
    console.log("Starting thumbnail generation with HF");

    try {
      const hf = new HfInference(env.HUGGINGFACE_TOKEN);
      console.log("HF client initialized");

      const response = await hf.textToImage({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: prompt,
        parameters: {
          width: 1024,
          height: 576,
        },
      });

      console.log("Image generated successfully", { response });

      const utapi = new UTApi();

      const upload = await utapi.uploadFiles(
        new File([response], `${existingVideo.id}.jpeg`),
      );
      console.log(upload.error, upload.data?.size);

      return {
        key: upload.data?.key ?? null,
        url: upload.data?.ufsUrl ?? null,
      };
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      throw error;
    }
  });

  await context.run("delete-prev-thumbnail", async () => {
    const utapi = new UTApi();

    if (existingVideo.thumbnailKey) {
      await utapi.deleteFiles(existingVideo.thumbnailKey);
      await db
        .update(videos)
        .set({
          thumbnailKey: null,
          thumbnailUrl: null,
        })
        .where(
          and(eq(videos.id, input.videoId), eq(videos.userId, input.userId)),
        );
    }
  });

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        thumbnailKey: newThmbnail.key,
        thumbnailUrl: newThmbnail.url,
      })
      .where(
        and(
          eq(videos.id, existingVideo.id),
          eq(videos.userId, existingVideo.userId),
        ),
      );
  });

  return { success: true, thumbnailUrl: newThmbnail.url };
});
