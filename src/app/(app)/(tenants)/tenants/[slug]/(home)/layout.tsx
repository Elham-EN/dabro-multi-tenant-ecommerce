import { getQueryClient, trpc } from "@/lib/trpc/server";
import Footer from "@/modules/tenants/components/footer";
import Navbar, {
  NavbarSkeleton,
} from "@/modules/tenants/components/navbar";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import React, { Suspense } from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function Layout({
  children,
  params,
}: Props) {
  const { slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
