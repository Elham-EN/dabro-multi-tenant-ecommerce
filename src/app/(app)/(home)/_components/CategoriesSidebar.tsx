import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomCategory } from "../_types/CategoryType";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[];
}

// Sidebar that shows category hierarchy - allows drilling down into subcategories
// and navigating to category/subcategory pages
export default function CategoriesSidebar({
  open,
  onOpenChange,
  data,
}: Props): React.ReactElement {
  // Track which subcategories we're currently viewing (null = root level)
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);

  // Remember which category was clicked to access current subcategories
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);

  const router = useRouter();

  // Show subcategories if we drilled down, otherwise show root categories
  const currentCategories = parentCategories ?? data ?? [];

  // Reset to root level when sidebar closes
  const handleOpenChange = (open: boolean) => {
    setParentCategories(null); // Go back to root categories
    setSelectedCategory(null); // Clear selected category
    onOpenChange(open);
  };

  // Handle clicking on a category - either drill down or navigate
  const handleCategoryClick = (category: CustomCategory) => {
    // Check if this category has subcategories to explore
    if (category.subcategories && category.subcategories.length > 0) {
      // Drill down: show this category's subcategories
      setParentCategories(category.subcategories as CustomCategory[]);
      setSelectedCategory(category); // Remember which parent category we're in
    } else {
      // Navigate to category page (this is a leaf category)
      if (parentCategories && selectedCategory) {
        // We're in subcategories - navigate to /parent/subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        // We're in root categories - navigate to /category
        if (category.slug === "all") {
          router.push("/"); // "All" goes to homepage
        } else {
          router.push(`/${category.slug}`); // Navigate to category page
        }
      }
      handleOpenChange(false); // Close sidebar after navigation
    }
  };

  // Go back to parent level (from subcategories to root)
  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null); // Return to root categories
      setSelectedCategory(null); // Clear selected category
    }
  };

  // Use selected category's color as background, or default to white
  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        /* Dynamic background based on selected category */
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {/* Show "Back" button when viewing subcategories */}
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center cursor-pointer"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}

          {/* List all categories in current level */}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="flex justify-between items-center w-full text-left p-4 text-base font-medium hover:bg-black hover:text-white cursor-pointer"
            >
              {category.name}
              {/* Show chevron if this category has subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
