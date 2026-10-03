import { NextResponse } from "next/server";
import { z } from "zod";
import { createIncomingInquiry, getInquiries } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { CURRENT_BRANCH } from "@/lib/branch";

const incomingSchema = z.object({
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
  fromBranch: z.enum(["wuse", "garki"]),
  toBranch: z.enum(["wuse", "garki"]),
  buyer: z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email().or(z.literal("")),
    address: z.string().min(3),
  }),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = incomingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid inquiry payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.toBranch !== CURRENT_BRANCH) {
    return NextResponse.json(
      { error: "This branch is not the intended recipient" },
      { status: 400 }
    );
  }

  const inquiry = createIncomingInquiry(parsed.data);
  return NextResponse.json(inquiry, { status: 201 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getInquiries());
}
