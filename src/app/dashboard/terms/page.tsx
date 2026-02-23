"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Scale, 
  Landmark, 
  Handshake, 
  FileText, 
  Lock,
  Compass,
  Zap,
  Info
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ClientGovernanceTermsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const clauses = [
    {
      title: "Architectural Mandate",
      icon: <Compass className="h-5 w-5" />,
      content: "All commissions are executed with an uncompromising commitment to structural integrity and artisanal quality. Whyte Interior Designs maintains total artistic lead over architectural site protocols to ensure the realization of the agreed creative brief.",
      tag: "Section 1.1 — Quality Control"
    },
    {
      title: "Financial Synchronization",
      icon: <Landmark className="h-5 w-5" />,
      content: "Capital realization occurs strictly via the authorized payment plan synchronized in this portal. Any reorganization of the payout schedule requires a formal three-party agreement between the Client, Senior Partners, and the assigned Financial Steward.",
      tag: "Section 2.4 — Capital Protocol"
    },
    {
      title: "Forensic Auditing",
      icon: <Scale className="h-5 w-5" />,
      content: "Every project is subject to a final professional audit by an independent Studio Steward. Final project closure and dossier archival are only unlocked upon formal verification of site quality sign-offs and full ledger reconciliation.",
      tag: "Section 3.2 — Stewardship"
    },
    {
      title: "Dossier Sovereignty",
      icon: <Lock className="h-5 w-5" />,
      content: "Architectural plans, material procurement registries, and site log metadata are protected under the Studio's Digital Sovereignty protocol. Client access is provided via secure token synchronization and is restricted to the specific commission lifecycle.",
      tag: "Section 4.1 — Data Integrity"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-24 font-body">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Legal Framework</span>
        </div>
        <h1 className="text-6xl font-headline italic">Governance <span className="not-italic">Dossier.</span></h1>
        <p className="text-muted-foreground font-light text-xl italic max-w-2xl leading-relaxed">
          The professional standards and operational protocols governing your collaboration with Whyte Interior Designs.
        </p>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-8 shadow-sm">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-accent mb-2">Protocol Mandate</AlertTitle>
        <AlertDescription className="text-[14px] font-light italic text-muted-foreground leading-relaxed">
          This dossier represents the authoritative terms of engagement for all active commissions. 
          By accessing the Client Portal, you acknowledge the synchronized professional protocols 
          outlined in our Nairobi Studio HQ governance framework.
        </AlertDescription>
      </Alert>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        {clauses.map((clause, index) => (
          <motion.div key={index} variants={item}>
            <Card className="rounded-none border-accent/5 bg-white shadow-xl hover:shadow-2xl transition-all h-full group">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center justify-between border-b border-accent/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-accent/5 rounded-full flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      {clause.icon}
                    </div>
                    <h3 className="text-2xl font-headline italic">{clause.title}</h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-accent/30">{clause.tag}</span>
                </div>
                <p className="text-base font-light italic leading-relaxed text-accent/70 border-l-2 border-accent/10 pl-8">
                  "{clause.content}"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.8 }}
        className="p-12 border border-dashed border-accent/20 bg-secondary/5 text-center space-y-8"
      >
        <div className="flex justify-center items-center gap-6">
          <Handshake className="h-8 w-8 text-accent/20" />
          <ShieldCheck className="h-8 w-8 text-accent/20" />
          <FileText className="h-8 w-8 text-accent/20" />
        </div>
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.5em] font-bold text-accent italic">
            Authenticated Studio Protocol — Nairobi Studio HQ
          </p>
          <p className="text-[9px] uppercase tracking-widest text-accent/40 font-bold">
            Authorized Digital Copy — Valid for Active Commissions Only
          </p>
        </div>
      </motion.div>

      <footer className="pt-12 border-t border-accent/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-accent/20">
        <span>© {new Date().getFullYear()} Whyte Interior Designs</span>
        <div className="flex gap-12">
          <span>GDPR / Data Sovereignty</span>
          <span>Studio ID: WHYTE-NRB-GP-01</span>
        </div>
      </footer>
    </div>
  );
}
