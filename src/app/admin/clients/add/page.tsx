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
  Activity,
  ClipboardList,
  Calendar as CalendarIcon,
  Flag,
  Users,
  HardHat
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useWhyteStore, ClientProject, ProjectTask, SubTask, Milestone, VendorAllocation } from "@/store/use-whyte-store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AddClientPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { addClientProject, collaborators } = useWhyteStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    tier: "Premium" as ClientProject['tier'],
    description: "",
    totalBudget: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    milestones: [
      { id: 'M-1', label: "Initial Site Appraisal", date: new Date(), isCompleted: false, description: "Baseline site metrics verified." }
    ] as (Omit<Milestone, 'date'> & { date: Date })[],
    tasks: [
      { 
        title: "Site Measurement Verification", 
        priority: "High" as const, 
        status: "Todo" as const,
        subtasks: [] as SubTask[]
      }
    ] as (Omit<ProjectTask, 'id'>)[],
    vendorAllocations: [] as Omit<VendorAllocation, 'id'>[]
  });

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  // Milestone Handlers
  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { id: `M-${Math.random().toString(36).substr(2, 4)}`, label: "", date: new Date(), isCompleted: false, description: "" }]
    });
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const updated = [...formData.milestones];
    (updated[index] as any)[field] = value;
    setFormData({ ...formData, milestones: updated });
  };

  const removeMilestone = (index: number) => {
    setFormData({ ...formData, milestones: formData.milestones.filter((_, i) => i !== index) });
  };

  // Task Handlers
  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, { title: "", priority: "Medium", status: "Todo", subtasks: [] }]
    });
  };

  const removeTask = (index: number) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter((_, i) => i !== index)
    });
  };

  const updateTask = (index: number, field: keyof Omit<ProjectTask, 'id'>, value: any) => {
    const updated = [...formData.tasks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, tasks: updated });
  };

  const addSubtask = (taskIdx: number) => {
    const updated = [...formData.tasks];
    const task = updated[taskIdx];
    const subtasks = task.subtasks || [];
    task.subtasks = [...subtasks, { id: `S-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, title: "", isCompleted: false }];
    setFormData({ ...formData, tasks: updated });
  };

  const updateSubtask = (taskIdx: number, subIdx: number, title: string) => {
    const updated = [...formData.tasks];
    if (updated[taskIdx].subtasks) {
      updated[taskIdx].subtasks![subIdx].title = title;
    }
    setFormData({ ...formData, tasks: updated });
  };

  const removeSubtask = (taskIdx: number, subIdx: number) => {
    const updated = [...formData.tasks];
    if (updated[taskIdx].subtasks) {
      updated[taskIdx].subtasks = updated[taskIdx].subtasks!.filter((_, i) => i !== subIdx);
    }
    setFormData({ ...formData, tasks: updated });
  };

  // Vendor Handlers
  const addVendorAllocation = () => {
    setFormData({
      ...formData,
      vendorAllocations: [...formData.vendorAllocations, { vendorName: "", role: "", category: "Vendor", costType: "Fixed", costValue: 0, timelineDays: 0, materials: [] }]
    });
  };

  const updateVendorAllocation = (index: number, field: keyof Omit<VendorAllocation, 'id'>, value: any) => {
    const updated = [...formData.vendorAllocations];
    (updated[index] as any)[field] = value;
    setFormData({ ...formData, vendorAllocations: updated });
  };

  const removeVendorAllocation = (index: number) => {
    setFormData({ ...formData, vendorAllocations: formData.vendorAllocations.filter((_, i) => i !== index) });
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const id = `WP-${Math.floor(Math.random() * 9000) + 1000}`;
    const budget = Number(formData.totalBudget) || 0;
    
    const tasksWithIds: ProjectTask[] = formData.tasks.map((t, idx) => ({
      ...t,
      id: `T-${id}-${idx + 1}`,
      status: 'Todo'
    }));

    const milestonesWithFormattedDates: Milestone[] = formData.milestones.map(m => ({
      ...m,
      date: format(m.date, "MMM dd, yyyy")
    }));

    const vendorsWithIds: VendorAllocation[] = formData.vendorAllocations.map((v, idx) => ({
      ...v,
      id: `VA-${id}-${idx + 1}`
    }));

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
      lastActivity: "Briefing Synchronized",
      financialReportStatus: 'Pending',
      isActivated: false,
      initialDepositPaid: false,
      totalBudget: budget,
      milestones: milestonesWithFormattedDates,
      tasks: tasksWithIds,
      vendorAllocations: vendorsWithIds,
      installments: getInstallmentPlan(formData.tier, budget),
      description: formData.description
    };

    setTimeout(() => {
      addClientProject(newProject);
      setLoading(false);
      toast({
        title: "Commission Initialized",
        description: `Project ${id} is now queued for financial activation.`,
      });
      router.push("/admin/operations/planning");
    }, 1500);
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.email;
    if (step === 2) return formData.project && formData.description && formData.startDate && formData.endDate;
    if (step === 3) return formData.totalBudget && Number(formData.totalBudget) > 0;
    if (step === 4) return formData.milestones.every(m => m.label);
    if (step === 5) return formData.tasks.length > 0 && formData.tasks.every(t => t.title.trim() !== "" && t.priority);
    if (step === 6) return true; // Optional step
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link 
          href="/admin/clients" 
          className="inline-flex items-center gap-2 text-accent/40 hover:text-accent transition-all group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em]">Back to Master Registry</span>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Architectural Onboarding</span>
          </div>
          <h1 className="text-5xl font-headline italic">Initialize <span className="not-italic">New Commission.</span></h1>
        </div>
      </motion.div>

      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold text-accent/40 mb-2">
          <span>Phase {step} of {totalSteps}</span>
          <span>{Math.round(progress)}% Seeded</span>
        </div>
        <Progress value={progress} className="h-1 bg-accent/5 rounded-none" />
      </div>

      <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
        <div className="bg-accent h-1.5 w-full" />
        <CardContent className="p-10 md:p-16">
          <form 
            onSubmit={handleSubmit} 
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            className="space-y-10"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-4 mb-8"><User className="h-5 w-5 text-accent/40" /><h3 className="text-xl font-headline italic">Client Identity</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Full Name</Label>
                      <Input placeholder="Client Name" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Email Address</Label>
                      <Input type="email" placeholder="client@example.com" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-4 mb-8"><Briefcase className="h-5 w-5 text-accent/40" /><h3 className="text-xl font-headline italic">Project Scope & Timeline</h3></div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Title</Label>
                    <Input placeholder="E.g., Runda Residency - Master Suite" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" required value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commencement Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full h-14 rounded-none border-accent/20 text-lg font-light justify-start text-left", !formData.startDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-40" />
                            {formData.startDate ? format(formData.startDate, "PPP") : "Select Start Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-none border-accent/20"><Calendar mode="single" selected={formData.startDate} onSelect={(d) => d && setFormData({...formData, startDate: d})} initialFocus /></PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Authorized Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full h-14 rounded-none border-accent/20 text-lg font-light justify-start text-left", !formData.endDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-40" />
                            {formData.endDate ? format(formData.endDate, "PPP") : "Select End Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-none border-accent/20"><Calendar mode="single" selected={formData.endDate} onSelect={(d) => d && setFormData({...formData, endDate: d})} initialFocus /></PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Architectural Brief</Label>
                    <Textarea placeholder="Describe the spatial goals..." className="min-h-[150px] rounded-none border-accent/20 focus:ring-accent resize-none p-6 text-lg" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-4 mb-8"><Calculator className="h-5 w-5 text-accent/40" /><h3 className="text-xl font-headline italic">Financial Framework</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                      <Select onValueChange={(v: ClientProject['tier']) => setFormData({...formData, tier: v})} defaultValue={formData.tier}>
                        <SelectTrigger className="rounded-none border-accent/20 h-14 text-lg"><SelectValue placeholder="Select Tier" /></SelectTrigger>
                        <SelectContent className="rounded-none border-accent/20">
                          <SelectItem value="Premium" className="py-3">Premium (50/30/20 Plan)</SelectItem>
                          <SelectItem value="Deluxe" className="py-3">Deluxe (60/20/20 Plan)</SelectItem>
                          <SelectItem value="Golden" className="py-3">Golden (70/30 Plan)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Total Budget (KES)</Label>
                      <Input type="number" placeholder="10,000,000" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" required value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} />
                    </div>
                  </div>
                  <div className="p-6 bg-secondary/30 border border-accent/5 space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Payment Schedule Expectations</p>
                    <div className="space-y-2">
                      {getInstallmentPlan(formData.tier, Number(formData.totalBudget) || 0).map((ins, i) => (
                        <div key={i} className="flex justify-between text-[12px] font-light italic"><span>{ins.label}</span><span className="font-bold">KES {ins.amount.toLocaleString()}</span></div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4"><Flag className="h-5 w-5 text-accent/40" /><h3 className="text-xl font-headline italic">Target Milestones</h3></div>
                    <Button type="button" onClick={addMilestone} variant="outline" className="rounded-none h-10 uppercase tracking-widest text-[11px] flex gap-2"><Plus className="h-3.5 w-3.5" /> Append Target</Button>
                  </div>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {formData.milestones.map((m, idx) => (
                      <div key={idx} className="p-6 border border-accent/10 bg-white relative space-y-4 shadow-sm group">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-destructive/40 hover:text-destructive" onClick={() => removeMilestone(idx)} disabled={formData.milestones.length === 1}><Trash2 className="h-4 w-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Milestone Title</Label>
                            <Input placeholder="E.g., Structural Handover" className="rounded-none h-12 text-sm font-bold uppercase tracking-widest" value={m.label} onChange={(e) => updateMilestone(idx, 'label', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Target Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full h-12 rounded-none border-accent/10 text-sm justify-start"><CalendarIcon className="mr-2 h-4 w-4 opacity-40" />{format(m.date, "PPP")}</Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 rounded-none"><Calendar mode="single" selected={m.date} onSelect={(d) => d && updateMilestone(idx, 'date', d)} initialFocus /></PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4"><Activity className="h-5 w-5 text-accent/40" /><h3 className="text-xl font-headline italic">Operational Workflow</h3></div>
                    <Button type="button" onClick={addTask} variant="outline" className="rounded-none h-10 uppercase tracking-widest text-[11px] flex gap-2"><Plus className="h-3.5 w-3.5" /> Add Primary Task</Button>
                  </div>
                  <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {formData.tasks.map((task, idx) => (
                      <div key={idx} className="p-8 border border-accent/10 bg-white relative space-y-6 shadow-sm group">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 text-destructive/40 hover:text-destructive" onClick={() => removeTask(idx)} disabled={formData.tasks.length === 1}><Trash2 className="h-4 w-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Primary Task Identity</Label>
                            <Input placeholder="E.g., Site Leveling" className="rounded-none h-12 text-sm font-bold uppercase tracking-widest" value={task.title} onChange={(e) => updateTask(idx, 'title', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Urgency Protocol</Label>
                            <Select value={task.priority} onValueChange={(v: any) => updateTask(idx, 'priority', v)}>
                              <SelectTrigger className="rounded-none h-12 text-xs border-accent/10 font-bold uppercase tracking-widest"><SelectValue placeholder="Priority" /></SelectTrigger>
                              <SelectContent className="rounded-none">
                                <SelectItem value="Low">Low Priority</SelectItem>
                                <SelectItem value="Medium">Medium Priority</SelectItem>
                                <SelectItem value="High">High Urgency</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-accent/5">
                          <div className="flex justify-between items-center"><Label className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-bold">Sub-task Protocol</Label><Button type="button" variant="ghost" size="sm" onClick={() => addSubtask(idx)} className="h-6 text-[10px] uppercase tracking-widest font-bold text-accent hover:bg-accent/5 p-0"><Plus className="h-2.5 w-2.5 mr-1" /> Append Sub-task</Button></div>
                          <div className="space-y-2">
                            {task.subtasks?.map((sub, sIdx) => (
                              <div key={sub.id} className="flex gap-3 items-center group/sub">
                                <div className="h-1.5 w-1.5 rounded-full bg-accent/20" /><Input placeholder="Sub-task objective..." value={sub.title} onChange={(e) => updateSubtask(idx, sIdx, e.target.value)} className="h-8 rounded-none border-none text-xs italic focus:ring-0 p-0" />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSubtask(idx, sIdx)} className="h-6 w-6 text-destructive/20 hover:text-destructive opacity-0 group-hover/sub:opacity-100 transition-opacity"><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4"><Users className="h-5 w-5 text-accent/40" /><h3 className="text-xl font-headline italic">Network Matrix</h3></div>
                    <Button type="button" onClick={addVendorAllocation} variant="outline" className="rounded-none h-10 uppercase tracking-widest text-[11px] flex gap-2"><Plus className="h-3.5 w-3.5" /> Allocate Partner</Button>
                  </div>
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {formData.vendorAllocations.map((v, idx) => (
                      <div key={idx} className="p-8 border border-accent/10 bg-white relative space-y-6 shadow-sm group">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 text-destructive/40 hover:text-destructive" onClick={() => removeVendorAllocation(idx)}><Trash2 className="h-4 w-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Partner Identity</Label>
                            <Select value={v.vendorName} onValueChange={(val) => updateVendorAllocation(idx, 'vendorName', val)}>
                              <SelectTrigger className="rounded-none h-12 text-sm font-bold uppercase tracking-widest"><SelectValue placeholder="Select Partner" /></SelectTrigger>
                              <SelectContent className="rounded-none">
                                {collaborators.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                <SelectItem value="Manual Partner">Manual Entry (N/A)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Role in Commission</Label>
                            <Input placeholder="E.g., Structural Architect" className="rounded-none h-12 text-sm" value={v.role} onChange={(e) => updateVendorAllocation(idx, 'role', e.target.value)} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Cost Model</Label>
                            <Select value={v.costType} onValueChange={(val: any) => updateVendorAllocation(idx, 'costType', val)}>
                              <SelectTrigger className="rounded-none h-12 text-xs font-bold uppercase tracking-widest"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-none">
                                <SelectItem value="Fixed">Fixed Fee</SelectItem>
                                <SelectItem value="Daily">Daily Rate</SelectItem>
                                <SelectItem value="Percentage">Studio Percentage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Model Value</Label>
                            <Input type="number" className="rounded-none h-12" value={v.costValue} onChange={(e) => updateVendorAllocation(idx, 'costValue', Number(e.target.value))} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest opacity-40 font-bold">Projected Days</Label>
                            <Input type="number" className="rounded-none h-12" value={v.timelineDays} onChange={(e) => updateVendorAllocation(idx, 'timelineDays', Number(e.target.value))} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {formData.vendorAllocations.length === 0 && (
                      <div className="py-12 text-center border border-dashed border-accent/10">
                        <p className="text-xs font-light italic text-muted-foreground uppercase tracking-widest">No partners currently allocated to this brief.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-10 flex items-center justify-between border-t border-accent/5">
              {step > 1 ? <Button type="button" variant="ghost" onClick={handleBack} className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[12px]">Previous Phase</Button> : <div />}
              {step < totalSteps ? (
                <Button type="button" onClick={handleNext} disabled={!isStepValid()} className="bg-accent text-white rounded-none h-14 px-12 uppercase tracking-[0.2em] text-[12px] font-bold flex gap-3 hover:bg-accent/90 transition-all">Continue <ChevronRight className="h-4 w-4" /></Button>
              ) : (
                <Button type="submit" disabled={loading || !isStepValid()} className="bg-accent text-white rounded-none h-14 px-12 uppercase tracking-[0.3em] text-[12px] font-bold flex gap-4 hover:bg-accent/90 transition-all shadow-2xl disabled:opacity-50">{loading ? "Initializing Journey..." : <><ClipboardList className="h-5 w-5" /> Authorize Commission</>}</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
