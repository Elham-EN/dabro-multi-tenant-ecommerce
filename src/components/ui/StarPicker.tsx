import React, { useState } from "react";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
};

export default function StarPicker({
  value = 0,
  onChange,
  disabled,
  className,
}: Props): React.ReactElement {
  const [hoverValue, setHoverValue] = useState<number>(0);

  const handleChange = (value: number): void => {
    onChange?.(value);
  };

  return (
    <div
      className={cn(
        "flex items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={cn(
            "p-0.5 hover:scale-110 transition",
            !disabled && "cursor-pointer scale-100"
          )}
          // Current star user clicked on
          onClick={() => handleChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <StarIcon
            className={cn(
              "size-5",
              (hoverValue || value) >= star
                ? "fill-black stroke-black"
                : "stroke-black"
            )}
          />
        </button>
      ))}
    </div>
  );
}
