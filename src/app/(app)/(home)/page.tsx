import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dabro | Home",
  description: "Dabro's homepage",
};

export default async function Home(): Promise<React.ReactElement> {
  return (
    <div className="flex flex-col justify-center items-center p-10 gap-y-8">
      Home page
    </div>
  );
}
