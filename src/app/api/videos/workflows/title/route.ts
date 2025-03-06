import { db } from "@/db";
import { videos } from "@/db/schema/videos";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import Groq from "groq-sdk";

interface InputType {
  userId: string;
  videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

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

  const GroqTitleCompletionResponse = await context.run(
    "get-groq-title-completion",
    async () => {
      const groq = new Groq();
      return groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: TITLE_SYSTEM_PROMPT,
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

  const title = GroqTitleCompletionResponse.choices[0].message.content;

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        title: title || existingVideo.title,
      })
      .where(
        and(
          eq(videos.id, existingVideo.id),
          eq(videos.userId, existingVideo.userId),
        ),
      );
  });
});
