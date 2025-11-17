import { useTRPC } from "@/lib/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import ReviewForm from "./ReviewForm";

type Props = {
  productId: string;
};

export default function ReviewSidebar({
  productId,
}: Props): React.ReactElement {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({ productId })
  );

  return (
    <ReviewForm productId={productId} initialData={data} />
  );
}
