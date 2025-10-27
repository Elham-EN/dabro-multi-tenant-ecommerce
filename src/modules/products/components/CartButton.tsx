"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/useCart";
import React from "react";

type Props = {
  tenantSlug: string;
  productId: string;
};

export function CartButton({
  tenantSlug,
  productId,
}: Props): React.ReactElement {
  const cart = useCart(tenantSlug);
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
