import { NextResponse } from "next/server";
import { getBranch, getProductBySlug } from "@/lib/db";
import type { StockCheckResponse } from "@/lib/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const branch = getBranch();
  const product = getProductBySlug(slug);

  const response: StockCheckResponse = {
    available: !!product && product.stock > 0,
    branch: branch.slug,
    branchName: branch.name,
    stock: product?.stock ?? 0,
    product: product
      ? {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
        }
      : undefined,
  };

  return NextResponse.json(response);
}
