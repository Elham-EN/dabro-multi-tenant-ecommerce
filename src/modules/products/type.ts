import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/lib/trpc/routers/_app";

export type ProductGetManyOutput =
  inferRouterOutputs<AppRouter>["products"]["getMany"];
