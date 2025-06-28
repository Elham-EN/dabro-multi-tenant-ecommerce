import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function SearchFiltersSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full py-8 px-4 lg:px-12 border-b">
      {/* Search Input Skeleton */}
      <div className="flex items-center gap-2 w-full">
        {/* Search input with icon */}
        <div className="relative w-full">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        
        {/* Mobile filter button */}
        <Skeleton className="h-12 w-12 shrink-0 rounded-md lg:hidden" />
        
        {/* Library button (when user is logged in) */}
        <Skeleton className="h-10 w-20 rounded-md hidden sm:block" />
      </div>

      {/* Categories Skeleton - Only visible on desktop */}
      <div className="hidden lg:block">
        <div className="flex items-center gap-4 overflow-hidden py-2">
          {/* Category buttons */}
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton 
              key={index} 
              className="h-11 rounded-full shrink-0" 
              style={{ 
                width: `${Math.floor(Math.random() * 60) + 80}px` 
              }} 
            />
          ))}
          
          {/* View All button */}
          <Skeleton className="h-11 w-24 rounded-full shrink-0" />
        </div>
      </div>
    </div>
  );
}
