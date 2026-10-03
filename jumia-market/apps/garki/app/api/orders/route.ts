import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder, getProductBySlug } from "@/lib/db";
import { CURRENT_BRANCH } from "@/lib/branch";

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        slug: z.string(),
        name: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
        image: z.string(),
      })
    )
    .min(1),
  buyer: z.object({
    name: z.string().min(2, "Name is too short"),
    phone: z.string().min(7, "Enter a valid phone number"),
    email: z.string().email().or(z.literal("")),
    address: z.string().min(5, "Enter a delivery address"),
  }),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = orderSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Re-validate stock server-side so it can never be bypassed from the client.
  for (const item of parsed.data.items) {
    const product = getProductBySlug(item.slug);
    if (!product || product.stock < item.quantity) {
      return NextResponse.json(
        {
          error: `"${item.name}" no longer has enough stock at this branch.`,
        },
        { status: 409 }
      );
    }
  }

  const total = parsed.data.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const order = createOrder({
    branch: CURRENT_BRANCH,
    items: parsed.data.items,
    buyer: parsed.data.buyer,
    total,
  });

  return NextResponse.json(order, { status: 201 });
}
