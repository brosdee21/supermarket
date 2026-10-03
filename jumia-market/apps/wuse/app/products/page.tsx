import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getCategories, searchProducts } from "@/lib/db";

export const metadata = { title: "All products — AbujaMart" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const categories = getCategories();
  const products = searchProducts({ q, category });
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">
          {q ? `Results for "${q}"` : activeCategory ? activeCategory.name : "All products"}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {products.length} product{products.length !== 1 && "s"} found
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
        <Link
          href="/products"
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !category
              ? "brand-gradient text-white border-transparent"
              : "border-border text-neutral-600 hover:border-brand hover:text-brand"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.slug}`}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              category === c.slug
                ? "brand-gradient text-white border-transparent"
                : "border-border text-neutral-600 hover:border-brand hover:text-brand"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <SlidersHorizontal size={32} className="text-neutral-300" />
          <p className="text-neutral-500">
            No products matched your search at this branch.
          </p>
          <Link href="/products" className="text-brand font-semibold text-sm hover:underline">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
