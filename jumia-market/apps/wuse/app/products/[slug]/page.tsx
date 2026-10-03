import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { getProductBySlug, getProducts, getCategories, getBranch } from "@/lib/db";
import { formatNaira, discountPercent } from "@/lib/format";
import StarRating from "@/components/StarRating";
import AddToCartPanel from "@/components/AddToCartPanel";
import CrossBranchAvailability from "@/components/CrossBranchAvailability";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? `${product.name} — AbujaMart` : "Product not found" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const branch = getBranch();
  const categories = getCategories();
  const category = categories.find((c) => c.slug === product.categorySlug);
  const related = getProducts()
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 5);
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-brand">Products</Link>
        {category && (
          <>
            <ChevronRight size={12} />
            <Link href={`/products?category=${category.slug}`} className="hover:text-brand">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-neutral-700 truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-muted border border-border">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                -{discount}%
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {product.gallery.map((src, i) => (
              <div
                key={src + i}
                className="relative aspect-square rounded-xl overflow-hidden bg-surface-muted border border-border"
              >
                <Image src={src} alt={`${product.name} ${i + 1}`} fill sizes="150px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold leading-snug">{product.name}</h1>
          <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={15} />
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-extrabold text-brand">
              {formatNaira(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-neutral-400 line-through text-lg">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-neutral-600 text-sm leading-relaxed mt-4">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mt-4 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? "bg-accent" : "bg-red-500"
              }`}
            />
            <span className={product.stock > 0 ? "text-accent font-medium" : "text-red-600 font-medium"}>
              {product.stock > 0
                ? `In stock at ${branch.name} (${product.stock} available)`
                : `Out of stock at ${branch.name}`}
            </span>
          </div>

          <AddToCartPanel product={product} />

          {product.stock <= 0 && (
            <div className="mt-4">
              <CrossBranchAvailability
                key={product.slug}
                productSlug={product.slug}
                productName={product.name}
              />
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3 mt-8">
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-surface-muted rounded-xl px-3 py-3">
              <Truck size={16} className="text-brand shrink-0" /> Fast local delivery
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-surface-muted rounded-xl px-3 py-3">
              <ShieldCheck size={16} className="text-brand shrink-0" /> Verified product
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-surface-muted rounded-xl px-3 py-3">
              <RotateCcw size={16} className="text-brand shrink-0" /> Easy returns
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-extrabold mb-4">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
