import { getOrders } from "@/lib/db";
import { formatNaira } from "@/lib/format";
import OrderStatusControl from "@/components/OrderStatusControl";
import { Package } from "lucide-react";

export default function AdminOrdersPage() {
  const orders = getOrders();

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Orders</h1>
      <p className="text-sm text-neutral-500 mb-6">
        All orders placed at this branch, most recent first.
      </p>

      {orders.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-10 flex flex-col items-center text-center gap-2">
          <Package size={28} className="text-neutral-300" />
          <p className="text-neutral-500 text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-xs text-neutral-400">{order.id}</p>
                  <p className="text-sm font-semibold mt-0.5">{order.buyer.name}</p>
                  <p className="text-xs text-neutral-500">
                    {order.buyer.phone} · {order.buyer.address}
                  </p>
                </div>
                <OrderStatusControl orderId={order.id} status={order.status} />
              </div>

              <div className="border-t border-border pt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-neutral-500">
                {order.items.map((item) => (
                  <span key={item.productId}>
                    {item.quantity}× {item.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-neutral-400">
                  {new Date(order.createdAt).toLocaleString("en-NG")}
                </span>
                <span className="font-bold">{formatNaira(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
