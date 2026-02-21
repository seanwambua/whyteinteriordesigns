"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Feedback } from "@/components/sections/feedback";
import { motion } from "framer-motion";

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent text-sm font-bold uppercase tracking-[0.3em]">Client Voice</span>
              <div className="h-px w-12 bg-accent" />
            </div>
            <h1 className="text-6xl md:text-7xl font-headline mb-8">
              Your <span className="italic">Perspective.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              We believe luxury is a dialogue. Your feedback is the catalyst for our uncompromising pursuit of design excellence.
            </p>
          </motion.div>
          <Feedback />
        </div>
      </main>
      <Footer />
    </div>
  );
}
