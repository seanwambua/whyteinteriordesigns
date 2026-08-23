
"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Sparkles, Lock } from "lucide-react";
import { useState, useEffect } from "react";

export default function PricingPage() {
  const [isExistingClient, setIsExistingClient] = useState(false);

  useEffect(() => {
    // Check if user is already onboarded/verified
    const status = localStorage.getItem("whyte_onboarded") === "true";
    setIsExistingClient(status);
  }, []);

  const tiers = [
    {
      name: "Premium",
      price: "Full Commission",
      description: "The essential luxury experience. Focused on refined local curation and expert spatial planning.",
      installments: "50% / 30% / 20% Installments",
      isRestricted: true,
      cta: isExistingClient ? "View Active Project" : "Verify Studio ID",
      highlight: false
    },
    {
      name: "Deluxe",
      price: "Full Commission",
      description: "For those seeking global excellence. A comprehensive journey including international sourcing and custom fabrication.",
      installments: "60% / 20% / 20% Installments",
      isRestricted: true,
      cta: isExistingClient ? "Access Studio Archive" : "Verify Studio ID",
      highlight: true
    },
    {
      name: "Golden",
      price: "Full Commission",
      description: "The ultimate architectural journey. Unrestricted access to global archives and lifetime styling maintenance.",
      installments: "70% / 30% Installments",
      isRestricted: false,
      cta: isExistingClient ? "Welcome Back" : "Enter The Golden Circle",
      highlight: false
    }
  ];

  const getDestination = (isRestricted: boolean) => {
    if (isExistingClient) return "/dashboard";
    return "/dashboard/onboarding";
  };

  return (
    <div className="min-h-screen bg-background font-body">
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
              Bespoke <span className="italic">Commission.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto italic"
            >
              {isExistingClient 
                ? "Your active project archives are synchronized. View your tier details below."
                : "Premium and Deluxe tiers are reserved for returning clients."
              }
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                className={`p-10 border ${tier.highlight ? 'bg-accent text-white border-accent scale-105 z-10' : 'bg-white border-border'} flex flex-col justify-between shadow-2xl relative overflow-hidden`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Sparkles className="h-20 w-20" />
                  </div>
                )}
                
                {tier.isRestricted && !isExistingClient && (
                  <div className="absolute top-6 right-6 flex items-center gap-2 opacity-40">
                    <Lock className="h-3 w-3" />
                    <span className="text-[8px] uppercase tracking-widest font-bold">Returning Only</span>
                  </div>
                )}

                <div>
                  <h3 className={`text-[10px] font-bold uppercase tracking-[0.4em] mb-12 ${tier.highlight ? 'text-white/60' : 'text-accent'}`}>
                    {tier.name} Tier
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-headline">{tier.price}</span>
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-10 ${tier.highlight ? 'text-white/40' : 'text-accent/30'}`}>
                    Schedule: {tier.installments}
                  </div>
                  {/* <p className={`text-sm mb-12 font-light leading-relaxed italic ${tier.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
                    "{tier.description}"
                  </p> */}
                  
                  {/* <ul className="space-y-5 mb-16 border-t border-dashed border-current/10 pt-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${tier.highlight ? 'text-white' : 'text-accent'}`} />
                        <span className={`text-[13px] font-light ${tier.highlight ? 'text-white/90' : 'text-foreground'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul> */}
                </div>
                
                <Button 
                  asChild 
                  size="lg" 
                  className={`w-full h-14 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em] ${
                    tier.highlight 
                    ? 'bg-white text-accent hover:bg-white/90' 
                    : 'bg-accent text-white hover:bg-accent/90'
                  }`}
                >
                  <Link href={getDestination(tier.isRestricted)}>{tier.cta}</Link>
                </Button>
                
                {tier.isRestricted && !isExistingClient && (
                  <p className={`text-[9px] mt-4 text-center uppercase tracking-widest opacity-40 italic ${tier.highlight ? 'text-white' : 'text-accent'}`}>
                    Verification required for restricted access
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-32 border-t border-accent/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent">The Genesis Consultation</h4>
              <p className="text-sm text-muted-foreground font-light italic">Mandatory for all first-time clients — Initial assessment & project discovery — KES 5,000</p>
            </div>
            <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white rounded-none h-12 px-10 uppercase tracking-widest text-[10px]">
              <Link href="/#contact">Book Initial Session</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
