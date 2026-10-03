import Link from "next/link";
import { MapPin, Phone, Clock, ShieldCheck } from "lucide-react";

export default function Footer({
  branchName,
  address,
  phone,
  hours,
}: {
  branchName: string;
  address: string;
  phone: string;
  hours: string;
}) {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white font-black">
              A
            </span>
            <span className="font-extrabold text-lg">
              Abuja<span className="text-brand">Mart</span>
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-3">
            Your trusted marketplace for gadgets, food and everyday
            essentials — with branches across Abuja that work together for
            you.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">{branchName}</h4>
          <ul className="space-y-2 text-sm text-neutral-500">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0" /> {address}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} /> {phone}
            </li>
            <li className="flex items-center gap-2">
              <Clock size={15} /> {hours}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-neutral-500">
            <li>
              <Link href="/products" className="hover:text-brand">
                All products
              </Link>
            </li>
            <li>
              <Link href="/products?category=phones-tablets" className="hover:text-brand">
                Phones &amp; Tablets
              </Link>
            </li>
            <li>
              <Link href="/products?category=food-groceries" className="hover:text-brand">
                Food &amp; Groceries
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Branch team</h4>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-brand"
          >
            <ShieldCheck size={15} /> Admin dashboard
          </Link>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} AbujaMart. Demo project — not a real store.
      </div>
    </footer>
  );
}
