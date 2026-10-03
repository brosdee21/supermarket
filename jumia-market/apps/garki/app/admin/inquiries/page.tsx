import { MessageSquareShare, Phone, Mail, MapPin } from "lucide-react";
import { getInquiries } from "@/lib/db";
import { BRANCH_LABELS } from "@/lib/branch";
import InquiryStatusControl from "@/components/InquiryStatusControl";

export default function AdminInquiriesPage() {
  const inquiries = getInquiries();

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Cross-branch inquiries</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Buyers who couldn&apos;t find a product at the sister branch, but
        found it in stock here. Reach out to close the sale.
      </p>

      {inquiries.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-10 flex flex-col items-center text-center gap-2">
          <MessageSquareShare size={28} className="text-neutral-300" />
          <p className="text-neutral-500 text-sm">
            No cross-branch inquiries yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-neutral-400">
                    Sent from {BRANCH_LABELS[inquiry.fromBranch]} ·{" "}
                    {new Date(inquiry.createdAt).toLocaleString("en-NG")}
                  </p>
                  <p className="font-semibold mt-0.5">
                    {inquiry.quantity}× {inquiry.productName}
                  </p>
                </div>
                <InquiryStatusControl inquiryId={inquiry.id} status={inquiry.status} />
              </div>

              <div className="border-t border-border pt-3 grid sm:grid-cols-2 gap-2 text-sm">
                <p className="font-medium">{inquiry.buyer.name}</p>
                <a
                  href={`tel:${inquiry.buyer.phone}`}
                  className="flex items-center gap-1.5 text-brand hover:underline"
                >
                  <Phone size={13} /> {inquiry.buyer.phone}
                </a>
                {inquiry.buyer.email && (
                  <a
                    href={`mailto:${inquiry.buyer.email}`}
                    className="flex items-center gap-1.5 text-neutral-500 hover:text-brand"
                  >
                    <Mail size={13} /> {inquiry.buyer.email}
                  </a>
                )}
                <p className="flex items-center gap-1.5 text-neutral-500">
                  <MapPin size={13} /> {inquiry.buyer.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
