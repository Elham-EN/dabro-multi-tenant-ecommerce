"use client";

import { Input } from "@/components/ui/input";
import {
  BookmarkCheckIcon,
  ListFilterIcon,
  SearchIcon,
} from "lucide-react";
import React, { ReactElement, useState } from "react";
import CategoriesSidebar from "./CategoriesSidebar";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  disabled?: boolean;
}

function SearchInput({ disabled }: Props): ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState<boolean>(false);
  const trpc = useTRPC();
  const session = useQuery(
    trpc.auth.session.queryOptions()
  );
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="relative w-full">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 
        text-neutral-500"
        />
        <Input
          className="pl-10"
          placeholder="Search products"
          disabled={disabled}
        />
      </div>
      <Button
        variant={"elevated"}
        onClick={() => setIsSidebarOpen(true)}
        className="size-12 shrink-0 flex lg:hidden"
      >
        <ListFilterIcon />
      </Button>
      {/* {session.data?.user && (
        <Button asChild variant={"elevated"}>
          <Link href={"/library"}>
            <BookmarkCheckIcon />
            Library
          </Link>
        </Button>
      )} */}
      {/* This tells React: "Only render this on the 
      client, never on the server" */}
      {typeof window !== "undefined" &&
        session.data?.user && (
          <Button asChild variant={"elevated"}>
            <Link href={"/library"}>
              <BookmarkCheckIcon />
            </Link>
          </Button>
        )}
    </div>
  );
}

export default SearchInput;
