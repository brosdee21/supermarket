import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const inStockOnly = searchParams.get("inStockOnly") === "true";

  const products = searchProducts({ q, category, inStockOnly });
  return NextResponse.json(products);
}
