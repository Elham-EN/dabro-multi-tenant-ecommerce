import Navbar from "@/modules/checkout/components/navbar";
import Footer from "@/modules/tenants/components/footer";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function Layout({
  children,
  params,
}: Props) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Navbar slug={slug} />

      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
