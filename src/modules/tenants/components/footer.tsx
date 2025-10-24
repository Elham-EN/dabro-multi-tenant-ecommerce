import React from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export default function Footer() {
  return (
    <footer className="border-t font-medium bg-white">
      <div
        className="max-w-(--breakpoint-xl) mx-auto 
        flex  items-center h-full px-4 py-6 gap-2"
      >
        <p>Powered by</p>
        <Link href={"/"}>
          <span
            className={cn(
              "text-2xl font-semibold",
              poppins.className
            )}
          >
            Dabro
          </span>
        </Link>
      </div>
    </footer>
  );
}
