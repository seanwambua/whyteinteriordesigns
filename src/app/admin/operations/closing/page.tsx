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
  Star
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
    updateClientProject(projectId, { financialReportStatus: 'Verified' });
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
          <div className="flex items-center gap-4"><div className="h-px w-8 bg-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span></div>
          <h1 className="text-5xl font-headline italic">Reconciliation & <span className="not-italic">Closing.</span></h1>
        </div>
        <div className="p-6 border border-accent/10 bg-white shadow-xl flex items-center gap-8">
          <div className="h-12 w-12 bg-accent/5 flex items-center justify-center text-accent"><Building2 className="h-6 w-6" /></div>
          <div className="space-y-1"><p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Financial Steward</p><p className="text-sm font-bold uppercase tracking-widest text-accent">{financialSteward || "Internal Reconciliation"}</p></div>
          <Button variant="ghost" size="icon" onClick={() => setIsEditingSteward(true)} className="h-10 w-10 text-accent/40"><Settings2 className="h-5 w-5" /></Button>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02]">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[13px] font-bold uppercase tracking-widest text-accent">Lifecycle Enforcement</AlertTitle>
        <AlertDescription className="text-sm font-light italic text-muted-foreground">Reconciliation protocols are available for projects in the **Completion** phase.</AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            {relevantProjects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="rounded-none border-accent/5 shadow-xl bg-white group overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="h-full w-2 bg-accent opacity-20 group-hover:opacity-100 self-stretch" />
                    <CardContent className="p-10 flex-1 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4"><span className="text-[11px] font-bold text-accent/40 uppercase tracking-widest">{project.id}</span><Badge variant="outline" className="rounded-none text-[12px] font-bold uppercase tracking-widest">{project.status}</Badge></div>
                        <h3 className="text-3xl font-headline italic">{project.project}</h3>
                        <div className="flex items-center gap-6 pt-4 border-t border-accent/5">
                          <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-accent/30" /><span className={cn("text-[12px] font-bold uppercase tracking-widest", project.financialReportStatus === 'Verified' ? 'text-green-600' : 'text-orange-500 animate-pulse')}>Audit: {project.financialReportStatus || 'Pending'}</span></div>
                          <div className="flex items-center gap-2 text-muted-foreground"><Star className="h-4 w-4 text-accent/20" /><span className="text-[11px] uppercase tracking-widest font-bold">Client: {project.name}</span></div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={() => handleVerifyReport(project.id)} disabled={project.financialReportStatus === 'Verified'} variant="outline" className={cn("h-14 w-14 rounded-full transition-all p-0", project.financialReportStatus === 'Verified' ? 'bg-green-600 text-white' : 'hover:bg-accent hover:text-white')}><FileCheck className="h-6 w-6" /></Button>
                        {project.financialReportStatus === 'Verified' && <Button onClick={() => handleArchiveProject(project.id)} disabled={archivingId === project.id} variant="outline" className="h-14 w-14 rounded-full hover:bg-black hover:text-white transition-all p-0">{archivingId === project.id ? <Loader2 className="h-6 w-6 animate-spin" /> : <Archive className="h-6 w-6" />}</Button>}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
            {relevantProjects.length === 0 && <div className="text-center py-24 border border-dashed border-accent/10 bg-secondary/5 italic text-muted-foreground uppercase tracking-[0.3em]">No completed commissions prioritized for reconciliation</div>}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-accent/10 bg-accent p-12 text-white relative overflow-hidden">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-white/40 mb-10">Governance Checklist</h3>
            <ul className="space-y-10">
              <li className="flex gap-6"><ShieldCheck className="h-7 w-7 text-white/60" /><div className="space-y-2"><p className="text-base font-bold uppercase tracking-widest">Client Authenticated</p></div></li>
              <li className="flex gap-6"><Landmark className="h-7 w-7 text-white/60" /><div className="space-y-2"><p className="text-base font-bold uppercase tracking-widest">Commission Complete</p></div></li>
            </ul>
          </Card>
        </div>
      </div>

      <Dialog open={isEditingSteward} onOpenChange={setIsEditingSteward}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Configuration</span></div>
            <DialogTitle className="text-3xl font-headline italic">Update Steward</DialogTitle>
          </DialogHeader>
          <div className="py-6"><Input value={newStewardName} onChange={(e) => setNewStewardName(e.target.value)} className="rounded-none h-12 text-lg" /></div>
          <DialogFooter><Button className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-xl" onClick={handleUpdateSteward} disabled={isSyncing}>{isSyncing ? "Syncing..." : "Authorize Update"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
