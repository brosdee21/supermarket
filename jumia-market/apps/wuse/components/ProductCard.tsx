"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatNaira, discountPercent } from "@/lib/format";
import { useCart } from "@/store/cart";
import StarRating from "./StarRating";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const discount = discountPercent(product.price, product.originalPrice);
  const outOfStock = product.stock <= 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
      1
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-neutral-200/70 transition-shadow"
      >
        <div className="relative aspect-square bg-surface-muted overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-md">
              -{discount}%
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Out of stock here
              </span>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <p className="text-sm font-medium line-clamp-2 min-h-[2.5rem] group-hover:text-brand transition-colors">
            {product.name}
          </p>
          <div className="mt-1.5">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-bold text-[15px]">{formatNaira(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <motion.button
        onClick={handleAdd}
        disabled={outOfStock}
        whileTap={{ scale: 0.9 }}
        className={`absolute bottom-[4.4rem] sm:bottom-[4.7rem] right-3 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-colors ${
          outOfStock
            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            : justAdded
            ? "bg-accent text-white"
            : "brand-gradient text-white hover:opacity-90"
        }`}
        aria-label="Add to cart"
      >
        {justAdded ? <Check size={16} /> : <Plus size={16} />}
      </motion.button>
    </motion.div>
  );
}
