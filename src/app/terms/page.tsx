"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-headline mb-12">Terms of Service</h1>
            <div className="prose prose-neutral max-w-none font-light leading-relaxed space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing the Whyte Interior Designs website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">2. Use License</h2>
                <p>
                  Permission is granted to temporarily download one copy of the materials (information or software) on Whyte Interior Designs' website for personal, non-commercial transitory viewing only.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">3. Consultations & Fees</h2>
                <p>
                  Consultation fees are non-refundable once the initial assessment has commenced. Project-based fees are subject to individual contracts signed between the client and the firm.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">4. Disclaimer</h2>
                <p>
                  The materials on our website are provided on an 'as is' basis. Whyte Interior Designs makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability or fitness for a particular purpose.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">5. Governing Law</h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the firm operates.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
