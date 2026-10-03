"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, cartTotal } from "@/store/cart";
import { formatNaira } from "@/lib/format";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, setQuantity } = useCart();
  const mounted = useHasMounted();

  if (!mounted) return null;

  const total = cartTotal(lines);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-dvh w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShoppingBag size={19} className="text-brand" />
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
                <div className="w-20 h-20 rounded-full bg-surface-muted flex items-center justify-center">
                  <ShoppingBag size={30} className="text-neutral-300" />
                </div>
                <p className="text-neutral-500 text-sm">
                  Your cart is empty. Start adding some great products!
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 text-brand font-semibold text-sm hover:underline"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.div
                        key={line.productId}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                        className="flex gap-3"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-muted shrink-0">
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{line.name}</p>
                          <p className="text-brand font-bold text-sm mt-0.5">
                            {formatNaira(line.price)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                setQuantity(line.productId, line.quantity - 1)
                              }
                              disabled={line.quantity <= 1}
                              className="w-6 h-6 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:border-brand"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm w-5 text-center">
                              {line.quantity}
                            </span>
                            <button
                              onClick={() =>
                                setQuantity(line.productId, line.quantity + 1)
                              }
                              disabled={line.quantity >= line.maxStock}
                              className="w-6 h-6 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:border-brand"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(line.productId)}
                          className="text-neutral-300 hover:text-red-500 transition-colors h-fit"
                          aria-label={`Remove ${line.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-border px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-bold text-lg">{formatNaira(total)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block text-center w-full brand-gradient text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity active:scale-[0.98]"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
