"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useCart } from "../hooks/useCart";

type Props = {
  tenantSlug: string;
};

export default function CheckoutView({
  tenantSlug,
}: Props): React.ReactElement {
  const { productIds } = useCart(tenantSlug);
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  return <div>{tenantSlug}</div>;
}
