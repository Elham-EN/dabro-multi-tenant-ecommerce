import {
  createTRPCRouter,
  protectedProcedure,
} from "@/lib/trpc/init";
import { DEFAULT_LIMIT } from "@/modules/products/constants";
import { Media, Tenant } from "@/payload-types";
import { z } from "zod";

export const libraryRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        // For Infinite loading for products
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      // STEP 4: Get products matching the filter
      const orderData = await ctx.payload.find({
        collection: "orders",
        // Just get ids without populating
        depth: 0,
        page: input.cursor,
        limit: input.limit,
        // Get all orders for that logged in user
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      const productIds = orderData.docs.map(
        (order) => order.product
      );

      const productData = await ctx.payload.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      return {
        ...productData,
        docs: productData.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & {
            image: Media | null;
          },
        })),
      };
    }),
});
