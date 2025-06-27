import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { caller } from "@/lib/trpc/server";
import SignUpView from "../_components/SignUpView";

export const metadata: Metadata = {
  title: "Dabro | Register",
  description: "Dabro's Sign up page",
};

export default async function page() {
  const session = await caller.auth.session();

  if (session.user) {
    redirect("/");
  }
  return <SignUpView />;
}
