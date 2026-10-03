"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Search, MapPin, Menu, X, ShieldCheck } from "lucide-react";
import { useCart, cartCount } from "@/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function Navbar({
  branchName,
  branchAddress,
}: {
  branchName: string;
  branchAddress: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lines, toggleCart } = useCart();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const mounted = useHasMounted();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  }

  const count = mounted ? cartCount(lines) : 0;

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="hidden sm:flex items-center justify-center gap-2 bg-neutral-900 text-neutral-200 text-xs py-1.5 px-4">
        <MapPin size={12} className="text-brand" />
        <span>
          You&apos;re shopping <strong className="text-white">{branchName}</strong> —{" "}
          {branchAddress}
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white font-black text-lg shadow-sm shadow-orange-300 transition-transform group-hover:scale-105">
              A
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="font-extrabold text-lg tracking-tight">
                Abuja<span className="text-brand">Mart</span>
              </span>
              <span className="text-[11px] text-neutral-500 -mt-1">
                {branchName}
              </span>
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl items-center relative"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for phones, food, gadgets and more..."
              className="w-full rounded-full border border-border bg-surface-muted px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40 focus:bg-white transition-all"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full brand-gradient text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Search size={16} />
            </button>
          </form>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-brand transition-colors px-2"
            >
              <ShieldCheck size={15} />
              Branch admin
            </Link>

            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 rounded-full border border-border px-3.5 py-2 hover:border-brand hover:text-brand transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full brand-gradient text-white text-[11px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-border"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full border border-border bg-surface-muted px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full brand-gradient text-white flex items-center justify-center"
              >
                <Search size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
