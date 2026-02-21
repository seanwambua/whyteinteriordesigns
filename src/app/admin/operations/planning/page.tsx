"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Plus, 
  Calendar, 
  User, 
  ArrowRight, 
  Banknote, 
  ShieldCheck, 
  Loader2, 
  Edit2, 
  Trash2,
  XCircle,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ProjectPlanningPage() {
  const { clientProjects, updateClientProject, removeClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  
  // Activation State
  const [activationProject, setActivationProject] = useState<ClientProject | null>(null);
  const [depositCode, setDepositCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  // Edit State
  const [editProject, setEditProject] = useState<ClientProject | null>(null);
  const [editFormData, setEditFormData] = useState({
    project: "",
    tier: "Premium" as ClientProject['tier'],
    totalBudget: 0,
    description: ""
  });

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const pendingPlanning = clientProjects.filter(p => p.status === 'Planning' && !p.isArchived);

  const getDepositRequired = (project: ClientProject) => {
    const deposit = project.installments.find(ins => ins.label.includes('Deposit'));
    return deposit ? deposit.amount.toLocaleString() : "N/A";
  };

  const handleActivateJourney = () => {
    if (!activationProject || !depositCode) return;
    
    setIsActivating(true);
    setTimeout(() => {
      const updatedInstallments = activationProject.installments.map(ins => 
        ins.label.includes('Deposit') ? { ...ins, status: 'Paid' as const } : ins
      );

      updateClientProject(activationProject.id, {
        isActivated: true,
        initialDepositPaid: true,
        depositCode: depositCode,
        status: 'Execution',
        lastActivity: "Journey Activated - Deposit Verified",
        installments: updatedInstallments
      });
      
      toast({
        title: "Journey Activated",
        description: `Financial synchronization complete for ${activationProject.id}. Project transitioned to Execution.`,
      });
      
      setIsActivating(false);
      setActivationProject(null);
      setDepositCode("");
    }, 1500);
  };

  const handleOpenEdit = (project: ClientProject) => {
    setEditProject(project);
    setEditFormData({
      project: project.project,
      tier: project.tier,
      totalBudget: project.totalBudget,
      description: project.description || ""
    });
  };

  const handleSaveEdit = () => {
    if (!editProject) return;
    
    // Recalculate installments if tier or budget changed
    const budget = Number(editFormData.totalBudget);
    const getInstallmentPlan = (tier: ClientProject['tier'], budget: number) => {
      if (tier === 'Premium') return [
        { label: "Initial Deposit (50%)", percentage: 50, amount: budget * 0.5, status: 'Pending' as const },
        { label: "Mid-way Installment (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const },
        { label: "Final Handover (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const },
      ];
      if (tier === 'Deluxe') return [
        { label: "Initial Deposit (60%)", percentage: 60, amount: budget * 0.6, status: 'Pending' as const },
        { label: "Mid-way Installment (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const },
        { label: "Final Handover (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const },
      ];
      return [
        { label: "Initial Deposit (70%)", percentage: 70, amount: budget * 0.7, status: 'Pending' as const },
        { label: "Final Handover (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const },
      ];
    };

    updateClientProject(editProject.id, {
      project: editFormData.project,
      tier: editFormData.tier,
      totalBudget: budget,
      description: editFormData.description,
      installments: getInstallmentPlan(editFormData.tier, budget),
      lastActivity: "Project Brief Updated"
    });

    toast({
      title: "Brief Updated",
      description: `Project ${editProject.id} brief has been synchronized.`,
    });
    setEditProject(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    removeClientProject(deleteId);
    toast({
      title: "Brief Cancelled",
      description: "Project brief has been removed from the studio archives.",
      variant: "destructive"
    });
    setDeleteId(null);
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
                  <div className="space-y-4">
                    <div className="space-y-1">
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
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenEdit(project)}
                        className="rounded-none h-8 text-[9px] uppercase tracking-widest font-bold border-accent/10 hover:bg-accent hover:text-white"
                      >
                        <Edit2 className="h-3 w-3 mr-1.5" /> Edit Brief
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDeleteId(project.id)}
                        className="rounded-none h-8 text-[9px] uppercase tracking-widest font-bold text-destructive/40 hover:text-destructive hover:bg-destructive/5"
                      >
                        <Trash2 className="h-3 w-3 mr-1.5" /> Cancel Brief
                      </Button>
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
                        className="h-12 px-6 rounded-none bg-orange-600 text-white uppercase tracking-widest text-[9px] font-bold hover:bg-orange-700 transition-all flex gap-2 shadow-lg"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" /> Activate Journey
                      </Button>
                    ) : (
                      <Button asChild variant="ghost" className="h-12 w-12 rounded-full border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all">
                        <Link href={`/admin/clients/${project.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
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
                <span className="text-accent/40">Initial Deposit Required</span>
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

      {/* Edit Brief Dialog */}
      <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Protocol Update</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">Edit Briefing: {editProject?.id}</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Modify the architectural and financial frameworks for this commission.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Title</Label>
              <Input 
                value={editFormData.project}
                onChange={(e) => setEditFormData({...editFormData, project: e.target.value})}
                placeholder="Project Name"
                className="rounded-none border-accent/20 h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                <Select value={editFormData.tier} onValueChange={(v: any) => setEditFormData({...editFormData, tier: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Premium">Premium (50/30/20)</SelectItem>
                    <SelectItem value="Deluxe">Deluxe (60/20/20)</SelectItem>
                    <SelectItem value="Golden">Golden (70/30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Budget (KES)</Label>
                <Input 
                  type="number"
                  value={editFormData.totalBudget}
                  onChange={(e) => setEditFormData({...editFormData, totalBudget: Number(e.target.value)})}
                  className="rounded-none border-accent/20 h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Architectural Brief</Label>
              <Textarea 
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                placeholder="Scope of work..."
                className="rounded-none border-accent/20 min-h-[120px] resize-none p-4 font-light italic"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[10px] font-bold"
              onClick={handleSaveEdit}
            >
              Authorize Synchronization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive text-[10px] font-bold uppercase tracking-[0.3em]">Irreversible Protocol</span>
            </div>
            <AlertDialogTitle className="text-2xl font-headline italic text-destructive">Cancel Project Briefing?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed">
              This will permanently purge project brief **{deleteId}** from the studio registry. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[10px] font-bold h-12 border-accent/10">Abort Cancellation</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12 hover:bg-destructive/90"
            >
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}