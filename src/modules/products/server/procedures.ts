import { baseProcedure, createTRPCRouter } from "@/lib/trpc/init";
import { Category } from "@/payload-types";
import { Where } from "payload";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        // Accept a category slug (like "mens-clothing" or "mens-shoes")
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Start with empty filter - will get ALL products if no category provided
      const where: Where = {};

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
        const formatedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));

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
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      // STEP 4: Get products matching the filter
      const data = await ctx.payload.find({
        collection: "products",
        depth: 1, // Populate "category" & "image" relationship data
        where: where, // Apply our smart category filter
      });

      return data;
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
