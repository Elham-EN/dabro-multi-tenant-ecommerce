import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import React, { ReactElement } from "react";

type Props = {
  rating: number;
  className?: string;
  iconClassName?: string;
  text?: string;
};

const MAX_RATING = 5;
const MIN_RATING = 0;

export default function StarRating({
  rating,
  className,
  iconClassName,
  text,
}: Props): ReactElement {
  const safeRating = Math.max(
    MIN_RATING,
    Math.min(rating, MAX_RATING)
  );
  return (
    <div
      className={cn("flex items-center gap-x-1", className)}
    >
      {Array.from({ length: MAX_RATING }).map(
        (_, index) => (
          <StarIcon
            key={index}
            className={cn(
              "size-4",
              index < safeRating ? "fill-black" : "",
              iconClassName
            )}
          />
        )
      )}
      {text && <p>{text}</p>}
    </div>
  );
}
