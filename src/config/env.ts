import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    BETTER_AUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    MUX_TOKEN_ID: z.string(),
    MUX_TOKEN_SECRET: z.string(),
    MUX_WEBHOOK_SECRET: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    QSTASH_TOKEN: z.string(),
    UPSTASH_WORKFLOW_URL: z.string().url(),
    QSTASH_CURRENT_SIGNING_KEY: z.string(),
    QSTASH_NEXT_SIGNING_KEY: z.string(),
    GROQ_API_KEY: z.string(),
    HUGGINGFACE_TOKEN: z.string(),
    NEW_RELIC_APP_NAME: z.string(),
    NEW_RELIC_LICENSE_KEY: z.string(),
    NEW_RELIC_NO_CONFIG_FILE: z.string().default("true"),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY: z.string(),
    NEXT_PUBLIC_NEW_RELIC_ACCOUNT_ID: z.string(),
    NEXT_PUBLIC_NEW_RELIC_TRUST_KEY: z.string(),
    NEXT_PUBLIC_NEW_RELIC_AGENT_ID: z.string(),
    NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    MUX_WEBHOOK_SECRET: process.env.MUX_WEBHOOK_SECRET,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    UPSTASH_WORKFLOW_URL: process.env.UPSTASH_WORKFLOW_URL,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN,
    NEW_RELIC_APP_NAME: process.env.NEW_RELIC_APP_NAME,
    NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY,
    NEW_RELIC_NO_CONFIG_FILE: process.env.NEW_RELIC_NO_CONFIG_FILE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY:
      process.env.NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY,
    NEXT_PUBLIC_NEW_RELIC_ACCOUNT_ID:
      process.env.NEXT_PUBLIC_NEW_RELIC_ACCOUNT_ID,
    NEXT_PUBLIC_NEW_RELIC_TRUST_KEY:
      process.env.NEXT_PUBLIC_NEW_RELIC_TRUST_KEY,
    NEXT_PUBLIC_NEW_RELIC_AGENT_ID: process.env.NEXT_PUBLIC_NEW_RELIC_AGENT_ID,
    NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID:
      process.env.NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
