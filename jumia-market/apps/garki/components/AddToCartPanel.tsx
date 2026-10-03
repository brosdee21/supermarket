"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/types";

export default function AddToCartPanel({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        maxStock: product.stock,
      },
      qty
    );
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1500);
  }

  if (outOfStock) return null;

  return (
    <div className="flex items-center gap-3 mt-6">
      <div className="flex items-center border border-border rounded-full">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-10 h-10 flex items-center justify-center hover:text-brand"
        >
          <Minus size={15} />
        </button>
        <span className="w-8 text-center text-sm font-medium">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          className="w-10 h-10 flex items-center justify-center hover:text-brand"
        >
          <Plus size={15} />
        </button>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAdd}
        className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-full transition-colors ${
          added ? "bg-accent text-white" : "brand-gradient text-white hover:opacity-90"
        }`}
      >
        {added ? <Check size={17} /> : <ShoppingCart size={17} />}
        {added ? "Added to cart" : "Add to cart"}
      </motion.button>
    </div>
  );
}
