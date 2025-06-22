/**
 * TRPC CLIENT CONFIGURATION
 * 
 * This file sets up tRPC for CLIENT-SIDE usage (React components that run in the browser).
 * It creates the providers and hooks needed to use tRPC with React Query.
 * 
 * Key responsibilities:
 * 1. Create tRPC hooks (like useQuery, useMutation) 
 * 2. Set up the React Query client for caching
 * 3. Configure the HTTP connection to your tRPC API
 * 4. Provide these to your React component tree
 * 
 * You'll wrap your app with TRPCReactProvider and then use useTRPC() in components.
 */

"use client"; // This ensures this file only runs in the browser, not on the server

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";

/**
 * TRPC HOOKS CREATION
 * 
 * This creates the typed hooks you'll use in React components:
 * - TRPCProvider: Wrap your app with this
 * - useTRPC: Use this hook in components to get typed tRPC methods
 * 
 * The <AppRouter> type parameter gives you full TypeScript safety.
 */
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

/**
 * BROWSER QUERY CLIENT SINGLETON
 * 
 * We store the QueryClient in a variable to ensure we only create
 * one instance in the browser. This prevents losing cached data
 * when React re-renders components.
 */
let browserQueryClient: QueryClient;

/**
 * QUERY CLIENT FACTORY FUNCTION
 * 
 * This function decides whether to create a new QueryClient or reuse existing one:
 * 
 * SERVER SIDE: Always create a new client for each request
 * - Each request is isolated
 * - Prevents data leaking between users
 * 
 * CLIENT SIDE: Reuse the same client
 * - Maintains cache between component re-renders
 * - Provides better user experience with cached data
 */
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client for each request
    // This prevents data from one user's request affecting another user
    return makeQueryClient();
  }
  
  // Browser: make a new query client only if we don't already have one
  // This is CRITICAL - it prevents React from destroying our cache
  // when components re-render or when React suspends during rendering
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  
  return browserQueryClient;
}

/**
 * API URL CONFIGURATION
 * 
 * This function determines the URL where your tRPC API is hosted:
 * 
 * CLIENT SIDE: Empty string (uses current domain)
 * SERVER SIDE: Full URL from environment variable
 * 
 * The API expects to find your tRPC endpoints at /api/trpc/*
 */
function getUrl() {
  const base = (() => {
    // If running in browser, use relative URLs (same domain)
    if (typeof window !== "undefined") return "";

    // If running on server, need full URL for API calls
    // Make sure to set NEXT_PUBLIC_APP_URL in your environment variables
    return process.env.NEXT_PUBLIC_APP_URL as string;
  })();
  
  // This path must match your tRPC API route: app/api/trpc/[trpc]/route.ts
  return `${base}/api/trpc`;
}

/**
 * MAIN REACT PROVIDER COMPONENT
 * 
 * This component provides tRPC and React Query functionality to your entire app.
 * Wrap your app (usually in layout.tsx) with this provider.
 * 
 * What it does:
 * 1. Creates a QueryClient for caching
 * 2. Creates a tRPC client for API communication  
 * 3. Provides both to all child components
 * 
 * Usage:
 * <TRPCReactProvider>
 *   <YourApp />
 * </TRPCReactProvider>
 */
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  // Get or create a QueryClient for this request/session
  // NOTE: We're NOT using useState here because it could cause issues
  // if there's no Suspense boundary and React suspends during initial render
  const queryClient = getQueryClient();
  
  // Create the tRPC client with configuration
  // useState ensures this client is stable and doesn't recreate on every render
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // If you're using superjson for data transformation, uncomment:
          // transformer: superjson,
          
          // URL where your tRPC API is hosted
          url: getUrl(),
          
          // You can add headers, cookies, etc. here:
          // headers() {
          //   return {
          //     authorization: getAuthCookie(),
          //   };
          // },
        }),
      ],
    })
  );

  return (
    // React Query provider gives us caching, background updates, etc.
    <QueryClientProvider client={queryClient}>
      {/* tRPC provider gives us the typed API hooks */}
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

/**
 * HOW TO USE THIS IN YOUR COMPONENTS:
 * 
 * 1. First, wrap your app in layout.tsx:
 *    <TRPCReactProvider>
 *      {children}
 *    </TRPCReactProvider>
 * 
 * 2. Then in any component:
 *    const trpc = useTRPC();
 *    const { data, isLoading } = useQuery(trpc.categories.getMany.queryOptions());
 * 
 * 3. For mutations:
 *    const createCategory = useMutation(trpc.categories.create);
 *    createCategory.mutate({ name: "New Category" });
 */
