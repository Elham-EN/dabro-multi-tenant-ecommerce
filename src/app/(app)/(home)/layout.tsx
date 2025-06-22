import React, { ReactElement, Suspense } from "react";
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/lib/trpc/server";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import SearchFilters from "./_components/SearchFilters";

export const metadata: Metadata = {
  title: "Dabro | Home",
  description: "Dabro's homepage",
};

interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps): Promise<ReactElement> {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
