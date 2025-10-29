import React from "react";
import Link from "next/link";
import { generateTenantURL } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  slug: string;
};

export default function Navbar({ slug }: Props) {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div
        className="max-w-(--breakpoint-xl) mx-auto 
        flex justify-between items-center h-full px-4"
      >
        <p className="text-xl">Checkout</p>
        <Button variant={"elevated"} asChild>
          <Link href={generateTenantURL(slug)}>
            Continue Shopping
          </Link>
        </Button>
      </div>
    </nav>
  );
}
