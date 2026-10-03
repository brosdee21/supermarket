import { NextResponse } from "next/server";
import { checkPassword, createAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
