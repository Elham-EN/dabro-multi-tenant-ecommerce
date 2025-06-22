"use client";

import React, { ReactElement } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import SearchInput from "./SearchInput";
import Categories from "./Categories";

function SearchFilters(): ReactElement {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className="flex flex-col gap-4 w-full py-8 px-4 lg:px-12 border-b">
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
    </div>
  );
}

export default SearchFilters;
