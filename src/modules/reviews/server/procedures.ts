import {
  createTRPCRouter,
  protectedProcedure,
} from "@/lib/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const reviewsData = await ctx.payload.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              product: { equals: product.id },
            },
            {
              user: { equals: ctx.session.user.id },
            },
          ],
        },
      });

      const review = reviewsData.docs[0];

      if (!review) {
        return null;
      }

      return review;
    }),
});
