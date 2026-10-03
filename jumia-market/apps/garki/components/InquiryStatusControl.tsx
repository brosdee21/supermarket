"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { InquiryStatus } from "@/lib/types";

const OPTIONS: InquiryStatus[] = ["open", "contacted", "resolved"];

const COLORS: Record<InquiryStatus, string> = {
  open: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

export default function InquiryStatusControl({
  inquiryId,
  status,
}: {
  inquiryId: string;
  status: InquiryStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    await fetch(`/api/admin/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 size={13} className="animate-spin text-neutral-400" />}
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`text-xs font-semibold rounded-full px-3 py-1.5 border-none outline-none cursor-pointer ${COLORS[status]}`}
      >
        {OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
