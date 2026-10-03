import Image from "next/image";
import { getProducts } from "@/lib/db";
import { formatNaira } from "@/lib/format";

export default function AdminInventoryPage() {
  const products = [...getProducts()].sort((a, b) => a.stock - b.stock);

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Inventory</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Live stock levels at this branch, lowest first.
      </p>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-neutral-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-surface-muted shrink-0">
                      <Image src={p.image} alt={p.name} fill sizes="36px" className="object-cover" />
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-500">{p.categorySlug}</td>
                <td className="px-4 py-3 text-right">{formatNaira(p.price)}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.stock <= 0
                        ? "bg-red-100 text-red-700"
                        : p.stock <= 5
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {p.stock} in stock
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
