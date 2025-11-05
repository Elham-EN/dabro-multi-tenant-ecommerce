import { cn } from "@/lib/utils";
import { formatAsCurrency } from "@/modules/products/utils/formatAsCurrency";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  isLast?: boolean;
  name: string;
  imageUrl?: string | null;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  id: string;
  price: number;
  onRemove: () => void;
};

export default function CheckoutItem({
  imageUrl,
  name,
  productUrl,
  tenantName,
  tenantUrl,
  price,
  onRemove,
}: Props): React.ReactElement {
  return (
    <div
      className={cn(
        "grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border rounded-sm bg-white"
      )}
    >
      {/* Product's image */}
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image
            src={imageUrl || "/productImage.png"}
            alt={name}
            fill
            className="object-cover rounded-l-sm"
          />
        </div>
      </div>
      {/* Product's name & Tenant's name */}
      <div className="py-4 flex flex-col justify-between">
        <div>
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>
          <Link href={tenantUrl}>
            <p className="font-medium underline">
              {tenantName}
            </p>
          </Link>
        </div>
      </div>
      {/* Product's Price & Remove Button */}
      <div className="py-4 flex flex-col justify-between">
        <p className="font-medium">
          {formatAsCurrency(price)}
        </p>
        <button
          className="underline font-medium cursor-pointer"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
