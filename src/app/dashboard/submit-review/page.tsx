
"use client";

import { motion } from "framer-motion";
import { Feedback } from "@/components/sections/feedback";
import { Star, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function ClientSubmitReviewPage() {
  const [verifiedProjectId, setVerifiedProjectId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setVerifiedProjectId(localStorage.getItem("whyte_verified_project_id"));
  }, []);

  if (!isMounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Testimonial Protocol</span>
          <div className="h-px w-12 bg-accent" />
        </div>
        <h1 className="text-6xl font-headline">The <span className="italic">Perspective.</span></h1>
        <p className="text-xl text-muted-foreground font-light max-w-xl mx-auto italic">
          Your feedback is the catalyst for our uncompromising pursuit of design excellence. 
          Thank you for trusting Whyte Interior Designs with your {verifiedProjectId || "project"}.
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute -top-10 -left-10 opacity-5">
          <Star className="h-40 w-40 text-accent" />
        </div>
        <Feedback />
      </div>

      <div className="flex justify-center items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">
        <ShieldCheck className="h-4 w-4" />
        <span>Authenticated Studio Review — Nairobi Studio HQ</span>
      </div>
    </div>
  );
}
