"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MapPinned, CheckCircle2, AlertTriangle, PhoneCall } from "lucide-react";
import { formatNaira } from "@/lib/format";
import type { StockCheckResponse } from "@/lib/types";

type Phase = "checking" | "found" | "not-found" | "unreachable";

export default function CrossBranchAvailability({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName: string;
}) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [info, setInfo] = useState<StockCheckResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    quantity: 1,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/cross-branch/check?slug=${encodeURIComponent(productSlug)}`)
      .then((r) => r.json())
      .then((data: StockCheckResponse & { unreachable?: boolean }) => {
        if (cancelled) return;
        setInfo(data);
        if (data.unreachable) setPhase("unreachable");
        else if (data.available) setPhase("found");
        else setPhase("not-found");
      })
      .catch(() => {
        if (!cancelled) setPhase("unreachable");
      });

    return () => {
      cancelled = true;
    };
  }, [productSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/cross-branch/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          productName,
          quantity: form.quantity,
          buyer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: form.address,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "checking") {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-500 bg-surface-muted rounded-xl px-4 py-3">
        <Loader2 size={16} className="animate-spin" />
        Checking availability at our sister branch...
      </div>
    );
  }

  if (phase === "unreachable") {
    return (
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
        <AlertTriangle size={17} className="mt-0.5 shrink-0" />
        <p>
          This item is out of stock here, and we couldn&apos;t reach our
          sister branch right now to check their stock. Please try again
          shortly or call us directly.
        </p>
      </div>
    );
  }

  if (phase === "not-found") {
    return (
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
        <AlertTriangle size={17} className="mt-0.5 shrink-0" />
        <p>Sorry, this item is currently out of stock at both branches.</p>
      </div>
    );
  }

  // phase === "found"
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-4 text-sm">
      <div className="flex items-start gap-3">
        <MapPinned size={17} className="text-green-700 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-green-800 font-medium">
            Good news — available at {info?.branchName}
            {info?.stock ? ` (${info.stock} in stock)` : ""}.
          </p>
          <p className="text-green-700/80 mt-1">
            Leave your details and {info?.branchName} will contact you
            directly to arrange purchase or delivery.
          </p>

          {!showForm && !submitted && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 inline-flex items-center gap-2 bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-800 transition-colors"
            >
              <PhoneCall size={14} /> Request contact from {info?.branchName}
            </button>
          )}

          <AnimatePresence>
            {showForm && !submitted && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="mt-4 space-y-3 overflow-hidden"
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/30"
                  />
                  <input
                    required
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/30"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/30"
                />
                <input
                  required
                  placeholder="Delivery address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/30"
                />
                <div className="flex items-center gap-2">
                  <label className="text-green-800 text-xs font-medium">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={info?.stock || 99}
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: Number(e.target.value) })
                    }
                    className="w-16 rounded-lg border border-green-200 bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-green-500/30"
                  />
                </div>

                {error && <p className="text-red-600 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-700 text-white font-semibold py-2.5 rounded-full hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Send my details to {info?.branchName}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 text-green-800 font-medium"
            >
              <CheckCircle2 size={16} />
              Sent! {info?.branchName} has your details and{" "}
              {formatNaira(info?.product?.price || 0)} pricing on file — they
              will reach out shortly.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
