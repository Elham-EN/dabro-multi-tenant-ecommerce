"use client";

import React, { ReactElement } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import SearchInput from "./SearchInput";
import Categories from "./Categories";
import { cn } from "@/lib/utils";
import Breadcrumbs from "./Breadcrumbs";

function SearchFilters(): ReactElement {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";
  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory
  );
  const activeCategoryColor = activeCategoryData?.color || "#F5F5F5";
  const activeCategoryName = activeCategoryData?.name || null;
  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName = activeCategoryData?.subcategories.find(
    (subcategory) => subcategory.slug === activeSubcategory
  )?.name;

  return (
    <div
      className={cn("flex flex-col gap-4 w-full py-8 px-4 lg:px-12 border-b")}
      style={{ backgroundColor: activeCategoryColor }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <Breadcrumbs
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  );
}

export default SearchFilters;
