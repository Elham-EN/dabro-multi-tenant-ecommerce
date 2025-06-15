import { Category } from "@/payload-types";

import React, { ReactElement } from "react";
import SearchInput from "./SearchInput";
import Categories from "./Categories";

interface Props {
  data: Category[];
}
function SearchFilters({ data }: Props): ReactElement {
  return (
    <div className="flex flex-col gap-4 w-full py-8 px-4 lg:px-12 border-b">
      <SearchInput />
      <Categories data={data} />
    </div>
  );
}

export default SearchFilters;
