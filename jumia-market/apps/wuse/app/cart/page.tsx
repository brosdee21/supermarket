"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, cartTotal } from "@/store/cart";
import { formatNaira } from "@/lib/format";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function CartPage() {
  const { lines, removeItem, setQuantity } = useCart();
  const mounted = useHasMounted();

  const total = mounted ? cartTotal(lines) : 0;

  if (mounted && lines.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center gap-4">
        <div className="w-24 h-24 rounded-full bg-surface-muted flex items-center justify-center">
          <ShoppingBag size={38} className="text-neutral-300" />
        </div>
        <h1 className="text-xl font-bold">Your cart is empty</h1>
        <p className="text-neutral-500 text-sm max-w-sm">
          Looks like you haven&apos;t added anything yet. Browse our
          products and find something you love.
        </p>
        <Link
          href="/products"
          className="brand-gradient text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-extrabold mb-6">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {lines.map((line) => (
            <div
              key={line.productId}
              className="flex gap-4 bg-white border border-border rounded-2xl p-4"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-muted shrink-0">
                <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{line.name}</p>
                <p className="text-brand font-bold mt-1">{formatNaira(line.price)}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      onClick={() => setQuantity(line.productId, line.quantity - 1)}
                      disabled={line.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <button
                      onClick={() => setQuantity(line.productId, line.quantity + 1)}
                      disabled={line.quantity >= line.maxStock}
                      className="w-8 h-8 flex items-center justify-center disabled:opacity-30"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(line.productId)}
                    className="text-neutral-300 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${line.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 h-fit sticky top-24">
          <h2 className="font-bold mb-4">Order summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neutral-500">Subtotal</span>
            <span>{formatNaira(total)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-neutral-500">Delivery</span>
            <span className="text-accent font-medium">Calculated at checkout</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-border pt-4 mb-5">
            <span>Total</span>
            <span>{formatNaira(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 brand-gradient text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Proceed to checkout <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
