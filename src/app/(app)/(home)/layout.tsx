import React, { ReactElement } from "react";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Category } from "@/payload-types";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import SearchFilters from "./_components/SearchFilters";
import { CustomCategory } from "./_types/CategoryType";

interface LayoutProps {
  children: React.ReactNode;
}

async function Layout({ children }: LayoutProps): Promise<ReactElement> {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    sort: "name",
    // Automatically populate/fetch the related data from relationship
    // fields (like parent field) instead of just returning IDs
    depth: 1,
    pagination: false,
    // Give me all categories that are parents themselves, not children of
    // other categories. Looking for categories that don't have a parent
    where: {
      parent: {
        exists: false,
      },
    },
  });

  // Removes the nested .docs - Instead of category.subcategories.docs[0],
  // just use category.subcategories[0]
  const formatedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formatedData} />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
