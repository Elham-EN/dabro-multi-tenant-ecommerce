import { Category } from "@/payload-types";

import React, { ReactElement } from "react";
import CategoryDropdown from "./CategoryDropdown";

interface Props {
  data: Category[];
}

function Categories({ data }: Props): ReactElement {
  return (
    <div className="relative w-full">
      <div className="flex items-center flex-nowrap gap-4">
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
