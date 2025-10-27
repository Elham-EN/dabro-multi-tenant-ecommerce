"use client";

import dynamic from "next/dynamic";
import { useTRPC } from "@/lib/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Fragment, ReactElement } from "react";
import { formatAsCurrency } from "../utils/formatAsCurrency";
import Link from "next/link";
import { generateTenantURL } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import { Button } from "@/components/ui/button";
import { LinkIcon, StarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Load CartButton only on the client side to avoid hydration errors
// CartButton uses localStorage (browser-only), which doesn't exist
// on the server If we render it on the server, it shows "empty cart"
// but client shows "items in cart" This mismatch causes hydration
// errors, so we skip server rendering entirely
const CartButton = dynamic(
  () =>
    import("../components/CartButton").then(
      (mod) => mod.CartButton
    ),
  {
    // Don't render on server - client only!
    ssr: false,
    loading: () => (
      <Button disabled className="flex-1 bg-pink-400">
        Add to cart
      </Button>
    ),
  }
);
type Props = {
  productId: string;
  tenantSlug: string;
};

function ProductView({
  productId,
  tenantSlug,
}: Props): ReactElement {
  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );
  return (
    <div className="px-4 lg:px-12 py-10 ">
      <div className="border rounded-sm bg-white overflow-hidden">
        {/* Product Image Banner */}
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={product.image?.url || "/productImage.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        {/* Product information */}
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            {/* Product Name */}
            <div className="p-6">
              <h1 className="text-4xl font-medium">
                {product.name}
              </h1>
            </div>
            {/* Product Price & author / tenant (shop) & Ratings */}
            <div className="border-y flex ">
              {/* Product Price */}
              <div className="px-6 py-4 flex items-center justify-center border-r ">
                <div className="relative px-2 py-1 border bg-pink-400 w-fit ">
                  <p className="text-base font-medium">
                    {formatAsCurrency(product.price)}
                  </p>
                </div>
              </div>
              {/* Product's author / tenant (shop) */}
              <div
                className="px-6 py-4 flex items-center justify-center gap-2 
                lg:border-r"
              >
                <Link
                  href={generateTenantURL(tenantSlug)}
                  className="flex items-center gap-2"
                >
                  {product.tenant.image?.url && (
                    <Image
                      src={product.tenant.image.url}
                      alt={product.tenant.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-[30px]"
                    />
                  )}
                  <p className="text-base underline font-medium">
                    {product.tenant.name}
                  </p>
                </Link>
              </div>
              {/* Hidden on Mobile */}
              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-1">
                  <StarRating
                    rating={4}
                    iconClassName="size-4"
                  />
                </div>
              </div>
            </div>
            {/* Ratings For mobile only */}
            <div
              className="lg:hidden px-6 py-4 flex items-center 
              justify-center border-b"
            >
              <div className="flex items-center gap-1">
                <StarRating
                  rating={4}
                  iconClassName="size-4"
                />
                <p className="text-base font-medium">
                  {5} ratings
                </p>
              </div>
            </div>
            {/* Product Description  */}
            <div className="p-6">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="font-medium text-muted-foreground">
                  No description provided
                </p>
              )}
            </div>
          </div>
          {/* Button & Policy & Ratings */}
          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              {/* Button & Policy */}
              <div className="flex flex-col gap-4 p-6 border-b">
                {/* Button */}
                <div className="flex flex-row items-center gap-2">
                  <CartButton
                    tenantSlug={tenantSlug}
                    productId={productId}
                  />
                  <Button
                    className="size-12"
                    variant={"elevated"}
                    onClick={() => {}}
                    disabled={false}
                  >
                    <LinkIcon />
                  </Button>
                </div>
                {/* Policy */}
                <p className="text-center font-medium">
                  {product.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${product.refundPolicy} money back guarantee`}
                </p>
              </div>
              {/* Ratings */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">
                    Ratings
                  </h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({5})</p>
                    <p className="text-base">{5} ratings</p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium space-x-1">
                        <span>{stars}</span>
                        <span>
                          {stars === 1 ? "star" : "stars"}
                        </span>
                      </div>
                      <Progress
                        value={25}
                        className="h-[1lh]"
                      />
                      <div>{0}%</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductView;
