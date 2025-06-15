"use client";

import React, { ReactElement, useRef, useState } from "react";
import { Category } from "@/payload-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useDropdownPosition from "../_hooks/useDropdownPosition";
import SubcategoryMenu from "./SubcategoryMenu";

interface Props {
  category: Category;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

function CategoryDropdown({
  category,
  isActive,
  isNavigationHovered,
}: Props): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropdownRef);
  const dropdownPosition = getDropdownPosition();

  // If we have something to show, only than open the subcategory menu
  const onMouseEnter = (): void => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = (): void => {
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Button
          variant={"elevated"}
          className={cn(
            "h-11 px-4 rounded-full",
            isActive && !isNavigationHovered && "bg-white border-primary"
          )}
        >
          {category.name}
        </Button>
        {category.subcategories &&
          (category.subcategories as Category[]).length > 0 && (
            <div
              className={cn(
                "opacity-0 absolute left-1/2 -translate-x-1/2 border-l-[10px] border-r-[10px] border-b-[10px] border-b-black border-l-transparent border-r-transparent",
                isOpen && "opacity-100"
              )}
            />
          )}
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        dropdownPosition={dropdownPosition}
      />
    </div>
  );
}

export default CategoryDropdown;
