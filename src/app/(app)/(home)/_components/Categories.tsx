import React, { ReactElement } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { CustomCategory } from "../_types/CategoryType";

interface Props {
  data: CustomCategory[];
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
