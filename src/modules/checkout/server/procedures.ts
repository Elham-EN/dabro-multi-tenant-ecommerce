import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/lib/trpc/init";
import { Media, Tenant } from "@/payload-types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              },
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug,
              },
            },
          ],
        },
      });
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()), // Array of strings
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      return {
        ...data,
        totalPrice: data.docs.reduce(
          (acc, product) => acc + product.price,
          0
        ),
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & {
            image: Media | null;
          },
        })),
      };
    }),
});
