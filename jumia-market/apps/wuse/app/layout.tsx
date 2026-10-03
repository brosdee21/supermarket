import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getBranch } from "@/lib/db";

export const metadata: Metadata = {
  title: "AbujaMart — Phones, Gadgets, Food & More",
  description:
    "Shop phones, tech gadgets, food and everyday essentials with fast local delivery from your nearest AbujaMart branch.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const branch = getBranch();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Suspense fallback={<div className="h-[104px] sm:h-[112px]" />}>
          <Navbar branchName={branch.name} branchAddress={branch.address} />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer
          branchName={branch.name}
          address={branch.address}
          phone={branch.phone}
          hours={branch.hours}
        />
        <CartDrawer />
      </body>
    </html>
  );
}
