import Link from "next/link";
import React, { ReactElement } from "react";
import { CustomCategory } from "../_types/CategoryType";

interface Props {
  category: CustomCategory;
  isOpen: boolean;
  dropdownPosition: {
    top: number;
    left: number;
  };
}

export default function SubcategoryMenu({
  category,
  isOpen,
  dropdownPosition,
}: Props): ReactElement | null {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0)
    return null;

  const backgroundColor = category.color || "#F5F5F5";

  return (
    <div
      className="fixed z-100"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
      }}
    >
      {/* Invisible bridge to maintain hover */}
      <div className="h-3 w-60" />
      <div
        style={{ backgroundColor }}
        className="w-60 text-black rounded-md overflow-hidden border 
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px]
        -translate-y-[2px]"
      >
        <div>
          {category.subcategories.map((subCategory) => (
            <Link
              key={subCategory.slug}
              href={"/"}
              className="w-full text-left p-4 flex justify-between items-center
              hover:bg-black hover:text-white font-medium"
            >
              <Link href={`/${category.slug}/${subCategory.slug}`}>
                {subCategory.name}
              </Link>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
