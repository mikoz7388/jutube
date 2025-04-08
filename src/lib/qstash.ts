import { env } from "@/config/env";
import { Client } from "@upstash/workflow";

export const workflow = new Client({
  token: env.QSTASH_TOKEN,
  retry: {
    retries: 3,
  },
});
