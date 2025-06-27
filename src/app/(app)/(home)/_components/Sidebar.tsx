import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface SidebarProps {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Sidebar({
  items,
  open,
  onOpenChange,
}: SidebarProps): React.ReactElement {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const logout = useMutation(trpc.auth.logout.mutationOptions());
  const session = useQuery(trpc.auth.session.queryOptions());
  const handleLogout = () => {
    logout.mutate(void {}, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        redirect("/sign-in");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex flex-co h-full overflow-y-auto pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full flex items-center text-left p-4 hover:bg-black 
              hover:text-white"
            >
              {item.children}
            </Link>
          ))}
          {session.data?.user ? (
            <div className="border-t">
              <Link
                href={"/admin"}
                className="w-full flex items-center text-base font-medium text-left p-4 
              hover:bg-black hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href={"#"}
                onClick={handleLogout}
                className="w-full flex items-center text-base font-medium text-left p-4 
              hover:bg-black hover:text-white"
              >
                Log out
              </Link>
            </div>
          ) : (
            <>
              <div className="border-t">
                <Link
                  href={"/sign-in"}
                  className="w-full flex items-center text-base font-medium text-left p-4 
              hover:bg-black hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  href={"/sign-up"}
                  className="w-full flex items-center text-base font-medium text-left p-4 
              hover:bg-black hover:text-white"
                >
                  Start Selling
                </Link>
              </div>
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
