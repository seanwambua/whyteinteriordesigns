"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
            <h1 className="text-5xl font-headline mb-12">Privacy Policy</h1>
            <div className="prose prose-neutral max-w-none font-light leading-relaxed space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">1. Introduction</h2>
                <p>
                  At Whyte Interior Designs, we are committed to protecting your personal data and respecting your privacy. This policy explains how we process your information in compliance with the General Data Protection Regulation (GDPR).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">2. Data We Collect</h2>
                <p>
                  We may collect personal identification information, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact details (email, phone number)</li>
                  <li>Project details and aesthetic preferences</li>
                  <li>IP address and browser information via cookies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">3. Legal Basis for Processing</h2>
                <p>
                  We process your data based on your consent (e.g., when you fill out our Style Quiz or Contact form) or for the performance of a contract to provide our interior design services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">4. Your Rights</h2>
                <p>
                  Under the GDPR, you have the right to access, rectify, or erase your personal data. You may also object to processing or request data portability. To exercise these rights, please contact us at privacy@whyteinteriors.com.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-headline text-foreground mb-4">5. Data Retention</h2>
                <p>
                  We retain your personal data only as long as necessary for the purposes for which it was collected, including legal or reporting requirements.
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
