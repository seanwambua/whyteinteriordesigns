"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  Briefcase, 
  Calculator, 
  Plus, 
  Trash2,
  Calendar as CalendarIcon,
  Flag,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  ShieldCheck,
  Loader2,
  FilePlus,
  Info,
  Compass,
  LayoutList,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo } from "react";
import { useWhyteStore, ClientProject, ProjectTask, SubTask, Milestone, VendorAllocation } from "@/store/use-whyte-store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export default function DesignerInitializePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { addClientProject, collaborators, clientProjects } = useWhyteStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    tier: "Premium" as ClientProject['tier'],
    description: "",
    workScope: "",
    roomsCount: "",
    totalBudget: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    milestones: [
      { id: 'M-1', label: "Creative Direction Review", date: new Date(), isCompleted: false, description: "Initial aesthetic targets established." }
    ] as (Omit<Milestone, 'date'> & { date: Date })[],
    tasks: [
      { id: 'T-1', title: "Architectural Concept Development", priority: "High" as const, status: "Todo" as const, subtasks: [] as SubTask[] }
    ] as ProjectTask[],
    vendorAllocations: [] as VendorAllocation[]
  });

  const existingClients = useMemo(() => {
    const clients: Record<string, { name: string, email: string }> = {};
    clientProjects.forEach(p => {
      clients[p.email.toLowerCase()] = { name: p.name, email: p.email };
    });
    return Object.values(clients);
  }, [clientProjects]);

  const filteredClients = useMemo(() => {
    if (!clientSearch) return [];
    return existingClients.filter(c => 
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
    ).slice(0, 5);
  }, [existingClients, clientSearch]);

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const addMilestone = () => setFormData({ 
    ...formData, 
    milestones: [...formData.milestones, { id: `M-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, label: "", date: new Date(), isCompleted: false, description: "" }] 
  });
  
  const updateMilestone = (idx: number, field: string, value: any) => { 
    const updated = [...formData.milestones]; 
    (updated[idx] as any)[field] = value; 
    setFormData({ ...formData, milestones: updated }); 
  };
  
  const removeMilestone = (idx: number) => setFormData({ ...formData, milestones: formData.milestones.filter((_, i) => i !== idx) });

  const addTask = () => setFormData({ 
    ...formData, 
    tasks: [...formData.tasks, { id: `T-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "", priority: "Medium", status: "Todo", subtasks: [] }] 
  });
  
  const removeTask = (idx: number) => setFormData({ ...formData, tasks: formData.tasks.filter((_, i) => i !== idx) });
  
  const updateTask = (idx: number, field: keyof ProjectTask, value: any) => { 
    const updated = [...formData.tasks]; 
    updated[idx] = { ...updated[idx], [field]: value }; 
    setFormData({ ...formData, tasks: updated }); 
  };

  const addAllocation = () => setFormData({
    ...formData,
    vendorAllocations: [...formData.vendorAllocations, { id: `VA-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, vendorName: "", role: "", category: "Vendor", costType: "Fixed", costValue: 0, timelineDays: 0, materials: [] }]
  });

  const updateAllocation = (idx: number, field: keyof VendorAllocation, value: any) => {
    const updated = [...formData.vendorAllocations];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, vendorAllocations: updated });
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

  const executeFinalSubmit = () => {
    setLoading(true);
    const id = `WP-${Math.floor(Math.random() * 9000) + 1000}`;
    const budget = Number(formData.totalBudget) || 0;
    
    const newProject: ClientProject = { 
      id, 
      name: formData.name, 
      email: formData.email, 
      project: formData.project, 
      tier: formData.tier, 
      status: "Planning", 
      progress: 0, 
      startDate: format(formData.startDate, "MMM dd, yyyy"), 
      endDate: format(formData.endDate, "MMM dd, yyyy"), 
      lastActivity: "Architectural Briefing Initiated by Creative Lead", 
      isActivated: false, 
      initialDepositPaid: false, 
      totalBudget: budget, 
      roomsCount: Number(formData.roomsCount) || 0,
      workScope: formData.workScope,
      milestones: formData.milestones.map(m => ({ ...m, date: format(m.date, "MMM dd, yyyy") })), 
      tasks: formData.tasks.map((t, i) => ({ ...t, id: t.id || `T-${id}-${i + 1}`, status: 'Todo' })), 
      installments: getInstallmentPlan(formData.tier, budget), 
      description: formData.description,
      vendorAllocations: formData.vendorAllocations,
      initializedBy: 'Designer'
    };

    setTimeout(() => { 
      addClientProject(newProject); 
      setLoading(false); 
      toast({ title: "Briefing Synchronized", description: `Dossier ${id} transmitted to Admin for authorization.` });
      router.push("/designer"); 
    }, 1500);
  };

  const isStepValid = () => { 
    if (step === 1) return formData.name && formData.email; 
    if (step === 2) return formData.project && formData.description && formData.workScope; 
    if (step === 3) return formData.totalBudget && Number(formData.totalBudget) > 0 && formData.roomsCount; 
    return true; 
  };

  const selectExistingClient = (client: { name: string, email: string }) => {
    setFormData({ ...formData, name: client.name, email: client.email });
    setClientSearch("");
    handleNext();
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-12 font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/designer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent group transition-none">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Back to Workbench</span>
        </Link>
        <div className="space-y-4">
          <div className="flex items-center gap-4"><div className="h-px w-8 bg-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Creative Briefing Protocol</span></div>
          <h1 className="text-5xl font-headline italic">Initialize <span className="not-italic">New Commission.</span></h1>
        </div>
      </motion.div>

      <div className="max-w-md mx-auto mb-12">
        <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] font-bold text-accent/40 mb-3">
          <span>Protocol Stage {step} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-1 bg-accent/5 rounded-none" />
      </div>

      <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
        <CardContent className="p-10 md:p-16">
          <form onSubmit={(e) => { e.preventDefault(); if(step === totalSteps) setIsConfirmOpen(true); else handleNext(); }} className="space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 mb-2"><User className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Client Identity</h3></div>
                    {existingClients.length > 0 && (
                      <div className="relative w-72">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-accent/20" />
                          <Input 
                            placeholder="Pick from Registry..." 
                            className="pl-10 h-10 text-[10px] uppercase tracking-widest rounded-none border-accent/10 focus:ring-accent transition-none"
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                          />
                        </div>
                        {filteredClients.length > 0 && (
                          <div className="absolute top-full left-0 w-full bg-white border border-accent/10 shadow-2xl z-20 mt-1">
                            {filteredClients.map(c => (
                              <button
                                key={c.email}
                                type="button"
                                onClick={() => selectExistingClient(c)}
                                className="w-full text-left p-4 hover:bg-accent hover:text-white flex flex-col gap-1 border-b border-accent/5 last:border-0 transition-none"
                              >
                                <span className="text-[10px] font-bold uppercase tracking-widest">{c.name}</span>
                                <span className="text-[9px] opacity-60 uppercase">{c.email}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Full Name</Label><Input placeholder="E.g., Alara Kibaki" className="rounded-none border-neutral-200 h-14 text-lg focus:ring-accent transition-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Email Address</Label><Input type="email" placeholder="client@domain.com" className="rounded-none border-neutral-200 h-14 text-lg focus:ring-accent transition-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><Briefcase className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Project Scope</h3></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Designation</Label><Input placeholder="E.g., Muthaiga Penthouse Renovation" className="rounded-none border-neutral-200 h-14 text-xl font-headline italic focus:ring-accent transition-none" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} /></div>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Architectural Narrative</Label><Textarea placeholder="Creative briefing summary..." className="min-h-[120px] rounded-none border-neutral-200 text-lg p-6 font-light italic focus:ring-accent bg-neutral-50/30 transition-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-2"><LayoutList className="h-3.5 w-3.5" /> Technical Scope of Works</Label><Textarea placeholder="Structural requirements..." className="min-h-[120px] rounded-none border-neutral-200 text-base p-6 font-light italic focus:ring-accent bg-neutral-50/10 transition-none" value={formData.workScope} onChange={(e) => setFormData({...formData, workScope: e.target.value})} /></div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><Calculator className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Framework & Spatial</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                      <Select onValueChange={(v: any) => setFormData({...formData, tier: v})} defaultValue={formData.tier}>
                        <SelectTrigger className="rounded-none border-neutral-200 h-14 text-[12px] font-bold uppercase focus:ring-accent transition-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="Premium" className="uppercase font-bold py-3">Premium (50/30/20 Plan)</SelectItem>
                          <SelectItem value="Deluxe" className="uppercase font-bold py-3">Deluxe (60/20/20 Plan)</SelectItem>
                          <SelectItem value="Golden" className="uppercase font-bold py-3">Golden (70/30 Priority Plan)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Estimated Commitment (KES)</Label>
                      <Input type="number" placeholder="5,000,000" className="rounded-none border-neutral-200 h-14 text-2xl font-headline italic focus:ring-accent transition-none" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-3 pt-6 border-t border-accent/5">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-2"><Compass className="h-3.5 w-3.5" /> Spatial Capacity (Rooms)</Label>
                    <Input type="number" placeholder="E.g., 6" className="rounded-none border-neutral-200 h-14 text-2xl font-headline italic focus:ring-accent max-w-xs transition-none" value={formData.roomsCount} onChange={(e) => setFormData({...formData, roomsCount: e.target.value})} />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><Clock className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Temporal Configuration</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commencement Protocol</Label>
                      <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="w-full h-14 rounded-none justify-start text-[12px] border-neutral-200 uppercase font-bold transition-none"><CalendarIcon className="mr-3 h-5 w-5 opacity-40" />{format(formData.startDate, "MMM dd, yyyy")}</Button></PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={formData.startDate} onSelect={(d) => d && setFormData({...formData, startDate: d})} initialFocus /></PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Delivery Target</Label>
                      <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="w-full h-14 rounded-none justify-start text-[12px] border-neutral-200 uppercase font-bold transition-none"><CalendarIcon className="mr-3 h-5 w-5 opacity-40" />{format(formData.endDate, "MMM dd, yyyy")}</Button></PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={formData.endDate} onSelect={(d) => d && setFormData({...formData, endDate: d})} initialFocus /></PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-4">
                      <Flag className="h-5 w-5 text-accent/40" />
                      <h3 className="text-2xl font-headline italic">Strategic Milestones</h3>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addMilestone} className="rounded-none h-10 px-6 text-[11px] uppercase font-bold border-neutral-200 hover:bg-accent hover:text-white transition-none">
                      <Plus className="h-4 w-4 mr-2" /> Append Target
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {formData.milestones.map((m, idx) => (
                      <div key={m.id} className="p-8 border border-neutral-100 bg-neutral-50/50 space-y-6 relative group hover:bg-white hover:shadow-xl transition-none">
                        <Button variant="ghost" size="icon" onClick={() => removeMilestone(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive transition-none"><Trash2 className="h-4 w-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase font-bold opacity-40">Target Label</Label>
                            <Input value={m.label} onChange={(e) => updateMilestone(idx, 'label', e.target.value)} className="rounded-none h-12 text-sm font-bold border-neutral-100 focus:ring-accent transition-none" placeholder="E.g., Structural Handover" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase font-bold opacity-40">Sync Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full h-12 rounded-none justify-start text-[11px] border-neutral-100 font-bold transition-none">
                                  <CalendarIcon className="mr-3 h-4 w-4 opacity-40" />
                                  {format(m.date, "MMM dd, yyyy")}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 rounded-none">
                                <Calendar mode="single" selected={m.date} onSelect={(d) => d && updateMilestone(idx, 'date', d)} initialFocus />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-4">
                      <Zap className="h-5 w-5 text-accent/40" />
                      <h3 className="text-2xl font-headline italic">Initial Site Protocols</h3>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addTask} className="rounded-none h-10 px-6 text-[11px] uppercase font-bold border-neutral-200 hover:bg-accent hover:text-white transition-none">
                      <Plus className="h-4 w-4 mr-2" /> Append Protocol
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {formData.tasks.map((task, idx) => (
                      <div key={task.id} className="p-8 border border-neutral-100 bg-neutral-50/50 space-y-6 relative group hover:bg-white hover:shadow-xl transition-none">
                        <Button variant="ghost" size="icon" onClick={() => removeTask(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive transition-none"><Trash2 className="h-4 w-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                          <div className="md:col-span-8 space-y-2">
                            <Label className="text-[11px] uppercase font-bold opacity-40">Protocol Identity</Label>
                            <Input value={task.title} onChange={(e) => updateTask(idx, 'title', e.target.value)} className="rounded-none h-12 text-sm font-bold border-neutral-100 focus:ring-accent transition-none" placeholder="E.g., Initial Site Measurements" />
                          </div>
                          <div className="md:col-span-4 space-y-2">
                            <Label className="text-[11px] uppercase font-bold opacity-40">Urgency</Label>
                            <Select value={task.priority} onValueChange={(v: any) => updateTask(idx, 'priority', v)}>
                              <SelectTrigger className="rounded-none border-neutral-100 h-12 text-[11px] font-bold transition-none">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-none">
                                <SelectItem value="Low" className="uppercase font-bold">Low</SelectItem>
                                <SelectItem value="Medium" className="uppercase font-bold">Medium</SelectItem>
                                <SelectItem value="High" className="uppercase font-bold">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 7 && (
                <motion.div key="s7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-4">
                      <Users className="h-5 w-5 text-accent/40" />
                      <h3 className="text-2xl font-headline italic">Partner Synergy</h3>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addAllocation} className="rounded-none h-10 px-6 text-[11px] uppercase font-bold border-neutral-200 hover:bg-accent hover:text-white transition-none">
                      <Plus className="h-4 w-4 mr-2" /> Link Partner
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {formData.vendorAllocations.map((alloc, idx) => (
                      <div key={alloc.id} className="p-8 border border-neutral-100 bg-neutral-50/50 space-y-8 relative group hover:bg-white hover:shadow-xl transition-none">
                        <Button variant="ghost" size="icon" onClick={() => setFormData({...formData, vendorAllocations: formData.vendorAllocations.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive transition-none"><Trash2 className="h-4 w-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase font-bold opacity-40">Registry Resource</Label>
                            <Select value={alloc.vendorName} onValueChange={(v) => updateAllocation(idx, 'vendorName', v)}>
                              <SelectTrigger className="rounded-none h-12 text-[12px] font-bold border-neutral-100 focus:ring-accent transition-none">
                                <SelectValue placeholder="SELECT FROM REGISTRY" />
                              </SelectTrigger>
                              <SelectContent className="rounded-none">
                                {collaborators.map(c => <SelectItem key={c.id} value={c.name} className="uppercase font-bold">{c.name} ({c.specialty})</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase font-bold opacity-40">Professional Role</Label>
                            <Input value={alloc.role} onChange={(e) => updateAllocation(idx, 'role', e.target.value)} className="rounded-none h-12 text-sm font-bold border-neutral-100 focus:ring-accent transition-none" placeholder="E.g., Structural Consultant" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-12 flex items-center justify-between border-t border-neutral-100">
              {step > 1 ? <Button type="button" variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-accent font-bold uppercase text-[12px] group transition-none"><ArrowLeft className="h-4 w-4 mr-2" /> Previous</Button> : <div />}
              {step < totalSteps ? (
                <Button type="submit" disabled={!isStepValid()} className="bg-accent text-white rounded-none h-16 px-12 uppercase tracking-widest text-[12px] font-bold shadow-2xl flex gap-3 transition-none">Continue Briefing <ChevronRight className="h-5 w-5" /></Button>
              ) : (
                <Button type="button" onClick={() => setIsConfirmOpen(true)} disabled={loading || !isStepValid()} className="bg-accent text-white rounded-none h-16 px-16 uppercase tracking-widest text-[12px] font-bold shadow-2xl flex gap-3 transition-none">Authorize & Transmit <CheckCircle2 className="h-5 w-5" /></Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-none border-accent/20 font-body p-10 bg-white">
          <AlertDialogHeader className="space-y-6"><div className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-accent" /><span className="text-accent text-[13px] font-bold uppercase tracking-[0.3em]">Designer Protocol</span></div><AlertDialogTitle className="text-3xl font-headline italic">Confirm Briefing Transmission?</AlertDialogTitle><AlertDialogDescription className="text-muted-foreground font-light leading-relaxed text-lg italic">This will register **{formData.project}** in the Master Registry. The brief will await senior partner authorization before site implementation can commence.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="pt-10"><AlertDialogCancel className="rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-8 border-neutral-100 transition-none">Abort</AlertDialogCancel><AlertDialogAction onClick={executeFinalSubmit} className="bg-accent text-white rounded-none uppercase tracking-widest text-[12px] font-bold h-14 px-10 shadow-xl transition-none">Authorize & Transmit</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
