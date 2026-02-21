"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Plus, 
  Calendar as CalendarIcon, 
  User, 
  ArrowRight, 
  Banknote, 
  ShieldCheck, 
  Loader2, 
  Edit2, 
  Trash2,
  XCircle,
  FileText,
  Flag,
  Activity,
  ChevronRight,
  Info,
  Users,
  HardHat,
  Settings2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useWhyteStore, ClientProject, ProjectTask, Milestone, SubTask, VendorAllocation } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function ProjectPlanningPage() {
  const { clientProjects, updateClientProject, removeClientProject, collaborators } = useWhyteStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // Activation State
  const [activationProject, setActivationProject] = useState<ClientProject | null>(null);
  const [depositCode, setDepositCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  // Edit State
  const [editProject, setEditProject] = useState<ClientProject | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    project: "",
    tier: "Premium" as ClientProject['tier'],
    totalBudget: 0,
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    milestones: [] as Milestone[],
    tasks: [] as ProjectTask[],
    vendorAllocations: [] as VendorAllocation[]
  });

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const pendingPlanning = clientProjects.filter(p => p.status === 'Planning' && !p.isArchived);

  const getDepositRequired = (project: ClientProject) => {
    const deposit = project.installments.find(ins => ins.label.toLowerCase().includes('deposit'));
    return deposit ? deposit.amount.toLocaleString() : "N/A";
  };

  const handleActivateJourney = () => {
    if (!activationProject || !depositCode) return;
    
    setIsActivating(true);
    setTimeout(() => {
      const updatedInstallments = activationProject.installments.map(ins => 
        ins.label.toLowerCase().includes('deposit') ? { ...ins, status: 'Paid' as const, transactionCode: depositCode } : ins
      );

      updateClientProject(activationProject.id, {
        isActivated: true,
        initialDepositPaid: true,
        depositCode: depositCode,
        status: 'Execution',
        lastActivity: "Journey Activated — Initial Transaction Verified",
        installments: updatedInstallments
      });
      
      toast({
        title: "Journey Activated",
        description: `Financial synchronization complete for ${activationProject.id}. Transitioning to Implementation.`,
      });
      
      setIsActivating(false);
      setActivationProject(null);
      setDepositCode("");
      
      router.push("/admin/operations/implementation");
    }, 1500);
  };

  const handleOpenEdit = (project: ClientProject) => {
    setEditProject(project);
    
    // Safety parse for dates
    let startD = new Date();
    let endD = new Date();
    try {
      startD = parse(project.startDate, "MMM dd, yyyy", new Date());
      endD = parse(project.endDate, "MMM dd, yyyy", new Date());
    } catch (e) {}

    setEditFormData({
      name: project.name,
      email: project.email,
      project: project.project,
      tier: project.tier,
      totalBudget: project.totalBudget,
      description: project.description || project.workScope || "",
      startDate: startD,
      endDate: endD,
      milestones: project.milestones ? [...project.milestones] : [],
      tasks: project.tasks ? project.tasks.map(t => ({ ...t, subtasks: t.subtasks ? [...t.subtasks] : [] })) : [],
      vendorAllocations: project.vendorAllocations ? [...project.vendorAllocations] : []
    });
  };

  const addMilestone = () => {
    setEditFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { id: `M-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, label: "", date: format(new Date(), "MMM dd, yyyy"), isCompleted: false, description: "" }]
    }));
  };

  const updateMilestone = (idx: number, field: keyof Milestone, value: any) => {
    const updated = [...editFormData.milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, milestones: updated }));
  };

  const removeMilestone = (idx: number) => {
    setEditFormData(prev => ({ ...prev, milestones: prev.milestones.filter((_, i) => i !== idx) }));
  };

  const addTask = () => {
    setEditFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: `T-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "New Site Protocol", priority: "Medium", status: "Todo", subtasks: [] }]
    }));
  };

  const updateTask = (idx: number, field: keyof ProjectTask, value: any) => {
    const updated = [...editFormData.tasks];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, tasks: updated }));
  };

  const removeTask = (idx: number) => {
    setEditFormData(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== idx) }));
  };

  const addSubtask = (taskIdx: number) => {
    const updated = [...editFormData.tasks];
    const subtasks = updated[taskIdx].subtasks || [];
    updated[taskIdx].subtasks = [...subtasks, { id: `S-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "Sub-protocol step", isCompleted: false }];
    setEditFormData(prev => ({ ...prev, tasks: updated }));
  };

  const updateSubtask = (taskIdx: number, subIdx: number, title: string) => {
    const updated = [...editFormData.tasks];
    if (updated[taskIdx].subtasks && updated[taskIdx].subtasks![subIdx]) {
      updated[taskIdx].subtasks![subIdx].title = title;
      setEditFormData(prev => ({ ...prev, tasks: updated }));
    }
  };

  const removeSubtask = (taskIdx: number, subIdx: number) => {
    const updated = [...editFormData.tasks];
    if (updated[taskIdx].subtasks) {
      updated[taskIdx].subtasks = updated[taskIdx].subtasks!.filter((_, i) => i !== subIdx);
      setEditFormData(prev => ({ ...prev, tasks: updated }));
    }
  };

  const addVendor = () => {
    setEditFormData(prev => ({
      ...prev,
      vendorAllocations: [...prev.vendorAllocations, { id: `VA-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, vendorName: "", role: "", category: "Vendor", costType: "Fixed", costValue: 0, timelineDays: 0, materials: [] }]
    }));
  };

  const updateVendor = (idx: number, field: keyof VendorAllocation, value: any) => {
    const updated = [...editFormData.vendorAllocations];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, vendorAllocations: updated }));
  };

  const removeVendor = (idx: number) => {
    setEditFormData(prev => ({ ...prev, vendorAllocations: prev.vendorAllocations.filter((_, i) => i !== idx) }));
  };

  const handleSaveEdit = () => {
    if (!editProject) return;
    
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
        { label: "Initial Deposit (70%)", percentage: 70, amount: budget * 0.7, status: 'Paid' as const },
        { label: "Final Handover (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const },
      ];
    };

    updateClientProject(editProject.id, {
      name: editFormData.name,
      email: editFormData.email,
      project: editFormData.project,
      tier: editFormData.tier,
      totalBudget: budget,
      description: editFormData.description,
      startDate: format(editFormData.startDate, "MMM dd, yyyy"),
      endDate: format(editFormData.endDate, "MMM dd, yyyy"),
      milestones: editFormData.milestones,
      tasks: editFormData.tasks,
      vendorAllocations: editFormData.vendorAllocations,
      installments: getInstallmentPlan(editFormData.tier, budget),
      lastActivity: "Comprehensive Briefing Synchronization Complete"
    });

    toast({
      title: "Protocol Synchronized",
      description: `Architectural dossier ${editProject.id} has been fully re-calibrated.`,
    });
    setEditProject(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    removeClientProject(deleteId);
    toast({
      title: "Briefing Cancelled",
      description: "Project briefing dossier has been removed from the studio registry.",
      variant: "destructive"
    });
    setDeleteId(null);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Project <span className="not-italic">Briefings.</span></h1>
        </div>
        <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold flex gap-3 shadow-xl hover:tracking-[0.25em] transition-all">
          <Link href="/admin/clients/add"><Plus className="h-5 w-5" /> Initialize Briefing</Link>
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {pendingPlanning.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={cn(
              "rounded-none border-accent/10 shadow-lg hover:border-accent/30 transition-all bg-white overflow-hidden group",
              !project.isActivated && 'border-l-4 border-l-orange-400'
            )}>
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="p-10 border-b md:border-b-0 md:border-r border-accent/5 flex flex-col justify-center min-w-[240px] bg-secondary/5">
                  <span className="text-[12px] font-bold text-accent/40 uppercase tracking-[0.4em] mb-3">{project.id}</span>
                  <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[11px] w-fit font-bold py-1.5 px-4 mb-6">
                    {project.tier} Tier
                  </Badge>
                  {!project.isActivated && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-orange-600/60 uppercase tracking-widest">Protocol Status</p>
                      <div className="flex items-center gap-2 text-[12px] font-bold text-orange-600 uppercase tracking-widest">
                        <Banknote className="h-4 w-4" /> Awaiting Deposit
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-4xl font-headline italic leading-tight">{project.project}</h3>
                      <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                          <User className="h-4 w-4 text-accent/30" />
                          <span className="text-[13px] font-bold uppercase tracking-widest">Client: {project.name}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                          <CalendarIcon className="h-4 w-4 text-accent/30" />
                          <span className="text-[13px] font-bold uppercase tracking-widest">Target: {project.endDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenEdit(project)}
                        className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/10 hover:bg-accent hover:text-white transition-all"
                      >
                        <Settings2 className="h-4 w-4 mr-2" /> Comprehensive Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDeleteId(project.id)}
                        className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold text-destructive/40 hover:text-destructive hover:bg-destructive/5 transition-all"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Cancel Brief
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12 justify-between lg:justify-end border-t lg:border-t-0 pt-8 lg:pt-0">
                    {!project.isActivated ? (
                      <div className="text-right">
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1.5">Required Activation</span>
                        <span className="text-lg font-headline italic text-orange-600">KES {getDepositRequired(project)}</span>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1.5">Lifecycle Phase</span>
                        <span className="text-lg font-headline italic text-accent">{project.status}</span>
                      </div>
                    )}
                    
                    {!project.isActivated ? (
                      <Button 
                        onClick={() => setActivationProject(project)}
                        className="h-14 px-8 rounded-none bg-orange-600 text-white uppercase tracking-widest text-[11px] font-bold hover:bg-orange-700 transition-all flex gap-3 shadow-xl hover:tracking-[0.2em]"
                      >
                        <ShieldCheck className="h-5 w-5" /> Activate Journey
                      </Button>
                    ) : (
                      <Button asChild variant="ghost" className="h-14 w-14 rounded-full border border-accent/5 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                        <Link href={`/admin/clients/${project.id}`}>
                          <ArrowRight className="h-6 w-6" />
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
          <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 space-y-6">
            <div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
              <ClipboardList className="h-8 w-8 text-accent/20" />
            </div>
            <p className="text-base font-light italic text-muted-foreground uppercase tracking-[0.3em]">
              No project briefings currently in the planning phase
            </p>
          </div>
        )}
      </div>

      {/* Activation Dialog */}
      <Dialog open={!!activationProject} onOpenChange={(open) => !open && setActivationProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden">
          <div className="bg-orange-600 h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-orange-600" />
                <span className="text-orange-600 text-[12px] font-bold uppercase tracking-[0.4em]">Financial Protocol Required</span>
              </div>
              <DialogTitle className="text-3xl font-headline italic">Activate {activationProject?.id}</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base leading-relaxed">
                Confirm receipt of the initial deposit to move this commission into the active implementation deck.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              <div className="p-8 bg-secondary/30 border border-accent/5 space-y-4">
                <div className="flex justify-between items-center text-[12px] uppercase tracking-widest font-bold">
                  <span className="text-accent/40">Commission Tier</span>
                  <span className="text-accent">{activationProject?.tier}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] uppercase tracking-widest font-bold pt-4 border-t border-accent/5">
                  <span className="text-accent/40">Authorized Deposit</span>
                  <span className="text-2xl font-headline italic text-orange-600">KES {activationProject ? getDepositRequired(activationProject) : 0}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Transaction Reference Code</Label>
                <Input 
                  value={depositCode}
                  onChange={(e) => setDepositCode(e.target.value)}
                  placeholder="TRX-XXXX-WHYTE"
                  className="rounded-none border-accent/20 h-14 text-xl tracking-[0.2em] font-medium focus:ring-accent uppercase"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all"
                onClick={handleActivateJourney}
                disabled={isActivating || !depositCode}
              >
                {isActivating ? (
                  <span className="flex items-center gap-2 font-bold"><Loader2 className="h-5 w-5 animate-spin" /> Verifying...</span>
                ) : "Authorize Journey Activation"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* COMPREHENSIVE EDIT DIALOG */}
      <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)]">
          <div className="bg-accent h-1.5 w-full" />
          <DialogHeader className="p-10 pb-6 space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-accent" />
              <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Architectural Dossier Synchronization</span>
            </div>
            <div className="flex justify-between items-end">
              <DialogTitle className="text-4xl font-headline italic">Edit Briefing: {editProject?.id}</DialogTitle>
              <Badge variant="outline" className="rounded-none text-[11px] uppercase tracking-widest font-bold border-accent/20 text-accent/60">Registry Locked — Internal Use Only</Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="identity" className="flex-1 overflow-hidden flex flex-col px-10">
            <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-10 mb-8 overflow-x-auto custom-scrollbar">
              <TabsTrigger value="identity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-4 px-0">Identity & Brief</TabsTrigger>
              <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-4 px-0">Timeline & Financials</TabsTrigger>
              <TabsTrigger value="milestones" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-4 px-0">Strategic Milestones</TabsTrigger>
              <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-4 px-0">Site Protocols</TabsTrigger>
              <TabsTrigger value="network" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-4 px-0 flex gap-2"><Users className="h-4 w-4" /> Partner Matrix</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
              <TabsContent value="identity" className="m-0 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Client Authorized Identity</Label>
                    <Input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="rounded-none h-14 text-lg border-accent/20 focus:ring-accent" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Professional Contact Email</Label>
                    <Input type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="rounded-none h-14 text-lg border-accent/20 focus:ring-accent" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Designation</Label>
                  <Input value={editFormData.project} onChange={(e) => setEditFormData({...editFormData, project: e.target.value})} className="rounded-none h-14 text-2xl font-headline italic border-accent/20 focus:ring-accent" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Architectural Narrative & Scope</Label>
                  <Textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} className="min-h-[200px] rounded-none p-6 font-light italic text-lg border-accent/20 focus:ring-accent leading-relaxed" placeholder="Detailed architectural objectives..." />
                </div>
              </TabsContent>

              <TabsContent value="financials" className="m-0 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commission Framework</Label>
                    <Select value={editFormData.tier} onValueChange={(v: any) => setEditFormData({...editFormData, tier: v})}>
                      <SelectTrigger className="rounded-none h-14 text-base font-bold uppercase tracking-widest border-accent/20"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="Premium">Premium (50/30/20 Plan)</SelectItem>
                        <SelectItem value="Deluxe">Deluxe (60/20/20 Plan)</SelectItem>
                        <SelectItem value="Golden">Golden (70/30 Priority Plan)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Authorized Capital Commitment (KES)</Label>
                    <Input type="number" value={editFormData.totalBudget} onChange={(e) => setEditFormData({...editFormData, totalBudget: Number(e.target.value)})} className="rounded-none h-14 text-2xl font-headline italic border-accent/20 focus:ring-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commencement Protocol Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-base border-accent/20 uppercase tracking-widest font-bold"><CalendarIcon className="mr-3 h-5 w-5 opacity-40" />{format(editFormData.startDate, "MMM dd, yyyy")}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={editFormData.startDate} onSelect={(d) => d && setEditFormData({...editFormData, startDate: d})} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Projected Delivery Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-base border-accent/20 uppercase tracking-widest font-bold"><CalendarIcon className="mr-3 h-5 w-5 opacity-40" />{format(editFormData.endDate, "MMM dd, yyyy")}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={editFormData.endDate} onSelect={(d) => d && setEditFormData({...editFormData, endDate: d})} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="m-0 space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold uppercase tracking-widest text-accent">Strategic Delivery Targets</h4>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest italic">Temporal synchronization points</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addMilestone} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white transition-all"><Plus className="h-4 w-4 mr-2" /> Append Target</Button>
                </div>
                <div className="space-y-6">
                  {editFormData.milestones.map((m, idx) => (
                    <div key={m.id} className="p-8 border border-accent/5 bg-secondary/5 space-y-6 relative group transition-all hover:border-accent/20 hover:bg-white shadow-sm hover:shadow-xl">
                      <Button variant="ghost" size="icon" onClick={() => removeMilestone(idx)} className="absolute top-4 right-4 h-10 w-10 text-destructive/20 hover:text-destructive hover:bg-destructive/5 transition-all"><Trash2 className="h-5 w-5" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Milestone Identity</Label>
                          <Input value={m.label} onChange={(e) => updateMilestone(idx, 'label', e.target.value)} className="rounded-none h-12 text-base font-bold uppercase tracking-[0.1em] border-accent/10 focus:ring-accent" placeholder="E.g., Structural Handover" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Authorized Sync Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full h-12 rounded-none justify-start text-sm border-accent/10 font-bold uppercase tracking-widest">
                                <CalendarIcon className="mr-3 h-4 w-4 opacity-40" />
                                {m.date}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-none">
                              <Calendar 
                                mode="single" 
                                selected={parse(m.date, "MMM dd, yyyy", new Date())} 
                                onSelect={(d) => d && updateMilestone(idx, 'date', format(d, "MMM dd, yyyy"))} 
                                initialFocus 
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  ))}
                  {editFormData.milestones.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-accent/10 bg-secondary/5 rounded-none">
                      <p className="text-[12px] font-light italic text-muted-foreground uppercase tracking-widest">No strategic targets defined for this briefing.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="workflow" className="m-0 space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold uppercase tracking-widest text-accent">Operational Site Protocols</h4>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest italic">Core execution workflow recaps</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addTask} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white transition-all"><Plus className="h-4 w-4 mr-2" /> Initialize Protocol</Button>
                </div>
                <div className="space-y-10">
                  {editFormData.tasks.map((task, idx) => (
                    <div key={task.id} className="p-10 border border-accent/5 bg-white shadow-lg space-y-8 relative group transition-all hover:border-accent/20">
                      <Button variant="ghost" size="icon" onClick={() => removeTask(idx)} className="absolute top-6 right-6 h-10 w-10 text-destructive/20 hover:text-destructive transition-all"><Trash2 className="h-5 w-5" /></Button>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Primary Site Protocol</Label>
                          <Input value={task.title} onChange={(e) => updateTask(idx, 'title', e.target.value)} className="rounded-none h-14 text-xl font-bold uppercase tracking-widest border-accent/10 focus:ring-accent" placeholder="E.g., Site Measurement Verification" />
                        </div>
                        <div className="lg:col-span-4 space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Urgency Protocol</Label>
                          <Select value={task.priority} onValueChange={(v: any) => updateTask(idx, 'priority', v)}>
                            <SelectTrigger className="rounded-none h-14 text-[13px] font-bold uppercase tracking-widest border-accent/10"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none">
                              <SelectItem value="Low">Low Priority</SelectItem>
                              <SelectItem value="Medium">Medium Priority</SelectItem>
                              <SelectItem value="High">High Urgency — Site Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-6 pt-8 border-t border-accent/5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Label className="text-[11px] uppercase tracking-[0.3em] font-bold text-accent/40">Sub-protocol steps</Label>
                            <Badge variant="ghost" className="text-[10px] text-accent/30 font-bold p-0">{task.subtasks?.length || 0} Registered</Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => addSubtask(idx)} className="h-8 px-4 text-[11px] uppercase tracking-widest font-bold text-accent hover:bg-accent/5 transition-all"><Plus className="h-3.5 w-3.5 mr-2" /> Append Step</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {task.subtasks?.map((sub, sIdx) => (
                            <div key={sub.id} className="flex gap-4 items-center group/sub bg-secondary/5 p-4 border border-transparent hover:border-accent/10 hover:bg-white transition-all">
                              <div className="h-2 w-2 rounded-full bg-accent/20 group-hover/sub:bg-accent transition-colors" />
                              <Input 
                                placeholder="Describe step..." 
                                value={sub.title} 
                                onChange={(e) => updateSubtask(idx, sIdx, e.target.value)} 
                                className="h-10 rounded-none border-none text-[13px] font-light italic focus:ring-0 p-0 bg-transparent" 
                              />
                              <Button variant="ghost" size="icon" onClick={() => removeSubtask(idx, sIdx)} className="h-8 w-8 text-destructive/10 hover:text-destructive opacity-0 group-hover/sub:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="network" className="m-0 space-y-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold uppercase tracking-widest text-accent">Network Resource Allocation</h4>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest italic">Assigning Business Partners & Site Trades</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addVendor} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white transition-all"><Plus className="h-4 w-4 mr-2" /> Allocate Partner</Button>
                </div>
                <div className="space-y-8">
                  {editFormData.vendorAllocations.map((v, idx) => (
                    <div key={v.id} className="p-10 border border-accent/5 bg-white shadow-xl space-y-8 relative group transition-all hover:border-accent/20">
                      <Button variant="ghost" size="icon" onClick={() => removeVendor(idx)} className="absolute top-6 right-6 h-10 w-10 text-destructive/20 hover:text-destructive transition-all"><Trash2 className="h-5 w-5" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Registry Partner Identity</Label>
                          <Select value={v.vendorName} onValueChange={(val) => updateVendor(idx, 'vendorName', val)}>
                            <SelectTrigger className="rounded-none h-14 text-[13px] font-bold uppercase tracking-widest border-accent/10 focus:ring-accent"><SelectValue placeholder="Select Resource" /></SelectTrigger>
                            <SelectContent className="rounded-none">
                              {collaborators.map(c => <SelectItem key={c.id} value={c.name} className="uppercase tracking-widest text-[11px] font-bold py-3">{c.name} — {c.specialty}</SelectItem>)}
                              <SelectItem value="Manual Entry" className="italic opacity-40">Manual Override required</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Assignment Role in Briefing</Label>
                          <Input placeholder="E.g., Bespoke Joinery Lead" className="rounded-none h-14 text-[13px] uppercase font-bold tracking-widest border-accent/10 focus:ring-accent" value={v.role} onChange={(e) => updateVendor(idx, 'role', e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8 border-t border-accent/5">
                        <div className="space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Cost Protocol</Label>
                          <Select value={v.costType} onValueChange={(val: any) => updateVendor(idx, 'costType', val)}>
                            <SelectTrigger className="rounded-none h-12 text-[11px] font-bold uppercase tracking-widest border-accent/5"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none">
                              <SelectItem value="Fixed">Fixed Management Fee</SelectItem>
                              <SelectItem value="Daily">Daily Site Rate</SelectItem>
                              <SelectItem value="Percentage">Studio Percentage %</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Authorized Value</Label>
                          <Input type="number" className="rounded-none h-12 text-base font-bold border-accent/5" value={v.costValue} onChange={(e) => updateVendor(idx, 'costValue', Number(e.target.value))} />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Estimated Engagement (Days)</Label>
                          <Input type="number" className="rounded-none h-12 text-base font-bold border-accent/5" value={v.timelineDays} onChange={(e) => updateVendor(idx, 'timelineDays', Number(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {editFormData.vendorAllocations.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-accent/10 bg-secondary/5">
                      <div className="h-12 w-12 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HardHat className="h-6 w-6 text-accent/20" />
                      </div>
                      <p className="text-[12px] font-light italic text-muted-foreground uppercase tracking-widest">No network resources allocated to this commission brief.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="p-10 border-t border-accent/5 bg-secondary/5 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setEditProject(null)} className="rounded-none h-14 px-8 uppercase tracking-widest text-[12px] font-bold text-accent/40 hover:text-accent hover:bg-transparent">Abort Protocol Sync</Button>
            <Button onClick={handleSaveEdit} className="bg-accent text-white hover:bg-accent/90 rounded-none h-16 px-12 uppercase tracking-widest text-[12px] font-bold flex gap-4 shadow-2xl transition-all hover:tracking-[0.2em]">
              Authorize Comprehensive Synchronization <ChevronRight className="h-5 w-5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body p-10">
          <AlertDialogHeader className="space-y-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-destructive" />
              <span className="text-destructive text-[13px] font-bold uppercase tracking-[0.3em]">Critical Protocol Interruption</span>
            </div>
            <AlertDialogTitle className="text-3xl font-headline italic text-destructive">Confirm Dossier Purge?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed text-lg italic">
              This will permanently remove project briefing **{deleteId}** and all associated site data from the master registry. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-10">
            <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-10 border-accent/10">Abort Cancellation</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-white rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-12 hover:bg-destructive/90 shadow-xl"
            >
              Confirm Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
