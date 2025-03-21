import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type userGetOneOutput = inferRouterOutputs<AppRouter>["users"]["getOne"];
