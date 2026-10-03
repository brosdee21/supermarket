"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  addItem: (item: Omit<CartLine, "quantity">, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      addItem: (item, qty = 1) => {
        const lines = [...get().lines];
        const existing = lines.find((l) => l.productId === item.productId);
        if (existing) {
          existing.quantity = Math.min(
            existing.quantity + qty,
            existing.maxStock
          );
        } else {
          lines.push({ ...item, quantity: Math.min(qty, item.maxStock) });
        }
        set({ lines, isOpen: true });
      },
      removeItem: (productId) =>
        set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      setQuantity: (productId, qty) => {
        const lines = get().lines.map((l) =>
          l.productId === productId
            ? { ...l, quantity: Math.max(1, Math.min(qty, l.maxStock)) }
            : l
        );
        set({ lines });
      },
      clear: () => set({ lines: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    { name: "cart-storage" }
  )
);

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
