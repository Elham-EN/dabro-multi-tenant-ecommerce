/**
 * TRPC INITIALIZATION FILE
 * 
 * This is the foundation of your tRPC setup. Think of this as the "factory" 
 * that creates all the building blocks for your type-safe API.
 * 
 * What happens here:
 * 1. Initialize tRPC with configuration
 * 2. Create a context function that runs for every API call
 * 3. Export helper functions to build routers and procedures
 */

import { initTRPC } from "@trpc/server";
import { cache } from "react";

/**
 * CONTEXT CREATION FUNCTION
 * 
 * This function runs for EVERY tRPC procedure call (both client and server).
 * It creates the "context" - data that's available to all your API procedures.
 * 
 * Common use cases:
 * - User authentication data
 * - Database connections
 * - Request information
 * - Environment variables
 * 
 * The `cache()` wrapper ensures this function only runs once per request
 * in React Server Components, improving performance.
 */
export const createTRPCContext = cache(async () => {
  // Currently returning mock data, but you could add:
  // - Authentication: const user = await getCurrentUser()
  // - Database: const db = await getDatabaseConnection()
  // - Headers: const headers = headers()
  return { 
    userId: "user_123" // This will be available in all procedures as `ctx.userId`
  };
});

/**
 * TRPC INSTANCE INITIALIZATION
 * 
 * This creates the main tRPC instance with your configuration.
 * You can add options like:
 * - Data transformers (for dates, etc.)
 * - Error formatting
 * - Meta information
 */
const t = initTRPC.create({
  // transformer: superjson, // Uncomment if you need to serialize complex data types
});

/**
 * EXPORTED HELPER FUNCTIONS
 * 
 * These are the building blocks you'll use throughout your app:
 * 
 * - createTRPCRouter: Creates a group of related procedures (like a REST controller)
 * - createCallerFactory: Creates server-side callers for direct procedure calls
 * - baseProcedure: The base procedure builder (you can extend this with middleware)
 */

// Router factory - use this to group related procedures together
export const createTRPCRouter = t.router;

// Caller factory - use this to call procedures directly on the server
export const createCallerFactory = t.createCallerFactory;

// Base procedure - the foundation for all your API endpoints
// You can extend this with middleware for auth, logging, etc.
export const baseProcedure = t.procedure;

// Example of how you might create protected procedures:
// export const protectedProcedure = baseProcedure.use(authMiddleware);
