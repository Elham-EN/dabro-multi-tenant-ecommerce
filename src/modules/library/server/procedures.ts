import {
  createTRPCRouter,
  protectedProcedure,
} from "@/lib/trpc/init";
import { DEFAULT_LIMIT } from "@/modules/products/constants";
import { Media, Tenant } from "@/payload-types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // The order for the user who purchased this product
      const orderData = await ctx.payload.find({
        collection: "orders",
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });
      const order = orderData.docs[0];
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
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
      return product;
    }),
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
