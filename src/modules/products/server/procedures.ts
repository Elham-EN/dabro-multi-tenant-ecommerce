import { baseProcedure, createTRPCRouter } from "@/lib/trpc/init";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "products",
      depth: 1, // Populate "category" & "image"
    });

    return data;
  }),
});
