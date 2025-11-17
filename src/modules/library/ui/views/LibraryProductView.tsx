"use client";
import { useTRPC } from "@/lib/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import ReviewSidebar from "../components/ReviewSidebar";

type Props = {
  productId: string;
};

export default function LibraryProductView({
  productId,
}: Props): React.ReactElement {
  const trpc = useTRPC();
  // Offloads loading to Suspense simplifying component logic
  // by guaranteeing data availability when the component renders.
  const { data: product } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId: productId,
    })
  );

  return (
    <div className="bg-white min-h-screen">
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <Link
          prefetch
          href={"/library"}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="size-5" />
          <span className="text-base font-medium">
            Back to the library
          </span>
        </Link>
      </nav>
      <header className="bg-[#F4F4F0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12">
          <h1 className="text-[40px] font-medium">
            {product.name}
          </h1>
        </div>
      </header>
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          {/* First Column - Review's Sidebar */}
          <div className=" lg:col-span-2">
            <ReviewSidebar productId={productId} />
          </div>
          {/* Second Column */}
          <div className=" bg-green-200 lg:col-span-5">
            <p className="font-medium italic text-muted-foreground">
              No special content
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
