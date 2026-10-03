"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Incorrect password");
      setLoading(false);
      return;
    }

    router.push(searchParams.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-border rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center">
            <ShieldCheck size={22} />
          </span>
          <h1 className="font-bold text-lg">Branch Admin</h1>
          <p className="text-xs text-neutral-500 text-center">
            Enter the branch admin password to manage orders, inventory and
            cross-branch inquiries.
          </p>
        </div>

        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-xl border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 brand-gradient text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          Sign in
        </button>
      </motion.form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
