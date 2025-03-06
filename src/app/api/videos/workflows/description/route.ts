import { db } from "@/db";
import { videos } from "@/db/schema/videos";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import Groq from "groq-sdk";

interface InputType {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

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

  const GroqDescriptionCompletionResponse = await context.run(
    "get-groq-description-completion",
    async () => {
      const groq = new Groq();
      return groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: DESCRIPTION_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: transcript,
          },
        ],

        model: "llama-3.3-70b-versatile",

        //
        // Optional parameters
        //

        // Controls randomness: lowering results in less random completions.
        // As the temperature approaches zero, the model will become deterministic
        // and repetitive.
        temperature: 0.5,

        // The maximum number of tokens to generate. Requests can use up to
        // 2048 tokens shared between prompt and completion.
        max_completion_tokens: 1024,

        // Controls diversity via nucleus sampling: 0.5 means half of all
        // likelihood-weighted options are considered.
        top_p: 1,

        // A stop sequence is a predefined or user-specified text string that
        // signals an AI to stop generating content, ensuring its responses
        // remain focused and concise. Examples include punctuation marks and
        // markers like "[end]".
        stop: null,

        // If set, partial message deltas will be sent.
        stream: false,
      });
    },
  );

  const description =
    GroqDescriptionCompletionResponse.choices[0].message.content;

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        description: description || "essa nie działa",
      })
      .where(
        and(
          eq(videos.id, existingVideo.id),
          eq(videos.userId, existingVideo.userId),
        ),
      );
  });
});
