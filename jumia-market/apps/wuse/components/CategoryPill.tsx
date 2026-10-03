import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Zap,
  ShoppingBasket,
  Shirt,
  Home,
  Sparkles,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Zap,
  ShoppingBasket,
  Shirt,
  Home,
  Sparkles,
};

export default function CategoryPill({
  name,
  slug,
  icon,
  active,
}: {
  name: string;
  slug: string;
  icon: string;
  active?: boolean;
}) {
  const Icon = ICONS[icon] ?? LayoutGrid;

  return (
    <Link
      href={`/products?category=${slug}`}
      className={`flex flex-col items-center gap-2 shrink-0 group`}
    >
      <span
        className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl flex items-center justify-center transition-all duration-300 border ${
          active
            ? "brand-gradient text-white border-transparent shadow-lg shadow-orange-200"
            : "bg-white text-neutral-600 border-border group-hover:border-brand group-hover:text-brand group-hover:-translate-y-1"
        }`}
      >
        <Icon size={26} />
      </span>
      <span
        className={`text-xs font-medium text-center max-w-[76px] ${
          active ? "text-brand" : "text-neutral-600"
        }`}
      >
        {name}
      </span>
    </Link>
  );
}
