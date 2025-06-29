"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ListFilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CategoryDropdown from "./CategoryDropdown";
import { CustomCategory } from "../_types/CategoryType";
import { Button } from "@/components/ui/button";
import CategoriesSidebar from "./CategoriesSidebar";

interface Props {
  data: CustomCategory[];
}

// Responsive category navigation that automatically hides categories that don't fit
// and shows a "View All" button when screen space is limited
function Categories({ data }: Props): ReactElement {
  // Refs to measure DOM elements for width calculations
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  // How many categories can fit in available space
  const [visibleCount, setVisibleCount] = useState<number>(data.length);

  // Track if user is hovering over navigation area (affects active state display)
  const [isAnyHovered, setIsAnyHovered] = useState<boolean>(false);

  // If true: Render the category side bar
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const params = useParams();

  const categoryParam = params.category as string | undefined;

  // Use first category as active or empty string if no data
  const activeCategory = categoryParam || "all";
  const activeCategoryIndex = data.findIndex(
    (category) => category.slug === activeCategory
  );

  // Show "View All" as active if the current active category is hidden
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    // Calculate how many categories can fit in the available width
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      // Get available space: total width minus "View All" button width
      const containerWidth = containerRef.current.offsetWidth; // How wide is the entire navigation container
      const viewAllWidth = viewAllRef.current.offsetWidth; // How wide is the "View All" button
      const availableWidth = containerWidth - viewAllWidth; // Space left for category buttons

      // Get all invisible category elements to measure their widths
      const items = Array.from(measureRef.current.children); // Convert DOM children to array for looping
      let totalWidth = 0; // Track cumulative width of visible categories
      let visible = 0; // Count how many categories we can show

      // Loop through categories and see how many fit
      for (const item of items) {
        const itemWidth = item.getBoundingClientRect().width;
        // Add gap width (16px) for all items except the first one
        const gapWidth = visible > 0 ? 16 : 0;
        const requiredWidth = itemWidth + gapWidth;

        // If adding this category would overflow, stop here
        if (totalWidth + requiredWidth > availableWidth) {
          break;
        }

        // This category fits! Add it to our running totals
        totalWidth += requiredWidth; // Keep track of total width used
        visible++; // Count this as a visible category
      }

      // Update how many categories to show
      setVisibleCount(visible);
    };

    // Calculate immediately and whenever window resizes
    setTimeout(calculateVisible, 0);

    // Watch for container size changes and recalculate
    const resizeObserver = new ResizeObserver(calculateVisible);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup: stop watching for size changes
    return () => resizeObserver.disconnect();
  }, [data]);

  return (
    <div className="relative w-full overflow-hidden py-2 px-1">
      {/* Categories Side Bar */}
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      {/* Hidden copy of ALL categories - used only to measure their widths */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex gap-4 whitespace-nowrap"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "max-content",
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

      {/* Visible categories - only show what fits + "View All" button */}
      <div
        ref={containerRef}
        className="flex items-center flex-nowrap gap-4 "
        onMouseEnter={() => setIsAnyHovered(true)} // Track when user hovers navigation
        onMouseLeave={() => setIsAnyHovered(false)} // Track when user leaves navigation
      >
        {/* Show only the categories that fit in available space */}
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered} // Tell each category if navigation is hovered
            />
          </div>
        ))}

        {/* "View All" button - always visible, highlighted when active category is hidden */}
        <div ref={viewAllRef}>
          <Button
            variant="elevated"
            onClick={() => {
              // TODO: Implement view all functionality
              setIsSidebarOpen(true);
            }}
            className={cn(
              "h-11 px-4 rounded-full hover:bg-white hover:border-2 hover:border-black text-black",
              // Highlight "View All" when the active category is hidden behind it
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
