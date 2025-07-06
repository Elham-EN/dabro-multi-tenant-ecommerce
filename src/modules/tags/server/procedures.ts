import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/lib/trpc/init";

export const tagsRouter = createTRPCRouter({
  // API endpoint: fetches tags from the database with pagination
  // (like "show me page 2 with 10 tags per page").
  getMany: baseProcedure
    .input(
      z.object({
        // Which page to get (default: page 1)
        cursor: z.number().default(1),
        // How many tags per page (default: 10)
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      // Fetch tags from database with pagination
      const data = await ctx.payload.find({
        collection: "tags",
        page: input.cursor, // Go to this page
        limit: input.limit, // Get this many items
      });
      return data;
    }),
});
