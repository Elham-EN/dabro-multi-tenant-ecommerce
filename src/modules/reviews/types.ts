import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/lib/trpc/routers/_app";

export type ReviewsGetOneOutput =
  inferRouterOutputs<AppRouter>["reviews"]["getOne"];
