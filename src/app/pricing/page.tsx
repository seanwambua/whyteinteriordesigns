"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";

export default function PricingPage() {
  const tiers = [
    {
      name: "The Advisory",
      price: "KES 650,000",
      description: "A comprehensive initial phase for those seeking master-level guidance and conceptual direction.",
      features: [
        "On-site architectural assessment",
        "Materiality & finish consultation"
      ],
      cta: "Book Consultation",
      href: "/#contact",
      highlight: false
    },
    {
      name: "The Full Commission",
      price: "Project-Based",
      description: "An end-to-end journey from raw space to a masterfully curated residence or commercial environment.",
      features: [
        "Everything in 'The Advisory'",
        "Full architectural blueprints & 3D renders",
        "Bespoke furniture & lighting design",
        "Global procurement & white-glove delivery",
        "On-site project management & styling"
      ],
      cta: "Request Proposal",
      href: "/#quiz",
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-4 mb-6"
            >
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent text-sm font-bold uppercase tracking-[0.3em]">The Investment</span>
              <div className="h-px w-12 bg-accent" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-8xl font-headline mb-8"
            >
              Transparency in <span className="italic">Excellence.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto"
            >
              We believe luxury is built on trust and clarity. Our structured investment tiers ensure your vision is realized with uncompromising precision.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                className={`p-12 border ${tier.highlight ? 'bg-accent text-white border-accent' : 'bg-white border-border'} flex flex-col justify-between shadow-2xl`}
              >
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-[0.3em] mb-8 ${tier.highlight ? 'text-white/60' : 'text-accent'}`}>
                    {tier.name}
                  </h3>
                  <div className="mb-8">
                    <span className="text-5xl font-headline">{tier.price}</span>
                    {tier.name === "The Advisory" && <span className={`text-sm ml-2 ${tier.highlight ? 'text-white/60' : 'text-muted-foreground'}`}>Initial Fee</span>}
                  </div>
                  <p className={`text-lg mb-12 font-light leading-relaxed ${tier.highlight ? 'text-white/80 italic' : 'text-muted-foreground'}`}>
                    {tier.description}
                  </p>
                  
                  <ul className="space-y-6 mb-16">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-4">
                        <Check className={`h-5 w-5 mt-0.5 ${tier.highlight ? 'text-white' : 'text-accent'}`} />
                        <span className={`font-light ${tier.highlight ? 'text-white/90' : 'text-foreground'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  asChild 
                  size="lg" 
                  className={`w-full h-14 rounded-none text-lg transition-all hover:tracking-wider ${
                    tier.highlight 
                    ? 'bg-white text-accent hover:bg-white/90' 
                    : 'bg-accent text-white hover:bg-accent/90'
                  }`}
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-32 text-center"
          >
            <h4 className="text-2xl font-headline italic mb-4">Unsure where to begin?</h4>
            <Link href="/#quiz" className="text-accent font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:opacity-70 transition-opacity">
              Identify Your Visual Language <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
