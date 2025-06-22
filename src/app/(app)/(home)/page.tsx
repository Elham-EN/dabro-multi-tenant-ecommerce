"use client";

import React from "react";

// import { getQueryClient, trpc } from "@/lib/trpc/server";
import { useTRPC } from "@/lib/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Home(): React.ReactElement {
  // const queryClient = getQueryClient();
  // const categories = await queryClient.fetchQuery(
  //   trpc.categories.getMany.queryOptions()
  // );
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col justify-center items-center p-10 gap-y-8">
      <p className="text-2xl">{JSON.stringify(data, null, 2)}</p>
    </div>
  );
}
