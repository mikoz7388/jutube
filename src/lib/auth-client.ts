import { createAuthClient } from "better-auth/react";
import { APP_URL } from "./constants";

export const authClient = createAuthClient({
  baseURL: APP_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
