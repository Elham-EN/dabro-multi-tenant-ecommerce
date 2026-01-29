import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { caller } from "@/lib/trpc/server";
import SignInView from "../_components/SignInView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dabro | Login",
  description: "Dabro's Login page",
};

export default async function page() {
  const session = await caller.auth.session();

  if (session.user) {
    redirect("/");
  }

  return <SignInView />;
}
