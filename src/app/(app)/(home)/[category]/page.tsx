import React from "react";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function page({ params }: Props) {
  const { category } = await params;
  return <div>page: {category}</div>;
}
