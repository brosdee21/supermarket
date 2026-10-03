import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryPill from "@/components/CategoryPill";
import ProductCard from "@/components/ProductCard";
import { getBranch, getCategories, getFeaturedProducts, getProducts } from "@/lib/db";
import { PARTNER_BRANCH, BRANCH_LABELS } from "@/lib/branch";
import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export default function HomePage() {
  const branch = getBranch();
  const categories = getCategories();
  const featured = getFeaturedProducts();
  const all = getProducts();

  return (
    <div className="pb-16">
      <Hero branchName={branch.name} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <CategoryPill key={c.id} name={c.name} slug={c.slug} icon={c.icon} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Truck, title: "Fast delivery", desc: "Same-branch orders shipped same day" },
          { icon: ShieldCheck, title: "Verified stock", desc: "Real-time inventory, no fake listings" },
          { icon: RefreshCw, title: `Linked with ${BRANCH_LABELS[PARTNER_BRANCH]}`, desc: "Out of stock? We check our sister branch" },
          { icon: Headphones, title: "Local support", desc: "Talk to a real person at your branch" },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white border border-border rounded-2xl p-4 flex items-start gap-3 hover:shadow-md transition-shadow"
          >
            <span className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
              <Icon size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold">Featured deals</h2>
              <p className="text-sm text-neutral-500">Hand-picked products trending at {branch.name}</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand hover:underline shrink-0">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">All products</h2>
            <p className="text-sm text-neutral-500">Browse everything available at {branch.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {all.slice(0, 15).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
