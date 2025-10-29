import CheckoutView from "@/modules/checkout/views/CheckoutView";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({
  params,
}: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  return <CheckoutView tenantSlug={slug} />;
}
