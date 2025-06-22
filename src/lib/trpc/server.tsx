/**
 * TRPC SERVER-SIDE UTILITIES
 * 
 * This file provides tools for using tRPC in SERVER COMPONENTS and API routes.
 * It's the server-side counterpart to client.tsx.
 * 
 * Key features:
 * 1. Server-side query prefetching for better performance
 * 2. Direct procedure calling without HTTP overhead
 * 3. Integration with React Query's SSR capabilities
 * 
 * Use this when you want to:
 * - Prefetch data in Server Components
 * - Call tRPC procedures directly on the server
 * - Set up data that will be hydrated to the client
 */

// This import ensures this file can NEVER be imported in client components
// It will throw a build error if you try to import this in a "use client" file
import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

/**
 * STABLE QUERY CLIENT GETTER
 * 
 * This creates a React Query client that's stable during a server request.
 * The `cache()` wrapper ensures that all components in the same request
 * share the same QueryClient instance.
 * 
 * Why this matters:
 * - Multiple components can prefetch the same query
 * - React Query will deduplicate the requests
 * - Data is shared between components in the same request
 */
export const getQueryClient = cache(makeQueryClient);

/**
 * TRPC SERVER PROXY
 * 
 * This is the main tool for using tRPC in server components.
 * It creates query options that work with React Query's SSR features.
 * 
 * What it provides:
 * - trpc.categories.getMany.queryOptions() - for prefetching
 * - trpc.categories.getMany.infiniteQueryOptions() - for infinite queries
 * - Full TypeScript safety for all your procedures
 * 
 * This proxy runs procedures directly (no HTTP calls) since we're on the same server.
 */
export const trpc = createTRPCOptionsProxy({
  // Context creator - same function used by API routes
  ctx: createTRPCContext,
  
  // Your app router with all procedures
  router: appRouter,
  
  // Query client for caching and dehydration
  queryClient: getQueryClient,
});

/**
 * HOW TO USE IN SERVER COMPONENTS:
 * 
 * 1. PREFETCHING PATTERN (recommended for RSC):
 * 
 *    export default async function ServerComponent() {
 *      const queryClient = getQueryClient();
 *      
 *      // Start fetching data (doesn't wait)
 *      void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
 *      
 *      return (
 *        <HydrationBoundary state={dehydrate(queryClient)}>
 *          <ClientComponent />
 *        </HydrationBoundary>
 *      );
 *    }
 * 
 * 2. DIRECT DATA FETCHING (if you need data in server component):
 * 
 *    export default async function ServerComponent() {
 *      const queryClient = getQueryClient();
 *      
 *      // Wait for data to load
 *      const categories = await queryClient.fetchQuery(
 *        trpc.categories.getMany.queryOptions()
 *      );
 *      
 *      return <div>Found {categories.length} categories</div>;
 *    }
 * 
 * 3. USING WITH SUSPENSE:
 * 
 *    function ServerComponent() {
 *      // Prefetch without void to trigger suspense
 *      getQueryClient().prefetchQuery(trpc.categories.getMany.queryOptions());
 *      
 *      return (
 *        <Suspense fallback={<Loading />}>
 *          <ClientComponent />
 *        </Suspense>
 *      );
 *    }
 */

/**
 * ALTERNATIVE: SERVER CALLER PATTERN
 * 
 * If you prefer to call procedures directly without React Query integration,
 * you can create a server caller like this:
 * 
 * export const caller = appRouter.createCaller(createTRPCContext);
 * 
 * Then use it like:
 * const categories = await caller.categories.getMany();
 * 
 * However, this approach:
 * - Doesn't integrate with React Query cache
 * - Can't be hydrated to client components
 * - Is better for one-off server-only operations
 */
