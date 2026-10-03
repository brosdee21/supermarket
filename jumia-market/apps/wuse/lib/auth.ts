import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "branch_admin_session";

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD || "changeme";
  return Buffer.from(`admin:${password}`).toString("base64");
}

export function checkPassword(password: string) {
  return password === (process.env.ADMIN_PASSWORD || "changeme");
}

export async function createAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return !!token && token === expectedToken();
}
