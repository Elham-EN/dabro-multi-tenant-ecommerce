"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Home(): React.ReactElement {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  return (
    <div className="flex flex-col justify-center items-center p-10 gap-y-8">
      <h1>Home</h1>
    </div>
  );
}
