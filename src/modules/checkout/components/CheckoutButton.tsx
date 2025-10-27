import React from "react";
import { useCart } from "../hooks/useCart";
import { Button } from "@/components/ui/button";
import { cn, generateTenantURL } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

type Props = {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
};

export function CheckoutButton({
  className,
  hideIfEmpty,
  tenantSlug,
}: Props): React.ReactElement | null {
  const { totalItems } = useCart(tenantSlug);

  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button
      variant={"elevated"}
      asChild
      className={cn("bg-white", className)}
    >
      <Link
        href={`${generateTenantURL(tenantSlug)}/checkout`}
      >
        <ShoppingCartIcon />{" "}
        {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
}
