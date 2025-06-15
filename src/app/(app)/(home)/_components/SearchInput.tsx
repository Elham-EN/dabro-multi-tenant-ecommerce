import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React, { ReactElement } from "react";

interface Props {
  disabled?: boolean;
}

function SearchInput({ disabled }: Props): ReactElement {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative w-full">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 
        text-neutral-500"
        />
        <Input
          className="pl-10"
          placeholder="Search products"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default SearchInput;
