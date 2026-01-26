"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, XIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../_hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const trpc = useTRPC();

  const { data, isLoading } = useQuery({
    ...trpc.products.search.queryOptions({
      query: debouncedQuery,
      limit: 5,
    }),
    enabled: debouncedQuery.length > 0,
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleProductClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Search products"
      >
        <SearchIcon className="w-5 h-5 text-gray-600" />
      </button>

      {/* Search Modal/Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-[400px] bg-white rounded-lg shadow-xl border z-50">
          <form onSubmit={handleSubmit} className="p-3 border-b">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 p-1 hover:bg-gray-100 rounded-full"
                >
                  <XIcon className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </form>

          {/* Search Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading && debouncedQuery && (
              <div className="flex items-center justify-center py-8">
                <Loader2Icon className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}

            {!isLoading && debouncedQuery && data?.docs.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No products found for &quot;{debouncedQuery}&quot;
              </div>
            )}

            {!isLoading && data && data.docs.length > 0 && (
              <>
                <div className="p-2">
                  {data.docs.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={handleProductClick}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image?.url ? (
                          <Image
                            src={product.image.url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <SearchIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${product.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                {data.totalDocs > 5 && (
                  <div className="p-3 border-t">
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={handleProductClick}
                      className="block text-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      View all {data.totalDocs} results
                    </Link>
                  </div>
                )}
              </>
            )}

            {!debouncedQuery && (
              <div className="py-8 text-center text-gray-500 text-sm">
                Start typing to search products
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
