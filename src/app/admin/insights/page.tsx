"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InsightsRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Default to the Fiscal Terminal sub-page
    router.replace("/admin/insights/fiscal");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-32">
      <div className="h-8 w-8 border-2 border-accent border-t-transparent animate-spin rounded-full" />
    </div>
  );
}
