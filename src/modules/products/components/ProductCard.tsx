import { generateTenantURL } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
}

export default function ProductCard({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
  price,
}: ProductCardProps): React.ReactElement {
  const router = useRouter();
  const handleUserClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(generateTenantURL(tenantSlug));
  };

  return (
    <Link
      href={`${generateTenantURL(tenantSlug)}/products/${id}`}
      className="group block"
    >
      <div
        className="bg-white rounded-sm border border-black 
        overflow-hidden h-full flex flex-col hover:border-gray-300 
        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={imageUrl || "/productImage.png"}
            fill
            alt={name}
            className="object-fit transition-transform duration-300 
              group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
          />

          {/* Floating Price Badge */}
          <div className="absolute top-3 right-3">
            <div
              className="bg-pink-400 backdrop-blur-sm px-3 py-1.5 
              rounded-full shadow-md border"
            >
              <p className="text-sm font-semibold text-gray-900">
                {new Intl.NumberFormat("en-AU", {
                  style: "currency",
                  currency: "AUD",
                  maximumFractionDigits: 0,
                }).format(price)}
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-col gap-3 p-4 sm:p-5 flex-1">
          {/* Product Name */}
          <h3
            className="text-base sm:text-lg font-semibold text-gray-900 
          line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors"
          >
            {name}
          </h3>

          {/* Author Info */}
          <div
            className="flex items-center gap-2.5"
            onClick={handleUserClick}
          >
            <div className="relative shrink-0">
              <Image
                src={tenantImageUrl || "/productImage.png"}
                alt={tenantSlug || "Author"}
                width={32}
                height={32}
                className="rounded-full border-2 border-gray-100 object-cover size-8"
              />
            </div>
            <p
              className="text-sm font-medium text-gray-600 hover:text-gray-900 
              transition-colors underline"
            >
              by {tenantSlug || "Anonymous"}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {reviewRating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({reviewCount.toLocaleString()})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
