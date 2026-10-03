import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import { getOrderById, getBranch } from "@/lib/db";
import { formatNaira } from "@/lib/format";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) notFound();

  const branch = getBranch();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 rounded-full bg-green-100 text-accent flex items-center justify-center">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl font-extrabold">Order placed successfully!</h1>
        <p className="text-neutral-500 text-sm">
          Reference:{" "}
          <span className="font-mono font-semibold text-neutral-800">{order.id}</span>
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5 mt-8">
        <h2 className="font-bold mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-3 items-center">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-muted shrink-0">
                <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-neutral-500">
                  {item.quantity} × {formatNaira(item.price)}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatNaira(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-border pt-4 mt-4">
          <span>Total</span>
          <span>{formatNaira(order.total)}</span>
        </div>
      </div>

      <div className="bg-brand-light border border-orange-100 rounded-2xl p-5 mt-4 text-sm">
        <p className="font-semibold text-brand-dark mb-2">
          Pickup / delivery from {branch.name}
        </p>
        <p className="flex items-center gap-2 text-neutral-600">
          <MapPin size={14} /> {branch.address}
        </p>
        <p className="flex items-center gap-2 text-neutral-600 mt-1">
          <Phone size={14} /> {branch.phone}
        </p>
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="/products"
          className="brand-gradient text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
