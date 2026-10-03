import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { StoreData, Order, CrossBranchInquiry } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "store.json");

function readStore(): StoreData {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as StoreData;
}

function writeStore(data: StoreData) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function getBranch() {
  return readStore().branch;
}

export function getCategories() {
  return readStore().categories;
}

export function getProducts() {
  return readStore().products;
}

export function getProductBySlug(slug: string) {
  return readStore().products.find((p) => p.slug === slug) ?? null;
}

export function getFeaturedProducts() {
  return readStore().products.filter((p) => p.isFeatured);
}

export function searchProducts(opts: {
  q?: string;
  category?: string;
  inStockOnly?: boolean;
}) {
  const { products } = readStore();
  return products.filter((p) => {
    if (opts.category && p.categorySlug !== opts.category) return false;
    if (opts.inStockOnly && p.stock <= 0) return false;
    if (opts.q) {
      const q = opts.q.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });
}

export function createOrder(order: Omit<Order, "id" | "createdAt" | "status">) {
  const store = readStore();
  const newOrder: Order = {
    ...order,
    id: `ord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // decrement stock for each purchased item
  for (const item of order.items) {
    const product = store.products.find((p) => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  }

  store.orders.unshift(newOrder);
  writeStore(store);
  return newOrder;
}

export function getOrders() {
  return readStore().orders;
}

export function getOrderById(id: string) {
  return readStore().orders.find((o) => o.id === id) ?? null;
}

export function createIncomingInquiry(
  inquiry: Omit<CrossBranchInquiry, "id" | "createdAt" | "status">
) {
  const store = readStore();
  const newInquiry: CrossBranchInquiry = {
    ...inquiry,
    id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  store.inquiries.unshift(newInquiry);
  writeStore(store);
  return newInquiry;
}

export function getInquiries() {
  return readStore().inquiries;
}

export function updateInquiryStatus(
  id: string,
  status: CrossBranchInquiry["status"]
) {
  const store = readStore();
  const inquiry = store.inquiries.find((i) => i.id === id);
  if (!inquiry) return null;
  inquiry.status = status;
  writeStore(store);
  return inquiry;
}

export function updateOrderStatus(id: string, status: Order["status"]) {
  const store = readStore();
  const order = store.orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  writeStore(store);
  return order;
}
