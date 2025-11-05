"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useCart } from "../hooks/useCart";
import { toast } from "sonner";
import CheckoutItem from "../components/CheckoutItem";
import { generateTenantURL } from "@/lib/utils";

type Props = {
  tenantSlug: string;
};

export default function CheckoutView({
  tenantSlug,
}: Props): React.ReactElement {
  const { productIds, clearAllCarts, removeProduct } =
    useCart(tenantSlug);
  const trpc = useTRPC();
  const { data, error } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  React.useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning(`${error.message}, cart cleared`);
    }
  }, [error, clearAllCarts]);

  const removeProductFromCart = (
    productId: string
  ): void => {
    removeProduct(productId);
  };

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4 space-y-2">
          {data?.docs.map((product, index) => (
            <CheckoutItem
              key={product.id}
              id={product.id}
              isLast={index === data.docs.length - 1}
              imageUrl={product.image?.url}
              name={product.name}
              productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
              tenantUrl={generateTenantURL(
                product.tenant.slug
              )}
              tenantName={product.tenant.name}
              price={product.price}
              onRemove={() =>
                removeProductFromCart(product.id)
              }
            />
          ))}
        </div>
        <div className="lg:col-span-3">
          Column 2 - Checkout Sidebar
        </div>
      </div>
    </div>
  );
}
