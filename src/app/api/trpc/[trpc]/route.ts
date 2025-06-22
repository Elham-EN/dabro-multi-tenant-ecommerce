/**
 * TRPC API ROUTE HANDLER
 *
 * This is the CRITICAL file that connects your tRPC procedures to HTTP requests.
 * It's what makes your client-side tRPC calls actually work!
 *
 * 🎯 PURPOSE:
 * When your React components call tRPC procedures (like trpc.categories.getMany()),
 * they send HTTP requests to /api/trpc/[procedure]. This file handles those requests.
 *
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/lib/trpc/init";
import { appRouter } from "@/lib/trpc/routers/_app";

/**
 * MAIN REQUEST HANDLER FUNCTION
 *
 * This function processes all incoming HTTP requests to your tRPC API.
 *
 * What happens when a client makes a tRPC call:
 * 1. Client calls: trpc.categories.getMany()
 * 2. HTTP request sent to: POST /api/trpc/categories.getMany
 * 3. Next.js routes to this file because of [trpc] dynamic route
 * 4. This handler processes the request:
 *    - Creates context (user auth, database connection, etc.)
 *    - Finds the right procedure in appRouter
 *    - Calls the procedure with context and input
 *    - Returns the result as JSON
 * 5. Client receives typed response
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    /**
     * ENDPOINT CONFIGURATION
     *
     * This should match the URL path where this route handler is located.
     * Since this file is at app/api/trpc/[trpc]/route.ts, endpoint is "/api/trpc"
     */
    endpoint: "/api/trpc",

    /**
     * REQUEST OBJECT
     *
     * The incoming HTTP request from the client.
     * Contains headers, body, method, etc.
     */
    req,

    /**
     * ROUTER REFERENCE
     *
     * Your main tRPC router that contains all procedures.
     * This is where the handler looks up which procedure to call.
     */
    router: appRouter,

    /**
     * CONTEXT CREATOR
     *
     * Function that creates the context for each request.
     * This runs before every procedure and provides shared data.
     *
     * Common context data:
     * - User authentication info
     * - Database connections
     * - Request headers
     * - Environment variables
     */
    createContext: createTRPCContext,

    // Optional configurations you might want to add:

    /**
     * ERROR HANDLING
     *
     * Custom error formatting for your API responses:
     */
    // onError: ({ error, type, path, input, ctx, req }) => {
    //   console.error(`❌ tRPC failed on ${path ?? '<no-path>'}:`, error);
    //
    //   // Log to external service in production
    //   if (process.env.NODE_ENV === 'production') {
    //     // Send to Sentry, LogRocket, etc.
    //   }
    // },

    /**
     * RESPONSE METADATA
     *
     * Add custom headers or modify responses:
     */
    // responseMeta: ({ type, errors }) => {
    //   // Cache successful queries for 1 hour
    //   if (type === 'query' && errors.length === 0) {
    //     return {
    //       headers: {
    //         'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    //       },
    //     };
    //   }
    //   return {};
    // },
  });

/**
 * HTTP METHOD EXPORTS
 *
 * Next.js App Router requires explicit exports for each HTTP method.
 * tRPC typically uses:
 * - GET: For queries (reading data)
 * - POST: For mutations (writing data) and batched requests
 *
 * By exporting the same handler for both, we support all tRPC operations.
 */
export { handler as GET, handler as POST };

/**
 * 🔧 HOW THIS CONNECTS TO YOUR OTHER FILES:
 *
 * 1. CLIENT (client.tsx):
 *    - Sends HTTP requests to the URL: getUrl() returns "/api/trpc"
 *    - This handler receives and processes those requests
 *
 * 2. PROCEDURES (procedures.ts):
 *    - Handler looks up procedures in appRouter
 *    - Calls the matching procedure with context and input
 *
 * 3. CONTEXT (init.ts):
 *    - createTRPCContext() runs for every request
 *    - Provides shared data to all procedures
 *
 * 4. ROUTER (_app.ts):
 *    - appRouter contains all your API procedures
 *    - Handler uses this to find which procedure to call
 */

/**
 * 🧪 TESTING YOUR API:
 *
 * You can test your tRPC API with:
 *
 * 1. Browser DevTools:
 *    - Check Network tab for calls to /api/trpc/*
 *
 * 2. Direct HTTP requests:
 *    curl -X POST http://localhost:3000/api/trpc/categories.getMany \
 *         -H "Content-Type: application/json" \
 *         -d '{"0":{"json":null}}'
 *
 * 3. tRPC client calls:
 *    const { data } = useQuery(trpc.categories.getMany.queryOptions());
 */
