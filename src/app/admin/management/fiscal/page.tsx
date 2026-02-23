
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToStewardFiscalPage() {
  const router = useRouter();

  useEffect(() => {
    // Protocol Relocation: This terminal has been moved to the Steward Portal
    router.replace("/admin");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-48">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
    </div>
  );
}
