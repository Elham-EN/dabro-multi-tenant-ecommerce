import { InboxIcon } from "lucide-react";
import React from "react";

export default function ProductNotFound() {
  return (
    <div
      className="border border-black border-dashed flex flex-col 
        items-center justify-center gap-y-4 p-8 w-full rounded-lg"
    >
      <InboxIcon />
      <p className="text-base font-medium">
        No Product found
      </p>
    </div>
  );
}
