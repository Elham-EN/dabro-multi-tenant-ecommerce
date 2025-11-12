import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductListSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {/* Generate 8 skeleton cards to match typical product grid */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="border rounded-md bg-white p-2">
          {/* Product image skeleton */}
          <Skeleton className="h-48 w-full rounded-md mb-3" />

          {/* Product name skeleton */}
          <Skeleton className="h-8 w-3/4 mb-2" />

          {/* Product price skeleton */}
          <Skeleton className="h-6 w-1/2" />
        </div>
      ))}
    </div>
  );
}
