
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
  Trash2,
  XCircle,
  FileText,
  ChevronRight,
  Users,
  Settings2,
  Flag,
  Zap,
  Calculator,
  Briefcase,
  Mail,
  Info,
  PencilRuler,
  Building2,
  Clock,
  ShieldAlert,
  RefreshCcw,
  LayoutList,
  Compass
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useWhyteStore, ClientProject, ProjectTask, Milestone, VendorAllocation } from "@/store/use-whyte-store";
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
import { format, parse, isValid } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProjectPlanningPage() {
  const { clientProjects, updateClientProject, removeClientProject, collaborators, stewards } = useWhyteStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const [activationProject, setActivationProject] = useState<ClientProject | null>(null);
  const [depositCode, setDepositCode] = useState("");
  const [assignedStewardId, setAssignedStewardId] = useState("");
  const [activationAmount, setActivationAmount] = useState<number>(0);
  const [activationDate, setActivationDate] = useState<Date>(new Date());
  const [isActivating, setIsActivating] = useState(false);

  const [editProject, setEditProject] = useState<ClientProject | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    project: "",
    tier: "Premium" as ClientProject['tier'],
    totalBudget: 0,
    description: "",
    workScope: "",
    roomsCount: 0,
    assignedStewardId: "",
    startDate: new Date(),
    endDate: new Date(),
    milestones: [] as Milestone[],
    tasks: [] as ProjectTask[],
    vendorAllocations: [] as VendorAllocation[]
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activationProject) {
      setAssignedStewardId(activationProject.assignedStewardId || "");
      const deposit = activationProject.installments.find(i => i.label.toLowerCase().includes('deposit'));
      
      // If client already submitted data, pre-fill for admin review before transmission
      if (activationProject.pendingActivationData) {
        setActivationAmount(activationProject.pendingActivationData.amount);
        setDepositCode(activationProject.pendingActivationData.reference);
      } else {
        setActivationAmount(deposit?.amount || 0);
        setDepositCode("");
      }
      setActivationDate(new Date());
    }
  }, [activationProject]);

  if (!isMounted) return null;

  const pendingPlanning = clientProjects.filter(p => p.status === 'Planning' && !p.isArchived);

  const handleTransmitToSteward = () => {
    if (!activationProject || !depositCode || !assignedStewardId) return;
    setIsActivating(true);
    
    setTimeout(() => {
      updateClientProject(activationProject.id, {
        pendingActivationData: {
          amount: activationAmount,
          reference: depositCode,
          timestamp: new Date().toISOString()
        },
        assignedStewardId: assignedStewardId,
        lastActivity: `Deposit Receipt Logged by Admin — Awaiting Steward Forensic Verification`
      });
      setIsActivating(false);
      setActivationProject(null);
      setDepositCode("");
      setAssignedStewardId("");
      toast({ 
        title: "Transmission Authorized", 
        description: "Initial deposit data sent to Financial Steward for forensic verification." 
      });
    }, 1500);
  };

  const handleOpenEdit = (project: ClientProject) => {
    setEditProject(project);
    let startD = new Date();
    let endD = new Date();
    try {
      const parsedStart = parse(project.startDate, "MMM dd, yyyy", new Date());
      if (isValid(parsedStart)) startD = parsedStart;
      const parsedEnd = parse(project.endDate, "MMM dd, yyyy", new Date());
      if (isValid(parsedEnd)) endD = parsedEnd;
    } catch (e) {}
    setEditFormData({
      name: project.name,
      email: project.email,
      project: project.project,
      tier: project.tier,
      totalBudget: project.totalBudget,
      description: project.description || "",
      workScope: project.workScope || "",
      roomsCount: project.roomsCount || 0,
      assignedStewardId: project.assignedStewardId || "",
      startDate: startD,
      endDate: endD,
      milestones: JSON.parse(JSON.stringify(project.milestones || [])),
      tasks: JSON.parse(JSON.stringify(project.tasks || [])),
      vendorAllocations: JSON.parse(JSON.stringify(project.vendorAllocations || []))
    });
  };

  const updateTask = (idx: number, field: keyof ProjectTask, value: any) => {
    const updated = [...editFormData.tasks];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, tasks: updated }));
  };

  const addTask = () => {
    setEditFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: `T-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "New Site Protocol", priority: "Medium", status: "Todo", subtasks: [] }]
    }));
  };

  const removeTask = (idx: number) => {
    setEditFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== idx)
    }));
  };

  const addMilestone = () => {
    setEditFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { id: `M-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, label: "New Target", date: format(new Date(), "MMM dd, yyyy"), isCompleted: false, description: "" }]
    }));
  };

  const removeMilestone = (idx: number) => {
    setEditFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== idx)
    }));
  };

  const updateMilestone = (idx: number, field: keyof Milestone, value: any) => {
    const updated = [...editFormData.milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, milestones: updated }));
  };

  const addAllocation = () => {
    setEditFormData(prev => ({
      ...prev,
      vendorAllocations: [...(prev.vendorAllocations || []), { id: `VA-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, vendorName: "", role: "", category: "Vendor", costType: "Fixed", costValue: 0, timelineDays: 0, materials: [] }]
    }));
  };

  const removeAllocation = (idx: number) => {
    setEditFormData(prev => ({
      ...prev,
      vendorAllocations: prev.vendorAllocations.filter((_, i) => i !== idx)
    }));
  };

  const updateAllocation = (idx: number, field: keyof VendorAllocation, value: any) => {
    const updated = [...editFormData.vendorAllocations];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditFormData(prev => ({ ...prev, vendorAllocations: updated }));
  };

  const getInstallmentPlan = (tier: ClientProject['tier'], budget: number) => {
    if (tier === 'Premium') return [ 
      { label: "Initial Deposit (50%)", percentage: 50, amount: budget * 0.5, status: 'Pending' as const }, 
      { label: "Mid-way Installment (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const }, 
      { label: "Final Handover (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const } 
    ];
    if (tier === 'Deluxe') return [ 
      { label: "Initial Deposit (60%)", percentage: 60, amount: budget * 0.6, status: 'Pending' as const }, 
      { label: "Mid-way Installment (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const }, 
      { label: "Final Handover (20%)", percentage: 20, amount: budget * 0.2, status: 'Pending' as const } 
    ];
    return [ 
      { label: "Initial Deposit (70%)", percentage: 70, amount: budget * 0.7, status: 'Pending' as const }, 
      { label: "Final Handover (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const } 
    ];
  };

  const handleSaveEdit = () => {
    if (!editProject) return;
    const budget = Number(editFormData.totalBudget) || 0;
    const installments = getInstallmentPlan(editFormData.tier, budget);

    updateClientProject(editProject.id, {
      ...editFormData,
      startDate: format(editFormData.startDate, "MMM dd, yyyy"),
      endDate: format(editFormData.endDate, "MMM dd, yyyy"),
      totalBudget: budget,
      installments,
      lastActivity: "Dossier Synchronized via Master Edit"
    });
    setEditProject(null);
    toast({ title: "Dossier Synchronized", description: "All architectural and financial protocols updated." });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4"><div className="h-px w-8 bg-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span></div>
          <h1 className="text-5xl font-headline italic">Commission <span className="not-italic">Initialization.</span></h1>
        </div>
        <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold shadow-xl hover:tracking-[0.25em] transition-all"><Link href="/admin/clients/add"><Plus className="h-5 w-5" /> Initialize Briefing</Link></Button>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-6">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[12px] font-bold uppercase tracking-widest text-accent mb-1">Activation Protocol Mandate</AlertTitle>
        <AlertDescription className="text-base font-light italic text-muted-foreground leading-relaxed">
          Initial deposits must be transmitted to the assigned Financial Steward for forensic verification. A dossier transitions to **Execution** only after Steward certification.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-8">
        {pendingPlanning.map((project, index) => {
          const assignedSteward = stewards.find(s => s.id === project.assignedStewardId);
          const isAwaitingSteward = !!project.pendingActivationData;

          return (
            <motion.div key={project.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className={cn(
                "rounded-none border-accent/5 shadow-2xl bg-white overflow-hidden group min-h-[300px] border-l-4",
                isAwaitingSteward ? 'border-l-blue-500' : project.initializedBy === 'Designer' ? 'border-l-accent' : 'border-l-orange-500/40'
              )}>
                <div className="flex flex-col md:flex-row items-stretch h-full">
                  <div className="p-10 border-b md:border-b-0 md:border-r border-accent/5 flex flex-col justify-between min-w-[300px] bg-secondary/5">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-accent/40 uppercase tracking-[0.4em] block">{project.id}</span>
                        <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[10px] font-bold py-1.5 px-4">{project.tier} Commission</Badge>
                        <div className="space-y-2 mt-4">
                          {project.initializedBy === 'Designer' && (
                            <div className="flex items-center gap-2 text-accent text-[9px] font-bold uppercase tracking-widest">
                              <PencilRuler className="h-3 w-3" /> Designer-Led
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-accent/60 text-[9px] font-bold uppercase tracking-widest">
                            <Building2 className="h-3 w-3" /> {assignedSteward ? assignedSteward.name : "Steward Unassigned"}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 pt-4 border-t border-accent/5">
                        <p className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.3em]">Temporal Frame</p>
                        <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
                          <CalendarIcon className="h-3.5 w-3.5 opacity-40" /> {project.startDate} — {project.endDate}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 pt-10">
                      <p className="text-[10px] font-bold text-orange-600/60 uppercase tracking-[0.3em]">Lifecycle State</p>
                      {isAwaitingSteward ? (
                        <div className="flex items-center gap-3 text-[12px] font-bold text-blue-600 uppercase tracking-widest animate-pulse"><RefreshCcw className="h-4 w-4" /> Awaiting Steward Forensic Sync</div>
                      ) : (
                        <div className="flex items-center gap-3 text-[12px] font-bold text-orange-600 uppercase tracking-widest"><Banknote className="h-4 w-4" /> Awaiting Deposit Sync</div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-10 md:p-12 flex flex-col justify-between">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
                      <div className="space-y-6 flex-1">
                        <div className="space-y-1">
                          <h3 className="text-4xl font-headline italic leading-tight text-accent">{project.project}</h3>
                          <p className="text-[12px] uppercase tracking-widest font-bold text-muted-foreground opacity-60">Valued Client: {project.name}</p>
                        </div>
                        <p className="text-base font-light italic text-accent/60 leading-relaxed border-l-2 border-accent/10 pl-8 max-w-2xl line-clamp-2">"{project.description || project.workScope || "Architectural narrative pending synchronization."}"</p>
                      </div>
                      <div className="text-right min-w-[200px]">
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-2">Required Activation</span>
                        <span className="text-3xl font-headline italic text-orange-600">KES {(project.installments.find(i => i.label.toLowerCase().includes('deposit'))?.amount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-accent/5 mt-12">
                      <div className="flex gap-6">
                        <Button variant="ghost" onClick={() => handleOpenEdit(project)} className="rounded-none h-12 px-6 text-[11px] uppercase tracking-widest font-bold text-accent/60 hover:text-accent hover:bg-accent/5 transition-all"><Settings2 className="h-4 w-4 mr-2" /> Master Edit</Button>
                        <Button variant="ghost" onClick={() => setDeleteId(project.id)} className="rounded-none h-12 px-6 text-[11px] uppercase tracking-widest font-bold text-destructive/40 hover:text-destructive hover:bg-destructive/5 transition-all"><Trash2 className="h-4 w-4 mr-2" /> Purge Brief</Button>
                      </div>
                      <Button onClick={() => setActivationProject(project)} className="h-16 px-12 rounded-none bg-orange-600 text-white uppercase tracking-widest text-[11px] font-bold hover:bg-orange-700 transition-all flex gap-3 shadow-2xl hover:tracking-[0.2em]">
                        {isAwaitingSteward ? <><RefreshCcw className="h-5 w-5" /> Update Receipt Details</> : <><ShieldCheck className="h-5 w-5" /> Confirm Receipt for Steward</>}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {pendingPlanning.length === 0 && (
          <div className="text-center py-40 border border-dashed border-accent/10 bg-secondary/5 italic text-muted-foreground uppercase tracking-[0.3em] font-light">
            No pending briefings prioritized in current cycle
          </div>
        )}
      </div>

      <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white">
          <div className="bg-accent h-1.5 w-full" />
          <DialogHeader className="p-12 pb-8 space-y-4">
            <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Architectural Dossier Synchronization</span></div>
            <DialogTitle className="text-4xl font-headline italic">Edit Briefing: {editProject?.id}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="identity" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 mb-8 px-12">
              <TabsTrigger value="identity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><User className="h-4 w-4" /> Identity</TabsTrigger>
              <TabsTrigger value="briefing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><LayoutList className="h-4 w-4" /> Scope</TabsTrigger>
              <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Calculator className="h-4 w-4" /> Framework</TabsTrigger>
              <TabsTrigger value="milestones" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Flag className="h-4 w-4" /> Milestones</TabsTrigger>
              <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Zap className="h-4 w-4" /> Protocols</TabsTrigger>
              <TabsTrigger value="network" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[12px] font-bold pb-5 px-0 flex gap-2"><Users className="h-4 w-4" /> Network</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto px-12 pb-12 custom-scrollbar">
              <TabsContent value="identity" className="m-0 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Client Identity</Label><Input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="rounded-none h-14 text-lg border-accent/20 focus:ring-accent" /></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Communication Protocol (Email)</Label><Input type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="rounded-none h-14 text-lg border-accent/20 focus:ring-accent" /></div>
                </div>
                <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Designation</Label><Input value={editFormData.project} onChange={(e) => setEditFormData({...editFormData, project: e.target.value})} className="rounded-none h-14 text-2xl font-headline italic border-accent/20 focus:ring-accent" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-accent/5">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commencement Protocol</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-[12px] border-accent/20 uppercase tracking-widest font-bold"><CalendarIcon className="mr-3 h-5 w-5 opacity-40" />{format(editFormData.startDate, "MMM dd, yyyy")}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={editFormData.startDate} onSelect={(d) => d && setEditFormData({...editFormData, startDate: d})} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Projected Delivery Target</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-[12px] border-accent/20 uppercase tracking-widest font-bold"><CalendarIcon className="mr-3 h-5 w-5 opacity-40" />{format(editFormData.endDate, "MMM dd, yyyy")}</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={editFormData.endDate} onSelect={(d) => d && setEditFormData({...editFormData, endDate: d})} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="briefing" className="m-0 space-y-12">
                <div className="space-y-8">
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Architectural Narrative</Label><Textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} placeholder="Creative briefing summary..." className="min-h-[180px] rounded-none p-8 font-light italic text-xl border-accent/20 leading-relaxed focus:ring-accent" /></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Technical Scope of Works</Label><Textarea value={editFormData.workScope} onChange={(e) => setEditFormData({...editFormData, workScope: e.target.value})} placeholder="Structural and implementation requirements..." className="min-h-[180px] rounded-none p-8 font-light italic text-base border-accent/20 leading-relaxed focus:ring-accent bg-secondary/5" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-accent/5">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-2"><Compass className="h-3.5 w-3.5" /> Primary Rooms Count</Label>
                      <Input type="number" value={editFormData.roomsCount} onChange={(e) => setEditFormData({...editFormData, roomsCount: Number(e.target.value)})} className="rounded-none h-14 text-2xl font-headline italic border-accent/20 focus:ring-accent" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="m-0 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                    <Select value={editFormData.tier} onValueChange={(v: any) => setEditFormData({...editFormData, tier: v})}>
                      <SelectTrigger className="rounded-none h-14 border-accent/20 uppercase tracking-widest text-[12px] font-bold focus:ring-accent"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="Premium">Premium (50/30/20 Plan)</SelectItem>
                        <SelectItem value="Deluxe">Deluxe (60/20/20 Plan)</SelectItem>
                        <SelectItem value="Golden">Golden (70/30 Priority Plan)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Capital Commitment (KES)</Label><Input type="number" value={editFormData.totalBudget} onChange={(e) => setEditFormData({...editFormData, totalBudget: Number(e.target.value)})} className="rounded-none h-14 text-3xl font-headline italic border-accent/20 focus:ring-accent" /></div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Assigned Financial Steward</Label>
                  <Select value={editFormData.assignedStewardId} onValueChange={(v) => setEditFormData({...editFormData, assignedStewardId: v})}>
                    <SelectTrigger className="rounded-none border-accent/20 h-14 text-[12px] font-bold uppercase tracking-widest focus:ring-accent"><SelectValue placeholder="Select Steward" /></SelectTrigger>
                    <SelectContent className="rounded-none">{stewards.map(s => <SelectItem key={s.id} value={s.id} className="uppercase text-[11px] font-bold py-3">{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="m-0 space-y-10">
                <div className="flex justify-between items-center pb-6 border-b border-accent/5"><h4 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent/60">Strategic Milestones</h4><Button variant="outline" size="sm" onClick={addMilestone} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white"><Plus className="h-3.5 w-3.5 mr-2" /> Append Target</Button></div>
                <div className="space-y-6">
                  {editFormData.milestones.map((m, idx) => (
                    <div key={m.id} className="p-8 border border-accent/5 bg-secondary/5 space-y-6 relative group hover:bg-white hover:shadow-xl transition-all">
                      <Button variant="ghost" size="icon" onClick={() => removeMilestone(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Target Label</Label><Input value={m.label} onChange={(e) => updateMilestone(idx, 'label', e.target.value)} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-accent/10 focus:ring-accent" /></div>
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Sync Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full h-12 rounded-none justify-start text-[11px] border-accent/10 font-bold uppercase tracking-widest"><CalendarIcon className="mr-3 h-4 w-4 opacity-40" />{m.date}</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={parse(m.date, "MMM dd, yyyy", new Date())} onSelect={(d) => d && updateMilestone(idx, 'date', format(d, "MMM dd, yyyy"))} initialFocus /></PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="workflow" className="m-0 space-y-10">
                <div className="flex justify-between items-center pb-6 border-b border-accent/5"><h4 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent/60">Site Protocols</h4><Button variant="outline" size="sm" onClick={addTask} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white"><Plus className="h-4 w-4 mr-2" /> Initialize Protocol</Button></div>
                <div className="space-y-8">
                  {editFormData.tasks.map((task, idx) => (
                    <div key={task.id} className="p-10 border border-accent/5 bg-white shadow-xl space-y-10 relative">
                      <Button variant="ghost" size="icon" onClick={() => removeTask(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-3"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Protocol Identity</Label><Input value={task.title} onChange={(e) => updateTask(idx, 'title', e.target.value)} className="rounded-none h-14 text-xl font-bold uppercase tracking-widest border-accent/10 focus:ring-accent" /></div>
                        <div className="lg:col-span-4 space-y-3">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Urgency</Label>
                          <Select value={task.priority} onValueChange={(v: any) => updateTask(idx, 'priority', v)}>
                            <SelectTrigger className="rounded-none h-14 text-[11px] font-bold uppercase focus:ring-accent"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none"><SelectItem value="Low">Low Priority</SelectItem><SelectItem value="Medium">Medium Priority</SelectItem><SelectItem value="High">High Urgency</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="network" className="m-0 space-y-10">
                <div className="flex justify-between items-center pb-6 border-b border-accent/5"><h4 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent/60">Partner Matrix</h4><Button variant="outline" size="sm" onClick={addAllocation} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white"><Plus className="h-4 w-4 mr-2" /> Link Resource</Button></div>
                <div className="space-y-6">
                  {(editFormData.vendorAllocations || []).map((alloc, idx) => (
                    <div key={alloc.id} className="p-8 border border-accent/5 bg-secondary/5 space-y-8 relative group hover:bg-white hover:shadow-xl transition-all">
                      <Button variant="ghost" size="icon" onClick={() => removeAllocation(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Registry Resource</Label>
                          <Select value={alloc.vendorName} onValueChange={(v) => updateAllocation(idx, 'vendorName', v)}>
                            <SelectTrigger className="rounded-none h-12 text-[12px] font-bold uppercase border-accent/10 focus:ring-accent"><SelectValue placeholder="SELECT FROM REGISTRY" /></SelectTrigger>
                            <SelectContent className="rounded-none">{collaborators.map(c => <SelectItem key={c.id} value={c.name} className="uppercase text-[10px] font-bold tracking-widest">{c.name} ({c.specialty})</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Professional Role</Label><Input value={alloc.role} onChange={(e) => updateAllocation(idx, 'role', e.target.value)} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-accent/10 focus:ring-accent" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-6 border-t border-accent/5">
                        <div className="space-y-2">
                          <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Cost Model</Label>
                          <Select value={alloc.costType} onValueChange={(v: any) => updateAllocation(idx, 'costType', v)}>
                            <SelectTrigger className="rounded-none h-12 text-[11px] font-bold uppercase border-accent/10 focus:ring-accent"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-none"><SelectItem value="Fixed">Fixed Contract</SelectItem><SelectItem value="Daily">Daily Rate</SelectItem><SelectItem value="Percentage">Percentage Split</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Allocation Value</Label><Input type="number" value={alloc.costValue} onChange={(e) => updateAllocation(idx, 'costValue', Number(e.target.value))} className="rounded-none h-12 text-sm font-bold border-accent/10" /></div>
                        <div className="space-y-2"><Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Engagement Days</Label><Input type="number" value={alloc.timelineDays} onChange={(e) => updateAllocation(idx, 'timelineDays', Number(e.target.value))} className="rounded-none h-12 text-sm font-bold border-accent/10" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
          <DialogFooter className="p-12 border-t border-accent/5 bg-secondary/5 flex justify-between">
            <Button variant="ghost" onClick={() => setEditProject(null)} className="rounded-none h-14 px-8 uppercase tracking-widest text-[12px] font-bold text-accent/40">Abort Protocol Sync</Button>
            <Button onClick={handleSaveEdit} className="bg-accent text-white rounded-none h-16 px-16 uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all flex gap-4 hover:tracking-[0.2em]">Authorize Synchronization <ChevronRight className="h-5 w-5" /></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body p-12 bg-white">
          <AlertDialogHeader className="space-y-6"><div className="flex items-center gap-3"><XCircle className="h-6 w-6 text-destructive" /><span className="text-destructive text-[13px] font-bold uppercase tracking-[0.3em]">Critical Protocol Interruption</span></div><AlertDialogTitle className="text-3xl font-headline italic text-destructive">Confirm Dossier Purge?</AlertDialogTitle><AlertDialogDescription className="text-muted-foreground font-light leading-relaxed text-lg italic">This will permanently remove project briefing **{deleteId}** and all associated architectural and financial data from the studio registry.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="pt-12"><AlertDialogCancel className="rounded-none uppercase tracking-widest text-[12px] font-bold h-10 px-10 border-accent/10">Abort Cancellation</AlertDialogCancel><AlertDialogAction onClick={() => { if(deleteId) { removeClientProject(deleteId); setDeleteId(null); toast({title: "Briefing Purged"}); } }} className="bg-destructive text-white rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-12 hover:bg-destructive/90 shadow-xl">Authorize Purge</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={activationProject !== null} onOpenChange={(open) => !open && setActivationProject(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-xl p-0 overflow-hidden bg-white">
          <div className="bg-orange-600 h-1.5 w-full" />
          <div className="p-12 space-y-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-orange-600" /><span className="text-orange-600 text-[12px] font-bold uppercase tracking-[0.4em]">Administrative Verification</span></div>
              <DialogTitle className="text-3xl font-headline italic">Confirm Receipt</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base leading-relaxed">
                Log the transaction reference for <strong>{activationProject?.project}</strong>. This data will be transmitted to the assigned Steward for forensic certification.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-10">
              <div className="p-8 bg-orange-500/5 border border-orange-500/10 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5"><Banknote className="h-16 w-16" /></div>
                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-orange-600/60">Expected Deposit Value</span>
                  <span className="text-3xl font-headline italic text-orange-600">KES {activationProject ? (activationProject.installments.find(i => i.label.toLowerCase().includes('deposit'))?.amount || 0).toLocaleString() : 0}</span>
                </div>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Verified Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-none justify-start text-[13px] border-accent/20 font-bold uppercase tracking-widest focus:ring-orange-600">
                          <CalendarIcon className="mr-3 h-5 w-5 opacity-40" />
                          {format(activationDate, "MMM dd, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-none">
                        <Calendar mode="single" selected={activationDate} onSelect={(d) => d && setActivationDate(d)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Verified Amount (KES)</Label>
                    <Input 
                      type="number" 
                      className="rounded-none border-accent/20 h-14 text-xl font-headline italic focus:ring-orange-600" 
                      value={activationAmount} 
                      onChange={(e) => setActivationAmount(Number(e.target.value))} 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Transaction Reference</Label>
                  <Input placeholder="E.g., TRX-9921-WHYTE" className="rounded-none border-accent/20 h-14 text-xl tracking-[0.2em] font-medium focus:ring-orange-600" value={depositCode} onChange={(e) => setDepositCode(e.target.value)} />
                </div>
                <div className="space-y-3">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Assigned Steward</Label>
                  <Select value={assignedStewardId} onValueChange={assignedStewardId}>
                    <SelectTrigger className="rounded-none border-accent/20 h-14 text-sm font-bold uppercase tracking-widest focus:ring-orange-600">
                      <SelectValue placeholder="SELECT STEWARD" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {stewards.map(s => <SelectItem key={s.id} value={s.id} className="uppercase tracking-widest text-[11px] font-bold py-3">{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-6">
              <Button 
                className="w-full bg-orange-600 text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em]" 
                onClick={handleTransmitToSteward} 
                disabled={isActivating || !depositCode || !assignedStewardId}
              >
                {isActivating ? <span className="flex items-center gap-2 font-bold"><Loader2 className="h-5 w-5 animate-spin" /> Transmitting...</span> : "Authorize Transmission to Steward"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
