/**
 * REACT QUERY CLIENT CONFIGURATION
 * 
 * This file creates and configures the React Query client that powers
 * tRPC's caching, background updates, and SSR capabilities.
 * 
 * React Query is what makes tRPC feel magical by:
 * - Automatically caching API responses
 * - Refetching stale data in the background
 * - Providing loading/error states
 * - Optimistic updates
 * - Request deduplication
 * - And much more!
 * 
 * This configuration is optimized for Server-Side Rendering (SSR) and
 * React Server Components.
 */

import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
// import superjson from "superjson";

/**
 * QUERY CLIENT FACTORY FUNCTION
 * 
 * Creates a new React Query client with optimized settings for tRPC + SSR.
 * This function is called both on the server and client to create QueryClient instances.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * STALE TIME CONFIGURATION
         * 
         * staleTime: 30 seconds
         * 
         * This tells React Query that data is "fresh" for 30 seconds.
         * During this time, it won't refetch the data even if you navigate
         * away and come back.
         * 
         * Why 30 seconds for SSR?
         * - Server renders with fresh data
         * - Client hydrates without immediately refetching
         * - Prevents unnecessary requests right after page load
         * - You can adjust this based on how often your data changes
         */
        staleTime: 30 * 1000, // 30 seconds
        
        // Other useful options you might want to configure:
        // gcTime: 1000 * 60 * 60 * 24, // 24 hours (how long to keep unused data)
        // retry: 3, // Number of retries on failure
        // refetchOnWindowFocus: false, // Don't refetch when window gains focus
      },
      
      /**
       * DEHYDRATION CONFIGURATION
       * 
       * Dehydration is the process of serializing React Query's cache
       * so it can be sent from server to client during SSR.
       */
      dehydrate: {
        /**
         * DATA SERIALIZATION
         * 
         * If you're using superjson transformer in your tRPC setup,
         * uncomment this line to ensure dates, BigInts, etc. are
         * properly serialized when sending data from server to client.
         */
        // serializeData: superjson.serialize,
        
        /**
         * DEHYDRATION RULES
         * 
         * This function determines which queries should be included
         * when sending cache from server to client.
         * 
         * Default behavior: Only successful queries are dehydrated
         * Our custom behavior: Also include pending queries
         * 
         * Why include pending queries?
         * - Server can start a fetch and pass the Promise to client
         * - Client receives the data when it resolves
         * - Provides seamless streaming from server to client
         * - Better perceived performance
         */
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || // Include successful queries
          query.state.status === "pending", // Also include promises still resolving
      },
      
      /**
       * HYDRATION CONFIGURATION
       * 
       * Hydration is when the client receives and applies the
       * serialized cache from the server.
       */
      hydrate: {
        /**
         * DATA DESERIALIZATION
         * 
         * If you're using superjson, uncomment this to properly
         * deserialize complex data types on the client.
         */
        // deserializeData: superjson.deserialize,
      },
    },
  });
}

/**
 * CONFIGURATION EXAMPLES FOR DIFFERENT USE CASES:
 * 
 * 1. REAL-TIME DATA (short stale time):
 *    staleTime: 0, // Always refetch
 * 
 * 2. STATIC DATA (long stale time):
 *    staleTime: 1000 * 60 * 60, // 1 hour
 * 
 * 3. AGGRESSIVE CACHING:
 *    staleTime: 1000 * 60 * 5, // 5 minutes
 *    gcTime: 1000 * 60 * 60 * 24, // Keep for 24 hours
 * 
 * 4. OFFLINE-FIRST:
 *    staleTime: Infinity, // Never consider stale
 *    gcTime: Infinity, // Never garbage collect
 * 
 * 5. DEV MODE (see all network activity):
 *    staleTime: 0,
 *    gcTime: 0,
 *    retry: false,
 */

/**
 * INTEGRATION WITH TRPC:
 * 
 * This QueryClient is used by both:
 * 1. client.tsx - For browser-side React Query functionality
 * 2. server.tsx - For server-side prefetching and SSR
 * 
 * The configuration here affects:
 * - How often tRPC refetches your data
 * - How long data stays in cache
 * - Which data gets sent from server to client
 * - How the client handles that server data
 */
