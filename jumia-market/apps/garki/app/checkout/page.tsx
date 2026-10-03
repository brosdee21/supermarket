"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCart, cartTotal } from "@/store/cart";
import { formatNaira } from "@/lib/format";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const mounted = useHasMounted();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const total = mounted ? cartTotal(lines) : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.productId,
            slug: l.slug,
            name: l.name,
            price: l.price,
            quantity: l.quantity,
            image: l.image,
          })),
          buyer: form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not place order. Please try again.");
      }

      clear();
      router.push(`/order/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (mounted && lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-neutral-500">
          Your cart is empty — add something before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-extrabold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold mb-4">Delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-neutral-500">Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30"
                  placeholder="e.g. Chidinma Okafor"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500">Phone number</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full mt-1 rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30"
                  placeholder="e.g. 0803 123 4567"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-neutral-500">Email (optional)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mt-1 rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="you@example.com"
              />
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-neutral-500">Delivery address</label>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full mt-1 rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30 resize-none"
                placeholder="Street, area, landmark..."
              />
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold mb-3">Payment</h2>
            <div className="flex items-center gap-3 border border-border rounded-xl px-4 py-3 text-sm">
              <input type="radio" checked readOnly className="accent-brand" />
              Pay on delivery (cash / transfer)
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 brand-gradient text-white font-semibold py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Place order — {formatNaira(total)}
          </motion.button>
        </form>

        <div className="bg-white border border-border rounded-2xl p-5 h-fit sticky top-24">
          <h2 className="font-bold mb-4">Order summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {lines.map((l) => (
              <div key={l.productId} className="flex gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-muted shrink-0">
                  <Image src={l.image} alt={l.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{l.name}</p>
                  <p className="text-xs text-neutral-500">
                    {l.quantity} × {formatNaira(l.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-border pt-4 mt-4">
            <span>Total</span>
            <span>{formatNaira(total)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-4">
            <ShieldCheck size={14} /> Stock is re-checked at checkout for accuracy
          </div>
        </div>
      </div>
    </div>
  );
}
