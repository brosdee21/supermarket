import { NextResponse } from "next/server";
import { PARTNER_BRANCH, PARTNER_BRANCH_URL, BRANCH_LABELS } from "@/lib/branch";
import type { StockCheckResponse } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const res = await fetch(`${PARTNER_BRANCH_URL}/api/inventory/${slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error(`Partner branch responded with ${res.status}`);
    }

    const data = (await res.json()) as StockCheckResponse;
    return NextResponse.json(data);
  } catch {
    // The sister branch could be offline / unreachable — degrade gracefully
    // instead of breaking the shopping experience.
    const fallback: StockCheckResponse & { unreachable: true } = {
      available: false,
      branch: PARTNER_BRANCH,
      branchName: BRANCH_LABELS[PARTNER_BRANCH],
      stock: 0,
      unreachable: true,
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}
