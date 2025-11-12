"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/useCart";
import Link from "next/link";
import React from "react";

type Props = {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
};

export function CartButton({
  tenantSlug,
  productId,
  isPurchased,
}: Props): React.ReactElement {
  const cart = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Button
        variant={"elevated"}
        asChild
        className="flex-1 font-medium bg-white"
      >
        <Link prefetch href={`/library/${productId}`}>
          View in Library
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant={"elevated"}
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white"
      )}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId)
        ? "Remove from cart"
        : "Add to cart"}
    </Button>
  );
}
