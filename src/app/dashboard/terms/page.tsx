
"use client";

import { motion } from "framer-motion";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
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
  Info,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Building2
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ClientGovernanceTermsPage() {
  const { clientProjects, financialSteward } = useWhyteStore();
  const [verifiedProjectId, setVerifiedProjectId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setVerifiedProjectId(localStorage.getItem("whyte_verified_project_id"));
  }, []);

  const project = clientProjects.find(p => p.id === verifiedProjectId);

  if (!isMounted) return null;

  // GOVERNANCE EFFECTIVENESS LOGIC
  // Terms are "Effective" only if a steward is assigned AND any reorganization is fully authorized.
  const isReorgInProgress = project?.reorganization && 
    (project.reorganization.status === 'Requested' || project.reorganization.status === 'Pending_Agreement');
  
  const isStewardVerified = project?.assignedStewardId && !isReorgInProgress;
  
  const isEffective = project?.isActivated && isStewardVerified;

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
      content: isReorgInProgress 
        ? "The financial terms for this dossier are currently undergoing a formal reorganization protocol. The updated payout schedule will become effective immediately upon Steward certification."
        : "Capital realization occurs strictly via the authorized payment plan synchronized in this portal. Any reorganization of the payout schedule requires a formal three-party agreement between the Client, Senior Partners, and the assigned Financial Steward.",
      tag: "Section 2.4 — Capital Protocol",
      isUnderReview: isReorgInProgress
    },
    {
      title: "Forensic Auditing",
      icon: <Scale className="h-5 w-5" />,
      content: `Every project is subject to a final professional audit by our assigned Studio Steward (${financialSteward}). Final project closure and dossier archival are only unlocked upon formal verification of site quality sign-offs and full ledger reconciliation.`,
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
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Legal Framework</span>
          </div>
          <h1 className="text-6xl font-headline italic">Governance <span className="not-italic">Dossier.</span></h1>
          <p className="text-muted-foreground font-light text-xl italic max-w-2xl leading-relaxed">
            The professional standards and operational protocols governing your collaboration with Whyte Interior Designs.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Dossier Status</span>
          <Badge className={cn(
            "rounded-none px-6 py-2 uppercase tracking-[0.2em] text-[11px] font-bold shadow-xl border transition-all",
            isEffective 
              ? "bg-green-600 text-white border-green-500" 
              : "bg-orange-500 text-white border-orange-400"
          )}>
            {isEffective ? "Effective & Authorized" : "Protocol Under Review"}
          </Badge>
        </div>
      </motion.div>

      {/* STEWARDSHIP SYNC PANEL */}
      <Card className={cn(
        "rounded-none border shadow-2xl transition-all overflow-hidden",
        isEffective ? "bg-white border-accent/5" : "bg-orange-50 border-orange-200"
      )}>
        <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className={cn(
              "h-16 w-16 flex items-center justify-center shrink-0 border transition-all shadow-sm",
              isEffective ? "bg-accent text-white border-accent" : "bg-white text-orange-500 border-orange-200"
            )}>
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-headline italic">Stewardship Synchronization</h3>
                {isEffective && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </div>
              <p className={cn(
                "text-[13px] font-light italic leading-relaxed",
                isEffective ? "text-muted-foreground" : "text-orange-700"
              )}>
                {isEffective 
                  ? `This dossier was programmatically certified by ${financialSteward} on ${project?.reorganization?.finalizedDate || project?.startDate}.`
                  : `Awaiting professional sync. Terms are subject to certification by our Financial Steward (${financialSteward}).`}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-accent/40">
              <span>Sync Progress</span>
              <span>{isEffective ? '100%' : '65%'}</span>
            </div>
            <Progress value={isEffective ? 100 : 65} className="h-1 bg-accent/5" />
            {!isEffective && (
              <p className="text-[9px] font-bold uppercase tracking-widest text-orange-600 mt-1 flex items-center gap-2">
                <Clock className="h-3 w-3" /> Awaiting Steward Signature
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-8 shadow-sm">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-accent mb-2">Operational Protocol</AlertTitle>
        <AlertDescription className="text-[14px] font-light italic text-muted-foreground leading-relaxed">
          The following terms represent the authoritative framework for Project <strong>{verifiedProjectId}</strong>. 
          Effectiveness is strictly contingent upon the established Stewardship Sync reflected above.
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
            <Card className={cn(
              "rounded-none border bg-white shadow-xl hover:shadow-2xl transition-all h-full group relative",
              clause.isUnderReview ? "border-orange-200 ring-1 ring-orange-100" : "border-accent/5"
            )}>
              {clause.isUnderReview && (
                <div className="absolute top-0 left-0 bg-orange-500 text-white text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 shadow-lg">
                  Clause Under Review
                </div>
              )}
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center justify-between border-b border-accent/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-none flex items-center justify-center transition-all",
                      clause.isUnderReview ? "bg-orange-50 text-orange-500" : "bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white"
                    )}>
                      {clause.icon}
                    </div>
                    <h3 className="text-2xl font-headline italic">{clause.title}</h3>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-accent/30">{clause.tag}</span>
                </div>
                <p className={cn(
                  "text-base font-light italic leading-relaxed border-l-2 pl-8",
                  clause.isUnderReview ? "text-orange-700/70 border-orange-200" : "text-accent/70 border-accent/10"
                )}>
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
        <div className="flex gap-12 text-center md:text-right">
          <span>GDPR / Data Sovereignty Protocol</span>
          <span>Dossier Auth: {verifiedProjectId}</span>
        </div>
      </footer>
    </div>
  );
}
