import { NextResponse } from "next/server";
import { z } from "zod";
import { CURRENT_BRANCH, PARTNER_BRANCH, PARTNER_BRANCH_URL } from "@/lib/branch";

const bodySchema = z.object({
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
  buyer: z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email().or(z.literal("")),
    address: z.string().min(3),
  }),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const payload = {
    ...parsed.data,
    fromBranch: CURRENT_BRANCH,
    toBranch: PARTNER_BRANCH,
  };

  try {
    const res = await fetch(`${PARTNER_BRANCH_URL}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error(`Partner branch responded with ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not reach the sister branch right now. Please call them directly.",
      },
      { status: 502 }
    );
  }
}
