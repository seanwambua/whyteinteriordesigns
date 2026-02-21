
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, Calendar, User, ArrowRight, Banknote, ShieldCheck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ProjectPlanningPage() {
  const { clientProjects, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  
  const [activationProject, setActivationProject] = useState<ClientProject | null>(null);
  const [depositCode, setDepositCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Show all projects that are in Planning phase
  const pendingPlanning = clientProjects.filter(p => p.status === 'Planning');

  const getDepositRequired = (project: ClientProject) => {
    const percentages = { Premium: 0.5, Deluxe: 0.6, Golden: 0.7 };
    return (project.totalBudget * percentages[project.tier]).toLocaleString();
  };

  const handleActivateJourney = () => {
    if (!activationProject || !depositCode) return;
    
    setIsActivating(true);
    setTimeout(() => {
      updateClientProject(activationProject.id, {
        isActivated: true,
        initialDepositPaid: true,
        depositCode: depositCode,
        status: 'Procurement', // Move to next logical phase after deposit
        lastActivity: "Journey Activated - Deposit Verified"
      });
      
      toast({
        title: "Journey Activated",
        description: `Financial synchronization complete for ${activationProject.id}. Project transitioned to Procurement.`,
      });
      
      setIsActivating(false);
      setActivationProject(null);
      setDepositCode("");
    }, 1500);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Project <span className="not-italic">Briefings.</span></h1>
        </div>
        <Button asChild className="bg-accent text-white rounded-none h-12 px-8 uppercase tracking-widest text-[10px] flex gap-2">
          <Link href="/admin/clients/add"><Plus className="h-4 w-4" /> Initialize Briefing</Link>
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {pendingPlanning.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`rounded-none border-accent/10 shadow-lg hover:border-accent/30 transition-all bg-white overflow-hidden group ${!project.isActivated ? 'border-l-4 border-l-orange-400' : ''}`}>
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="p-8 border-b md:border-b-0 md:border-r border-accent/5 flex flex-col justify-center min-w-[200px] bg-secondary/5">
                  <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.4em] mb-2">{project.id}</span>
                  <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[8px] w-fit">
                    {project.tier} Tier
                  </Badge>
                  {!project.isActivated && (
                    <div className="mt-4 flex items-center gap-2 text-[8px] font-bold text-orange-600 uppercase tracking-widest">
                      <Banknote className="h-3 w-3" /> Awaiting Deposit
                    </div>
                  )}
                </div>
                <div className="flex-1 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline italic">{project.project}</h3>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="text-[10px] uppercase tracking-widest">Client: {project.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[10px] uppercase tracking-widest">Added: {project.startDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    {!project.isActivated ? (
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Required Deposit</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">KES {getDepositRequired(project)}</span>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Milestone</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">{project.status}</span>
                      </div>
                    )}
                    
                    {!project.isActivated ? (
                      <Button 
                        onClick={() => setActivationProject(project)}
                        className="h-12 px-6 rounded-none bg-orange-600 text-white uppercase tracking-widest text-[9px] font-bold hover:bg-orange-700 transition-all flex gap-2"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" /> Activate Journey
                      </Button>
                    ) : (
                      <Button variant="ghost" className="h-12 w-12 rounded-full border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {pendingPlanning.length === 0 && (
          <div className="text-center py-24 border border-dashed border-accent/10 bg-secondary/5">
            <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No project briefings currently in the planning phase</p>
          </div>
        )}
      </div>

      <Card className="rounded-none border-dashed border-accent/20 bg-accent/5 p-12 text-center">
        <h4 className="text-xl font-headline italic mb-4">Planning Archives</h4>
        <p className="text-xs text-accent/60 uppercase tracking-widest font-light">
          {clientProjects.filter(p => p.isActivated).length} journeys activated via deposit verification this cycle.
        </p>
      </Card>

      {/* Activation Dialog */}
      <Dialog open={!!activationProject} onOpenChange={(open) => !open && setActivationProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600 text-[10px] font-bold uppercase tracking-[0.4em]">Financial Protocol Required</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">Activate {activationProject?.id}</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Confirm the initial deposit to move this commission into the active implementation deck.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 space-y-8">
            <div className="p-6 bg-secondary/30 border border-accent/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                <span className="text-accent/40">Commission Tier</span>
                <span className="text-accent">{activationProject?.tier}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                <span className="text-accent/40">Deposit Required ({activationProject?.tier === 'Premium' ? '50%' : activationProject?.tier === 'Deluxe' ? '60%' : '70%'})</span>
                <span className="text-orange-600">KES {activationProject ? getDepositRequired(activationProject) : 0}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Verification Deposit Code</Label>
              <Input 
                value={depositCode}
                onChange={(e) => setDepositCode(e.target.value)}
                placeholder="E.g., DEP-XXXX-2024"
                className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent uppercase tracking-widest"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[10px] font-bold"
              onClick={handleActivateJourney}
              disabled={isActivating || !depositCode}
            >
              {isActivating ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Verifying Protocols...</span>
              ) : "Authorize Journey Activation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
