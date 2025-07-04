"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";
import PriceFilter from "./PriceFilter";
import { useProductFilters } from "../hooks/useProductFilters";

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
  const [filters, setFilters] = useProductFilters();
  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };
  return (
    <div className="border bg-white rounded-md">
      <div className="p-4 border-b flex items-center justify-between">
        <p>Filters</p>
        <button
          type="button"
          className="underline cursor-pointer"
          onClick={() => {}}
        >
          Clear
        </button>
      </div>
      <ProductFilter title="Price" className="border-b-0">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
    </div>
  );
}
