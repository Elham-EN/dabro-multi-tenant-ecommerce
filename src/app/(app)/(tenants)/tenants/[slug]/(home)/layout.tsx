import Footer from "@/modules/tenants/components/footer";
import Navbar from "@/modules/tenants/components/navbar";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
