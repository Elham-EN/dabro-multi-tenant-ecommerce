"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useCart } from "../hooks/useCart";
import { toast } from "sonner";
import CheckoutItem from "../components/CheckoutItem";
import { generateTenantURL } from "@/lib/utils";
import CheckoutSidebar from "../components/CheckoutSidebar";
import ProductNotFound from "@/components/ui/ProductNotFound";
import { LoaderIcon } from "lucide-react";

type Props = {
  tenantSlug: string;
};

export default function CheckoutView({
  tenantSlug,
}: Props): React.ReactElement {
  const { productIds, clearAllCarts, removeProduct } =
    useCart(tenantSlug);
  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(
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

  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div
          className="border border-black border-dashed flex flex-col 
              items-center justify-center gap-y-4 p-8 w-full rounded-lg"
        >
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (!data || data?.totalDocs === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <ProductNotFound />
      </div>
    );
  }

  const removeProductFromCart = (
    productId: string
  ): void => {
    removeProduct(productId);
  };

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        {/* Column 1 - Checkout Item */}
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
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
        </div>
        {/* Column 2 - Checkout Sidebar */}
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice}
            onCheckout={() => {}}
            isCanceled={false}
            isPending={false}
          />
        </div>
      </div>
    </div>
  );
}
