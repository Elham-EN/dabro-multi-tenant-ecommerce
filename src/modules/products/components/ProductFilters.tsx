"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";

interface ProductFilterProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

function ProductFilter({
  title,
  className,
  children,
}: ProductFilterProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("p-4 border-b flex flex-col gap-2", className)}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((current) => !current)}
      >
        <p className="font-medium">{title}</p>
        <Icon className="soze-5" />
      </div>
      {isOpen && children}
    </div>
  );
}

export default function ProductFilters(): React.ReactElement {
  return (
    <div className="border bg-white rounded-md">
      <div className="p-4 border-b flex items-center justify-between">
        <p>Filters</p>
        <button type="button" className="underline" onClick={() => {}}>
          Clear
        </button>
      </div>
      <ProductFilter title="Price" className="border-b-0">
        <p>Price Filter</p>
      </ProductFilter>
    </div>
  );
}
