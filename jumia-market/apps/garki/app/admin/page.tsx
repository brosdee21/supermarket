import Link from "next/link";
import { Package, MessageSquareShare, AlertTriangle, Wallet } from "lucide-react";
import { getOrders, getInquiries, getProducts } from "@/lib/db";
import { formatNaira } from "@/lib/format";

export default function AdminOverviewPage() {
  const orders = getOrders();
  const inquiries = getInquiries();
  const products = getProducts();

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const openInquiries = inquiries.filter((i) => i.status === "open").length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total orders", value: orders.length, icon: Package, href: "/admin/orders" },
    { label: "Pending orders", value: pendingOrders, icon: Package, href: "/admin/orders" },
    {
      label: "Open cross-branch inquiries",
      value: openInquiries,
      icon: MessageSquareShare,
      href: "/admin/inquiries",
    },
    { label: "Out-of-stock items", value: outOfStock, icon: AlertTriangle, href: "/admin/inventory" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Dashboard</h1>
      <p className="text-sm text-neutral-500 mb-6">
        A snapshot of what&apos;s happening at this branch right now.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <span className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center mb-3">
              <Icon size={18} />
            </span>
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="text-xs text-neutral-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={17} className="text-brand" />
          <p className="font-bold">Gross revenue (non-cancelled orders)</p>
        </div>
        <p className="text-2xl font-extrabold mt-1">{formatNaira(revenue)}</p>
      </div>
    </div>
  );
}
