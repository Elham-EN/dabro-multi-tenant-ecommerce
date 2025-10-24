"use client";

import { useTRPC } from "@/lib/trpc/client";
import { generateTenantURL } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import React from "react";

type Props = {
  slug: string;
};

export default function Navbar({ slug }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({ slug })
  );
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div
        className="max-w-(--breakpoint-xl) mx-auto 
        flex justify-between items-center h-full px-4"
      >
        <Link
          href={generateTenantURL(slug)}
          className="flex items-center gap-2"
        >
          {data.image?.url && (
            <Image
              src={data.image.url}
              width={32}
              height={32}
              alt={slug}
              className="rounded-full border shrink-0 size-[32px]"
            />
          )}
          <p className="text-xl">{data.name}</p>
        </Link>
      </div>
    </nav>
  );
}

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div
        className="max-w-(--breakpoint-xl) mx-auto 
        flex justify-between items-center h-full px-4"
      >
        <div />
        {/* TODO: Skeleton for checkout button */}
      </div>
    </nav>
  );
};
