/**
 * CATEGORIES MODULE - TRPC PROCEDURES
 *
 * This file defines all the tRPC procedures (API endpoints) related to categories.
 * Think of this as your "categories controller" that handles all category operations.
 *
 * What's a procedure?
 * - Like a REST endpoint, but with full TypeScript safety
 * - Can be a query (read data) or mutation (write data)
 * - Automatically gets input validation and output typing
 * - Can use middleware for auth, logging, etc.
 *
 * This router will be imported into the main app router and exposed as:
 * - trpc.categories.getMany()
 * - trpc.categories.getById() (when you add it)
 * - trpc.categories.create() (when you add it)
 */

import { baseProcedure, createTRPCRouter } from "@/lib/trpc/init";
import { Category } from "@/payload-types";
// Import validation schemas when you add them:
// import { z } from "zod";

/**
 * CATEGORIES ROUTER DEFINITION
 *
 * This creates a sub-router that groups all category-related procedures.
 * Each method in this object becomes a callable procedure from your frontend.
 */
export const categoriesRouter = createTRPCRouter({
  /**
   * GET MANY CATEGORIES PROCEDURE
   *
   * This is a QUERY procedure (reads data, doesn't modify anything).
   *
   * Frontend usage:
   * const { data, isLoading } = useQuery(trpc.categories.getMany.queryOptions());
   *
   * Server usage:
   * const categories = await caller.categories.getMany();
   *
   * What happens when called:
   * 1. tRPC calls this function
   * 2. Function has access to context (ctx.userId, etc.)
   * 3. Return value is automatically serialized and sent to client
   * 4. Client gets full TypeScript types for the return value
   */
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "categories",
      sort: "name",
      // Automatically populate/fetch the related data from relationship
      // fields (like parent field) instead of just returning IDs
      depth: 1,
      pagination: false,
      // Give me all categories that are parents themselves, not children of
      // other categories. Looking for categories that don't have a parent
      where: {
        parent: {
          exists: false,
        },
      },
    });

    // Removes the nested .docs - Instead of category.subcategories.docs[0],
    // just use category.subcategories[0]
    const formatedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category),
        subcategories: undefined,
      })),
    }));

    return formatedData;
  }),

  // TODO: Add more procedures as your app grows

  /**
   * Example: GET SINGLE CATEGORY BY ID
   */
  // getById: baseProcedure
  //   .input(z.object({ id: z.number() }))
  //   .query(async ({ input, ctx }) => {
  //     return await prisma.category.findUnique({
  //       where: { id: input.id },
  //     });
  //   }),

  /**
   * Example: CREATE NEW CATEGORY
   */
  // create: baseProcedure
  //   .input(z.object({
  //     name: z.string().min(1).max(100),
  //     slug: z.string().min(1).max(100),
  //   }))
  //   .mutation(async ({ input, ctx }) => {
  //     return await prisma.category.create({
  //       data: {
  //         name: input.name,
  //         slug: input.slug,
  //         createdBy: ctx.userId,
  //       },
  //     });
  //   }),
});

/**
 * COMMON PATTERNS AND BEST PRACTICES:
 *
 * 1. INPUT VALIDATION:
 *    Always validate inputs with Zod schemas:
 *    .input(z.object({ name: z.string().min(1) }))
 *
 * 2. ERROR HANDLING:
 *    import { TRPCError } from '@trpc/server';
 *    throw new TRPCError({
 *      code: 'NOT_FOUND',
 *      message: 'Category not found',
 *    });
 *
 * 3. MIDDLEWARE USAGE:
 *    Create protected procedures for auth:
 *    const protectedProcedure = baseProcedure.use(authMiddleware);
 *
 * 4. DATABASE INTEGRATION:
 *    Use your ORM/database client in procedures:
 *    - Prisma: prisma.category.findMany()
 *    - Drizzle: db.select().from(categories)
 *    - Raw SQL: db.query('SELECT * FROM categories')
 *
 * 5. CONTEXT USAGE:
 *    Access user info, database connections, etc:
 *    const { userId } = ctx; // From createTRPCContext
 *
 * 6. RETURN TYPES:
 *    TypeScript automatically infers return types:
 *    Frontend knows this returns { id: number, name: string }[]
 *    return await prisma.category.findMany();
 *
 * 7. INFINITE QUERIES:
 *    For pagination with cursor:
 *    .input(z.object({
 *      cursor: z.number().optional(),
 *      limit: z.number().min(1).max(100).default(50),
 *    }))
 *    .query(async ({ input }) => {
 *      const items = await prisma.category.findMany({
 *        take: input.limit + 1,
 *        cursor: input.cursor ? { id: input.cursor } : undefined,
 *      });
 *      const nextCursor = items.length > input.limit ? items.pop()!.id : undefined;
 *      return { items, nextCursor };
 *    })
 *
 * 8. FRONTEND INTEGRATION:
 *    Once you add these procedures, use them like:
 *
 *    In client components:
 *    const { data } = useQuery(trpc.categories.getMany.queryOptions());
 *    const createMutation = useMutation(trpc.categories.create);
 *
 *    In server components:
 *    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
 */
