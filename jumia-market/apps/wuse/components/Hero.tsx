"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, Clock } from "lucide-react";

export default function Hero({ branchName }: { branchName: string }) {
  return (
    <section className="relative overflow-hidden brand-gradient rounded-3xl mx-4 sm:mx-6 mt-4 sm:mt-6">
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full animate-float-slow" />
      <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/10 rounded-full animate-float-slow" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-14 sm:py-20 grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur">
            Now shopping at {branchName}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight text-balance">
            Everything you need, delivered fast around Abuja.
          </h1>
          <p className="text-white/85 mt-4 max-w-md">
            Gadgets, food, fashion and more — all in one place. Can&apos;t
            find stock at your branch? We&apos;ll check our sister branch for
            you.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-brand-dark font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Shop now <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hidden md:grid grid-cols-2 gap-4"
        >
          {[
            { icon: Truck, label: "Fast local delivery" },
            { icon: ShieldCheck, label: "Verified branches" },
            { icon: Clock, label: "8am - 8pm daily" },
            { icon: ArrowRight, label: "Cross-branch stock check" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="bg-white/15 backdrop-blur rounded-2xl p-4 flex flex-col gap-2 text-white"
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
