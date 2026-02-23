
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToStewardDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Protocol Relocation: Treasury control has been removed from the steward portal.
    router.replace("/steward");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-48 space-y-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Re-routing to Audit Terminal...</p>
    </div>
  );
}
