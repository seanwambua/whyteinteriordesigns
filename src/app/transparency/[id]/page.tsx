
"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Lock, 
  Scale, 
  Banknote, 
  ArrowRight, 
  FileText,
  Building2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function FinancialTransparencyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, financialSteward } = useWhyteStore();
  const { toast } = useToast();
  
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<ClientProject | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const found = clientProjects.find(p => 
        p.id.toUpperCase() === id.toUpperCase() && 
        p.email.toLowerCase() === email.toLowerCase()
      );

      if (found) {
        setProject(found);
        setIsVerified(true);
        toast({ title: "Identity Verified", description: "Audit archives successfully decrypted." });
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Project ID or email does not match our encrypted records."
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-secondary/5 flex items-center justify-center p-6 font-body">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-full max-w-md rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
            <div className="h-1.5 w-full bg-accent" />
            <CardContent className="p-12 space-y-10">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-accent" />
                </div>
                <h1 className="text-3xl font-headline italic">Transparency Portal</h1>
                <p className="text-muted-foreground font-light text-sm italic">Verification required to access commission financial audits.</p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Reference ID</Label>
                  <Input value={id} readOnly className="rounded-none h-12 bg-secondary/10 uppercase tracking-widest font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Client Email Address</Label>
                  <Input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="rounded-none h-12"
                  />
                </div>
                <Button 
                  disabled={isLoading || !email}
                  className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[10px] font-bold flex gap-2"
                >
                  {isLoading ? "Synchronizing..." : <><ShieldCheck className="h-4 w-4" /> Decrypt Dossier</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const audit = project?.termination?.audit;

  if (!audit) {
    return (
      <div className="min-h-screen bg-secondary/5 flex flex-col items-center justify-center p-6 font-body text-center space-y-8">
        <AlertCircle className="h-16 w-16 text-orange-400 opacity-40" />
        <h2 className="text-4xl font-headline italic">Audit Pending Verification</h2>
        <p className="text-muted-foreground max-w-md font-light italic">The Financial Steward ({financialSteward}) has not yet finalized the transparency breakdown for this commission.</p>
        <Button asChild variant="outline" className="rounded-none uppercase tracking-widest text-[10px]">
          <Link href="/">Exit to Site</Link>
        </Button>
      </div>
    );
  }

  const totalAllocated = audit.allocations.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="min-h-screen bg-white font-body p-8 lg:p-24 max-w-6xl mx-auto space-y-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-accent/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Scale className="h-6 w-6 text-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Financial Transparency Dossier</span>
          </div>
          <h1 className="text-6xl font-headline italic">Commission <br /><span className="not-italic">Reconciliation.</span></h1>
          <p className="text-muted-foreground font-light text-xl italic">{project?.project} — {id}</p>
        </div>
        <div className="text-right space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Audit Verified By</p>
          <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[10px] py-2 px-6">{financialSteward}</Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          <section className="space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent/40">Capital Distribution Breakdown</h2>
            <div className="space-y-4">
              {audit.allocations.map((a) => (
                <div key={a.id} className="p-8 border border-accent/5 bg-secondary/5 flex justify-between items-center group hover:bg-accent/[0.02] transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-bold uppercase tracking-widest text-accent">{a.category}</p>
                    <p className="text-xs font-light italic text-muted-foreground">{a.description}</p>
                  </div>
                  <p className="text-2xl font-headline italic">KES {a.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="p-12 border border-accent/10 bg-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Banknote className="h-32 w-32" /></div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent/40">Stewardship Resolution</h2>
            <p className="text-2xl font-light italic leading-relaxed text-accent/80">"{audit.stewardComments}"</p>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-none border-accent/10 bg-black text-white p-10 space-y-12 shadow-2xl">
            <div className="space-y-10">
              <div className="space-y-1">
                <p className="text-[9px] uppercase tracking-widest opacity-40">Cumulative Funds Received</p>
                <p className="text-3xl font-headline italic text-green-400">KES {audit.totalReceived.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase tracking-widest opacity-40">Total Project Costs</p>
                <p className="text-3xl font-headline italic text-orange-400">KES {totalAllocated.toLocaleString()}</p>
              </div>
              <div className="pt-10 border-t border-white/10 space-y-1">
                <p className="text-[9px] uppercase tracking-widest font-bold text-accent-foreground/60">Final Agreed Refund</p>
                <p className="text-5xl font-headline italic">KES {audit.refundAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold opacity-40">
              <Building2 className="h-4 w-4" />
              <span>Escrow Balance: KES {(audit.totalReceived - totalAllocated - audit.refundAmount).toLocaleString()}</span>
            </div>
          </Card>

          <div className="p-8 border border-dashed border-accent/20 text-center space-y-6">
            <p className="text-[9px] uppercase tracking-widest font-bold text-accent/40 leading-relaxed italic">
              This dossier is a legally binding transparency report authorized by the Studio Steward.
            </p>
            <Button asChild variant="ghost" className="text-accent text-[9px] uppercase tracking-widest font-black p-0 h-auto flex items-center justify-center gap-2">
              <Link href="/terms">Review Governance Terms <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
        </div>
      </div>

      <footer className="pt-20 border-t border-accent/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em] text-accent/30">
        <span>© {new Date().getFullYear()} Whyte Interior Designs — Financial Sovereignty</span>
        <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Encrypted Dossier {id}</span>
      </footer>
    </div>
  );
}
