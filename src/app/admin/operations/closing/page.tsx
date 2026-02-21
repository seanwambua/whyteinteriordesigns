"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  FileCheck, 
  Landmark, 
  ShieldCheck, 
  Star, 
  Settings2, 
  Wallet, 
  ExternalLink,
  ShieldAlert,
  Building2,
  Trash2,
  Info,
  Archive,
  Loader2
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
      toast({
        title: "Financial Protocol Updated",
        description: `Stewardship partner synchronized to: ${newStewardName || 'Internal Reconciliation'}.`,
      });
    }, 1200);
  };

  const handleRemoveSteward = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setFinancialSteward("");
      setNewStewardName("");
      setIsSyncing(false);
      setIsEditingSteward(false);
      toast({
        title: "Stewardship Dissolved",
        description: "Reconciliation transitioned to Internal Studio Audit.",
      });
    }, 1000);
  };

  const handleVerifyReport = (projectId: string) => {
    updateClientProject(projectId, { financialReportStatus: 'Verified' });
    toast({
      title: "Report Synchronized",
      description: `Financial audit for ${projectId} has been cross-referenced with ${financialSteward || 'Internal Systems'}.`,
    });
  };

  const handleArchiveProject = (projectId: string) => {
    setArchivingId(projectId);
    setTimeout(() => {
      updateClientProject(projectId, { 
        isArchived: true,
        lastActivity: "Commission Transferred to Studio Archives — Project Deactivated"
      });
      toast({
        title: "Commission Archived",
        description: `Project ${projectId} has been moved to the permanent architectural archives.`,
      });
      setArchivingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Reconciliation & <span className="not-italic">Closing.</span></h1>
        </div>
        
        <div className="p-6 border border-accent/10 bg-white shadow-xl flex items-center gap-8 group hover:border-accent/30 transition-all">
          <div className="h-12 w-12 bg-accent/5 flex items-center justify-center text-accent">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Financial Steward</p>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              {financialSteward || "Internal Reconciliation"}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 hover:bg-accent/10 text-accent/40 hover:text-accent ml-4"
            onClick={() => setIsEditingSteward(true)}
          >
            <Settings2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] py-6">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[13px] font-bold uppercase tracking-widest text-accent">Lifecycle Enforcement</AlertTitle>
        <AlertDescription className="text-sm font-light italic text-muted-foreground">
          Reconciliation protocols are exclusively available for projects in the **Completion** phase. Verified projects are retired from implementation and moved to the **Master Archives**.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.4em] text-accent/40 mb-4">Final Pipeline Reconciliation</h2>
          
          <div className="space-y-6">
            {relevantProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-none border-accent/5 shadow-xl bg-white group hover:shadow-2xl transition-all overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="h-full w-2 bg-accent opacity-20 group-hover:opacity-100 transition-opacity self-stretch" />
                    <CardContent className="p-10 flex-1 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-bold text-accent/40 uppercase tracking-widest">{project.id}</span>
                          <Badge variant="outline" className="rounded-none border-accent/20 text-accent uppercase tracking-[0.2em] text-[10px] font-bold px-3">
                            {project.status}
                          </Badge>
                          <Badge className="bg-green-600/10 text-green-600 border-green-600/20 rounded-none text-[10px] uppercase tracking-widest px-2 font-bold">
                            Complete
                          </Badge>
                        </div>
                        <h3 className="text-3xl font-headline italic">{project.project}</h3>
                        <div className="flex flex-wrap gap-8 items-center border-t border-accent/5 pt-4">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-accent/30" />
                            <span className={cn("text-[12px] font-bold uppercase tracking-widest", 
                              project.financialReportStatus === 'Verified' ? 'text-green-600' : 'text-orange-500 animate-pulse'
                            )}>
                              Audit: {project.financialReportStatus || 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Star className="h-4 w-4 text-accent/20" />
                            <span className="text-[11px] uppercase tracking-widest font-bold">Client: {project.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 min-w-[250px] justify-end">
                        <div className="text-right">
                          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Handover Score</span>
                          <span className="text-2xl font-headline italic">98%</span>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => handleVerifyReport(project.id)}
                            disabled={project.financialReportStatus === 'Verified'}
                            variant="outline" 
                            className={cn("h-14 w-14 rounded-full border border-accent/10 transition-all p-0",
                              project.financialReportStatus === 'Verified' ? 'bg-green-600 text-white border-green-600' : 'hover:bg-accent hover:text-white'
                            )}
                          >
                            <FileCheck className="h-6 w-6" />
                          </Button>

                          {project.financialReportStatus === 'Verified' && (
                            <Button 
                              onClick={() => handleArchiveProject(project.id)}
                              disabled={archivingId === project.id}
                              variant="outline"
                              className="h-14 w-14 rounded-full border border-accent/10 hover:bg-black hover:text-white transition-all p-0"
                            >
                              {archivingId === project.id ? <Loader2 className="h-6 w-6 animate-spin" /> : <Archive className="h-6 w-6" />}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
            {relevantProjects.length === 0 && (
              <div className="text-center py-24 border border-dashed border-accent/10 bg-secondary/5">
                <p className="text-base font-light italic text-muted-foreground uppercase tracking-[0.3em]">No completed commissions currently prioritized for reconciliation</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-accent/10 shadow-2xl bg-accent p-12 text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Landmark className="h-40 w-40" />
            </div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-white/40 mb-10 relative z-10">Governance Checklist</h3>
            <ul className="space-y-10 relative z-10">
              <li className="flex gap-6">
                <ShieldCheck className="h-7 w-7 text-white/60 shrink-0" />
                <div className="space-y-2">
                  <p className="text-base font-bold uppercase tracking-widest">Client Authenticated</p>
                  <p className="text-[12px] text-white/40 font-light italic leading-relaxed">Project is verified against active client registration.</p>
                </div>
              </li>
              <li className="flex gap-6">
                <Landmark className="h-7 w-7 text-white/60 shrink-0" />
                <div className="space-y-2">
                  <p className="text-base font-bold uppercase tracking-widest">Commission Complete</p>
                  <p className="text-[12px] text-white/40 font-light italic leading-relaxed">Only projects in the Completion phase can enter final audit.</p>
                </div>
              </li>
              <li className="flex gap-6">
                <CheckCircle2 className="h-7 w-7 text-white/60 shrink-0" />
                <div className="space-y-2">
                  <p className="text-base font-bold uppercase tracking-widest">Financial Clearance</p>
                  <p className="text-[12px] text-white/40 font-light italic leading-relaxed">Final balance reconciliation with {financialSteward || "Internal Studio"}.</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <Dialog open={isEditingSteward} onOpenChange={setIsEditingSteward}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-accent" />
              <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Configuration</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">Update Steward</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground text-base">
              Define the 3rd party financial partner responsible for project audits.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <p className="text-[12px] uppercase tracking-widest font-bold opacity-60">Partner Identity</p>
              <Input 
                value={newStewardName}
                onChange={(e) => setNewStewardName(e.target.value)}
                placeholder="E.g., Imani Financial Services"
                className="rounded-none border-accent/20 h-12 focus:ring-accent text-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-accent/5">
              <Button 
                variant="outline" 
                className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[11px] font-bold"
                onClick={() => setNewStewardName("Imani Financial Services (IFS-KE)")}
              >
                Reset Default
              </Button>
              <Button 
                variant="outline" 
                className="rounded-none border-destructive/10 text-destructive hover:bg-destructive hover:text-white h-12 uppercase tracking-widest text-[11px] font-bold flex gap-2"
                onClick={handleRemoveSteward}
                disabled={isSyncing}
              >
                <Trash2 className="h-4 w-4" /> Remove Partner
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-xl"
              onClick={handleUpdateSteward}
              disabled={isSyncing}
            >
              {isSyncing ? "Synchronizing Protocols..." : "Authorize Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}