import React from "react";
import type { Metadata } from "next";
import configPromise from "@payload-config";
import { getPayload } from "payload";

export const metadata: Metadata = {
  title: "Dabro | Home",
  description: "Dabro's homepage",
};

export default async function Home(): Promise<React.ReactElement> {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    // Automatically populate/fetch the related data from relationship
    // fields (like parent field) instead of just returning IDs
    depth: 1,
    // Give me all categories that are parents themselves, not children of
    // other categories. Looking for categories that don't have a parent
    where: {
      parent: {
        exists: false,
      },
    },
  });

  console.log("data", data);

  return (
    <div className="flex flex-col justify-center items-center p-10 gap-y-8"></div>
  );
}
