/**
 * MAIN TRPC ROUTER (API DEFINITION)
 *
 * This is the heart of your tRPC API - it defines ALL the procedures
 * (endpoints) that your frontend can call.
 *
 * Think of this like:
 * - Express.js routes combined into one object
 * - Your API's "interface" or "contract"
 * - The single source of truth for what your API can do
 *
 * Structure:
 * - Import sub-routers from different modules
 * - Combine them into one main router
 * - Export the router type for client-side TypeScript magic
 */

import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";

/**
 * APP ROUTER - YOUR COMPLETE API
 *
 * This object defines your entire API structure. Each key becomes
 * a namespace that you can call from the frontend.
 *
 * Current structure:
 * - trpc.categories.getMany() ✅
 * - trpc.categories.getById() (not implemented yet)
 * - trpc.categories.create() (not implemented yet)
 *
 * You can add more modules like:
 * - products: productsRouter,
 * - users: usersRouter,
 * - orders: ordersRouter,
 * - auth: authRouter,
 */
export const appRouter = createTRPCRouter({
  // Categories API - handles category-related operations
  categories: categoriesRouter,
  auth: authRouter,

  // Add more routers here as your app grows:
  // products: productsRouter,
  // users: usersRouter,
  // orders: ordersRouter,
  // auth: authRouter,
});

/**
 * TYPE EXPORT - THE MAGIC OF TRPC
 *
 * This type export is what makes tRPC truly special!
 *
 * By exporting this type:
 * 1. Your frontend gets FULL TypeScript autocompletion
 * 2. Compile-time errors if you call non-existent procedures
 * 3. Automatic type inference for procedure inputs and outputs
 * 4. Refactoring safety - rename a procedure and get errors everywhere it's used
 *
 * This type is imported in:
 * - client.tsx (for client-side hooks)
 * - server.tsx (for server-side prefetching)
 * - Any component that uses tRPC
 */
export type AppRouter = typeof appRouter;

/**
 * HOW THIS CONNECTS TO YOUR FRONTEND:
 *
 * 1. CLIENT COMPONENTS:
 *    const trpc = useTRPC();
 *    const { data } = useQuery(trpc.categories.getMany.queryOptions());
 *                                  ^^^^^^^^^^^^^ TypeScript knows this exists!
 *
 * 2. SERVER COMPONENTS:
 *    import { trpc } from "@/lib/trpc/server";
 *    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
 *                                       ^^^^^^^^^^^^^ Same TypeScript safety!
 *
 * 3. API ROUTES:
 *    This router is used in app/api/trpc/[trpc]/route.ts to handle HTTP requests
 */

/**
 * SCALING YOUR API:
 *
 * As your app grows, organize routers by domain:
 *
 * /modules
 *   /categories
 *     /server
 *       procedures.ts (export categoriesRouter)
 *   /products
 *     /server
 *       procedures.ts (export productsRouter)
 *   /users
 *     /server
 *       procedures.ts (export usersRouter)
 *
 * Then import and combine them here:
 *
 * export const appRouter = createTRPCRouter({
 *   categories: categoriesRouter,
 *   products: productsRouter,
 *   users: usersRouter,
 * });
 *
 * This keeps your code organized and your team can work on different
 * modules without conflicts.
 */
