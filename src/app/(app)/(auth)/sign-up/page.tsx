import React from "react";
import SignUpView from "../_components/SignUpView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dabro | Register",
  description: "Dabro's Sign up page",
};

export default function page() {
  return <SignUpView />;
}
