import AdminNav from "@/components/AdminNav";
import { getBranch } from "@/lib/db";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const branch = getBranch();

  return (
    <div className="bg-surface-muted min-h-[80vh]">
      <AdminNav branchName={branch.name} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}
