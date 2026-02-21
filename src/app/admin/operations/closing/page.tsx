"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileCheck, 
  Landmark, 
  ShieldCheck, 
  Settings2, 
  Wallet, 
  Building2,
  Archive,
  Loader2,
  Info,
  CheckCircle2,
  Star,
  ExternalLink,
  Eye,
  Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWhyteStore } from "@/store/use-whyte-store";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProjectClosingPage() {
  const { toast } = useToast();
  const { clientProjects, financialSteward, setFinancialSteward, updateClientProject } = useWhyteStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isEditingSteward, setIsEditingSteward] = useState(false);
  const [newStewardName, setNewStewardName] = useState(financialSteward);
  const [isSyncing, setIsSyncing] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setNewStewardName(financialSteward);
  }, [financialSteward]);

  if (!isMounted) return null;

  // RECONCILIATION: STRICTLY only activated, non-archived projects in Completion phase
  const relevantProjects = clientProjects.filter(p => 
    !p.isArchived && p.isActivated && p.status === 'Completion'
  );

  const handleUpdateSteward = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setFinancialSteward(newStewardName);
      setIsSyncing(false);
      setIsEditingSteward(false);
      toast({ title: "Financial Protocol Updated" });
    }, 1200);
  };

  const handleVerifyReport = (projectId: string) => {
    updateClientProject(projectId, { 
      financialReportStatus: 'Verified',
      lastActivity: "Financial Audit Verified by Studio Steward"
    });
    toast({ title: "Report Synchronized" });
  };

  const handleArchiveProject = (projectId: string) => {
    setArchivingId(projectId);
    setTimeout(() => {
      updateClientProject(projectId, { isArchived: true, lastActivity: "Commission Transferred to Studio Archives" });
      toast({ title: "Commission Archived" });
      setArchivingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Reconciliation & <span className="not-italic">Closing.</span></h1>
        </div>
        <div className="p-6 border border-accent/10 bg-white shadow-xl flex items-center gap-8">
          <div className="h-12 w-12 bg-accent/5 flex items-center justify-center text-accent">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40">Financial Steward</p>
            <p className="text-[13px] font-bold uppercase tracking-widest text-accent">{financialSteward || "Internal Reconciliation"}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsEditingSteward(true)} className="h-10 w-10 text-accent/40">
            <Settings2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-6">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[13px] font-bold uppercase tracking-widest text-accent mb-1">Lifecycle Enforcement Protocol</AlertTitle>
        <AlertDescription className="text-[13px] font-light italic text-muted-foreground leading-relaxed">
          Reconciliation protocols are exclusively available for commissions currently in the **Completion** phase. Verified audits are immutable and serve as the final financial record prior to dossier archival.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            {relevantProjects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="rounded-none border-accent/5 shadow-xl bg-white group overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className={cn("h-full w-2 self-stretch", project.financialReportStatus === 'Verified' ? 'bg-green-600' : 'bg-accent opacity-20')} />
                    <CardContent className="p-10 flex-1 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                          <span className="text-[12px] font-bold text-accent/40 uppercase tracking-widest">{project.id}</span>
                          <Badge variant="outline" className="rounded-none text-[11px] font-bold uppercase tracking-widest px-3 py-1 border-accent/20 text-accent">
                            {project.status}
                          </Badge>
                          {project.financialReportStatus === 'Verified' && (
                            <div className="flex items-center gap-2 text-green-600">
                              <Lock className="h-3.5 w-3.5" />
                              <span className="text-[11px] font-bold uppercase tracking-widest">Dossier Locked</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-3xl font-headline italic">{project.project}</h3>
                        <div className="flex items-center gap-6 pt-4 border-t border-accent/5">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-accent/30" />
                            <span className={cn("text-[12px] font-bold uppercase tracking-widest", project.financialReportStatus === 'Verified' ? 'text-green-600' : 'text-orange-500 animate-pulse')}>
                              Audit: {project.financialReportStatus || 'Pending Sync'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Star className="h-4 w-4 text-accent/20" />
                            <span className="text-[12px] uppercase tracking-widest font-bold">Client: {project.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {project.financialReportStatus === 'Verified' ? (
                          <>
                            <Button asChild variant="outline" className="h-14 px-8 rounded-none border-accent/10 hover:bg-accent/5 flex gap-3 uppercase tracking-widest text-[11px] font-bold transition-all shadow-sm">
                              <Link href={`/transparency/${project.id}`} target="_blank">
                                <Eye className="h-4.5 w-4.5" /> View Audited Breakdown
                              </Link>
                            </Button>
                            <Button 
                              onClick={() => handleArchiveProject(project.id)} 
                              disabled={archivingId === project.id} 
                              variant="outline" 
                              className="h-14 w-14 rounded-full hover:bg-black hover:text-white transition-all p-0 shadow-sm border-black/10 group/archive"
                              title="Archive Dossier"
                            >
                              {archivingId === project.id ? <Loader2 className="h-6 w-6 animate-spin" /> : <Archive className="h-6 w-6 group-hover/archive:scale-110 transition-transform" />}
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => handleVerifyReport(project.id)} 
                            className="h-14 px-8 rounded-none bg-accent text-white flex gap-3 uppercase tracking-widest text-[11px] font-bold transition-all shadow-xl hover:tracking-[0.2em]"
                          >
                            <FileCheck className="h-5 w-5" /> Authorize Audit
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
            {relevantProjects.length === 0 && (
              <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 space-y-4">
                <div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
                  <Landmark className="h-8 w-8 text-accent/20" />
                </div>
                <p className="text-[13px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">
                  No commissions currently prioritized for final reconciliation
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-accent/10 bg-accent p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="h-32 w-32" />
            </div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-white/40 mb-12 relative z-10">Stewardship Checklist</h3>
            <ul className="space-y-12 relative z-10">
              <li className="flex gap-6">
                <div className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-white/60" />
                </div>
                <div className="space-y-2">
                  <p className="text-[13px] font-bold uppercase tracking-widest">Site Protocol Audit</p>
                  <p className="text-[11px] text-white/40 italic uppercase tracking-widest">100% Implementation Velocity</p>
                </div>
              </li>
              <li className="flex gap-6">
                <div className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center shrink-0">
                  <Landmark className="h-5 w-5 text-white/60" />
                </div>
                <div className="space-y-2">
                  <p className="text-[13px] font-bold uppercase tracking-widest">Ledger Reconciliation</p>
                  <p className="text-[11px] text-white/40 italic uppercase tracking-widest">All Installments Verified</p>
                </div>
              </li>
              <li className="flex gap-6">
                <div className="h-10 w-10 border border-white/20 rounded-full flex items-center justify-center shrink-0">
                  <FileCheck className="h-5 w-5 text-white/60" />
                </div>
                <div className="space-y-2">
                  <p className="text-[13px] font-bold uppercase tracking-widest">Client Handover</p>
                  <p className="text-[11px] text-white/40 italic uppercase tracking-widest">Digital Keys Synchronized</p>
                </div>
              </li>
            </ul>
          </Card>

          <div className="p-10 border border-dashed border-accent/20 bg-secondary/5 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-accent/40 italic leading-relaxed">
              Final reconciliation locks the dossier and transitions the commission to the Historical Archives.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isEditingSteward} onOpenChange={setIsEditingSteward}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-accent" />
                <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Configuration Protocol</span>
              </div>
              <DialogTitle className="text-3xl font-headline italic">Update Steward</DialogTitle>
              <DialogDescription className="text-[13px] italic font-light leading-relaxed">
                Assign the financial entity responsible for professional audit verification and capital distribution reports.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest opacity-40">Steward Entity Identity</label>
              <Input 
                value={newStewardName} 
                onChange={(e) => setNewStewardName(e.target.value)} 
                className="rounded-none h-14 text-lg border-accent/20 focus:ring-accent" 
                placeholder="E.g., Imani Financial Services"
              />
            </div>
            <DialogFooter>
              <Button 
                className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-xl transition-all" 
                onClick={handleUpdateSteward} 
                disabled={isSyncing || !newStewardName}
              >
                {isSyncing ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Synchronizing...</span> : "Authorize Protocol Update"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
