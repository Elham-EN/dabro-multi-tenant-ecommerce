"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

function NavbarItem({
  href,
  children,
  isActive,
}: NavbarItemProps): React.ReactElement {
  return (
    <Button
      asChild
      variant={"outline"}
      className={cn(
        "bg-transparent hover:bg-transparent hover:border-primary border-transparent rounded-full px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

export default function Navbar(): React.ReactElement {
  const pathname = usePathname();
  return (
    <nav
      className="h-20 border-b flex justify-between items-center 
      font-medium bg-white"
    >
      <Link href={"/"} className="pl-6">
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          Dabro
        </span>
      </Link>
      <div className="lg:flex items-center gap-4 hidden">
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>
      <div className="hidden lg:flex h-full  bg-amber-200">
        <Button
          variant={"secondary"}
          className="border-l border-t-0 border-r-0 border-b-0 px-12 h-full 
          rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
        >
          <Link href={"/sign-in"}> Log in</Link>
        </Button>
        <Button
          className="border-l border-t-0 border-r-0 border-b-0 px-12 h-full 
          rounded-none bg-black text-white hover:bg-pink-400 hover:text-black
          transition-colors text-lg"
        >
          <Link href={"/sign-up"}>Start selling</Link>
        </Button>
      </div>
    </nav>
  );
}
