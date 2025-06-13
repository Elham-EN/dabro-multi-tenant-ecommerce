import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmsans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dabro | Home",
  description: "Dabro's homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmsans.className} antialiased`}>{children}</body>
    </html>
  );
}
