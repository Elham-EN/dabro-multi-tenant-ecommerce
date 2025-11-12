import {
  baseProcedure,
  createTRPCRouter,
} from "@/lib/trpc/init";
import { headers as getHeaders } from "next/headers";
import { Category, Media, Tenant } from "@/payload-types";
import { Sort, Where } from "payload";
import { z } from "zod";
import { sortValues } from "../hooks/useProductFilters";
import { DEFAULT_LIMIT } from "../constants";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.payload.auth({ headers });
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.id,
        // Load the "product.image", "product.tenant" & "product.tenant.image"
        depth: 2,
      });

      let isPurchased = false;

      if (session.user) {
        // A specfic order that user purchased
        const orderData = await ctx.payload.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });
        // If the order exist (turn to boolean)
        isPurchased = !!orderData.docs[0];
      }

      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & {
          image: Media | null;
        },
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        // For Infinite loading for products
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        // Accept a category slug (like "mens-clothing" or "mens-shoes")
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Start with empty filter - will get ALL products if no category provided
      const where: Where = {};

      let sort: Sort = "-createdAt";

      if (input.sort === "curated") {
        sort = "+createdAt";
      }

      if (input.sort === "trending") {
        sort = "name";
      }

      if (input.sort === "hot_and_new") {
        sort = "-createdAt";
      }

      // Sorting Algorthims
      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      }

      if (input.category) {
        // STEP 1: Find the category by its slug
        const categoriesData = await ctx.payload.find({
          collection: "categories",
          limit: 1,
          depth: 1, // Also fetch subcategories if this is a parent
          pagination: false,
          where: {
            slug: {
              equals: input.category, // Find exact match for the slug
            },
          },
        });

        // STEP 2: Format the category data and extract subcategories
        const formatedData = categoriesData.docs.map(
          (doc) => ({
            ...doc,
            subcategories: (
              doc.subcategories?.docs ?? []
            ).map((doc) => ({
              ...(doc as Category),
              subcategories: undefined,
            })),
          })
        );

        // STEP 3: Collect all category slugs to search for
        const subcategoriesSlugs = [];
        const parentCategory = formatedData[0];

        if (parentCategory) {
          // Get all subcategory slugs (empty array if this is already a subcategory)
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );

          // SMART FILTER: Include products from BOTH the current category AND all its subcategories
          // For parent category: shows products from parent + all children
          // For subcategory: shows products from just that subcategory (no children)
          where["category.slug"] = {
            in: [
              parentCategory.slug,
              ...subcategoriesSlugs,
            ],
          };
        }
      }

      if (input.tags && input.tags.length > 0) {
        // Query: select all products that have these tags
        // e.g "electronic", "smartphone"
        where["tags.name"] = {
          in: input.tags,
        };
      }

      // STEP 4: Get products matching the filter
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2, // Populate "category", "image", tenant & tenant.image
        where: where, // Apply our smart category filter
        sort: sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,
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

// Parent Category Page (e.g., "Men's Clothing"):
// Input: category = "mens-clothing"
// → Finds "Men's Clothing" category
// → Gets its subcategories: ["mens-shoes", "mens-shirts", "mens-pants"]
// → Filter: WHERE category.slug IN ["mens-clothing", "mens-shoes", "mens-shirts", "mens-pants"]
// → Result: Shows ALL products from parent + all subcategories

// Subcategory Page (e.g., "Men's Shoes"):
// Input: category = "mens-shoes"
// → Finds "Men's Shoes" category
// → Gets its subcategories: [] (empty - it's already a leaf category)
// → Filter: WHERE category.slug IN ["mens-shoes"]
// → Result: Shows ONLY products from that specific subcategory

// 🔑 Key Insight:
// The same procedure handles both cases intelligently:

// Parent categories = show products from self + all children
// Subcategories = show products from self only (no children to include)
