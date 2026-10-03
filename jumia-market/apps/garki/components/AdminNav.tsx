"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, MessageSquareShare, Boxes, LogOut } from "lucide-react";

const TABS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/inquiries", label: "Cross-branch inquiries", icon: MessageSquareShare },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
];

export default function AdminNav({ branchName }: { branchName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;


  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
        <div>
          <p className="font-bold">{branchName} — Admin</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto pb-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "brand-gradient text-white"
                  : "text-neutral-600 hover:bg-surface-muted"
              }`}
            >
              <Icon size={15} /> {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
