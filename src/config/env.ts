import { envSchema } from "env-schema";
import { Type, Static } from "@sinclair/typebox";

const schema = Type.Object({
  BETTER_AUTH_SECRET: Type.String(),
  BETTER_AUTH_URL: Type.String(),
  NEXT_PUBLIC_APP_URL: Type.String(),
  DATABASE_URL: Type.String(),
  GOOGLE_CLIENT_ID: Type.String(),
  GOOGLE_CLIENT_SECRET: Type.String(),
  NPM_FLAGS: Type.String({ default: "--legacy-peer-deps" }),
  UPSTASH_REDIS_REST_URL: Type.String(),
  UPSTASH_REDIS_REST_TOKEN: Type.String(),
  MUX_TOKEN_ID: Type.String(),
  MUX_TOKEN_SECRET: Type.String(),
  MUX_WEBHOOK_SECRET: Type.String(),
  UPLOADTHING_TOKEN: Type.String(),
  QSTASH_TOKEN: Type.String(),
  UPSTASH_WORKFLOW_URL: Type.String(),
  QSTASH_CURRENT_SIGNING_KEY: Type.String(),
  QSTASH_NEXT_SIGNING_KEY: Type.String(),
  GROQ_API_KEY: Type.String(),
  HUGGINGFACE_TOKEN: Type.String(),
  NEW_RELIC_APP_NAME: Type.String(),
  NEW_RELIC_LICENSE_KEY: Type.String(),
  NEW_RELIC_NO_CONFIG_FILE: Type.Boolean({ default: true }),
  NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY: Type.String(),
  NEXT_PUBLIC_NEW_RELIC_ACCOUNT_ID: Type.String(),
  NEXT_PUBLIC_NEW_RELIC_TRUST_KEY: Type.String(),
  NEXT_PUBLIC_NEW_RELIC_AGENT_ID: Type.String(),
  NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID: Type.String(),
});

type Env = Static<typeof schema>;

export const env: Env = envSchema({
  schema,
  dotenv: true,
});
