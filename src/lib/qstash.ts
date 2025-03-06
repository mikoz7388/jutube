import { Client } from "@upstash/workflow";

export const workflow = new Client({
  token: process.env.QSTASH_TOKEN,
  retry: {
    retries: 3,
  },
});
