"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import { MenuIcon } from "lucide-react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
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
      <div className="hidden lg:flex h-full">
        <Link
          href={"/sign-in"}
          className="flex items-center justify-center border-l border-t-0 border-r-0 border-b-0 px-12 h-full 
          rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
        >
          Log in
        </Link>

        <Link
          href={"/sign-up"}
          className="border-l border-t-0 border-r-0 border-b-0 px-12 h-full 
          rounded-none bg-black text-white hover:bg-pink-400 hover:text-black
          transition-colors text-lg flex items-center justify-center"
        >
          Start selling
        </Link>
      </div>
      <div className="flex lg:hidden">
        <Button
          variant={"ghost"}
          className="border-transparent bg-white mr-2"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon className="!w-10 !h-10" />
        </Button>
      </div>
      <Sidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        items={navbarItems}
      />
    </nav>
  );
}
