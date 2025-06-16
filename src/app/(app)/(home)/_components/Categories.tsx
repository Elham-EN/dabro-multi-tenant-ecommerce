"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { CustomCategory } from "../_types/CategoryType";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";

interface Props {
  data: CustomCategory[];
}

function Categories({ data }: Props): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState<boolean>(false);

  // Use first category as active or empty string if no data
  const activeCategory = data[0]?.slug || "";
  const activeCategoryIndex = data.findIndex(
    (category) => category.slug === activeCategory
  );
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      // Get the width of the container
      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;
      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const itemWidth = item.getBoundingClientRect().width;
        // Add gap width (16px) for all items except the first one
        const gapWidth = visible > 0 ? 16 : 0;
        const requiredWidth = itemWidth + gapWidth;

        // Check if adding this item would exceed available width
        if (totalWidth + requiredWidth > availableWidth) {
          break;
        }

        totalWidth += requiredWidth;
        visible++;
      }

      setVisibleCount(visible);
    };

    // Calculate immediately and on resize
    setTimeout(calculateVisible, 0);

    // Reports changes to the dimensions of an Element's content
    const resizeObserver = new ResizeObserver(calculateVisible);
    // Initiates the observing of a specified Element
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup: unobserve all observed Element targets
    return () => resizeObserver.disconnect();
  }, [data]);

  return (
    <div className="relative w-full overflow-hidden">
      {" "}
      {/* Add overflow-hidden */}
      {/* Hidden div to measure all items - must match visible container styling */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex gap-4 whitespace-nowrap"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "max-content", // Prevent width calculation interference
        }}
      >
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
      {/* Visible items */}
      <div
        ref={containerRef}
        className="flex items-center flex-nowrap gap-4 overflow-hidden"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}

        <div ref={viewAllRef}>
          <Button
            variant="elevated"
            onClick={() => {
              // TODO: Implement view all functionality
              console.log("View All clicked");
            }}
            className={cn(
              "h-11 px-4 bg-transparent rounded-full hover:bg-white hover:border-2 hover:border-black text-black",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-white border-2 border-black"
            )}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Categories;
