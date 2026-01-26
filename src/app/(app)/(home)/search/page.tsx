"use client";

import { useSearchParams } from "next/navigation";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/modules/products/components/ProductCard";
import { Loader2Icon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const trpc = useTRPC();

  const { data, isLoading, isError } = useQuery({
    ...trpc.products.search.queryOptions({
      query: query,
      limit: 20,
    }),
    enabled: query.length > 0,
  });

  if (!query) {
    return (
      <div className="text-center py-20">
        <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Search for Products
        </h2>
        <p className="text-gray-600">
          Enter a search term to find products, categories, or tags.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2Icon className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">
          An error occurred while searching. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <p className="text-gray-600">
          {data?.totalDocs === 0
            ? `No results found for "${query}"`
            : `${data?.totalDocs} result${data?.totalDocs === 1 ? "" : "s"} for "${query}"`}
        </p>
      </div>

      {data?.docs && data.docs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.docs.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant?.slug || ""}
              tenantImageUrl={product.tenant?.image?.url}
              reviewRating={product.reviewRating}
              reviewCount={product.reviewCount}
              price={product.price}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find any products matching &quot;{query}&quot;
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse all products
          </Link>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Results</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2Icon className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
