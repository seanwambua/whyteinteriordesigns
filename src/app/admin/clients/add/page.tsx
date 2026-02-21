
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
  CheckCircle2,
  FileText,
  Clock,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useWhyteStore, ClientProject, ProjectTask, SubTask, Milestone } from "@/store/use-whyte-store";
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
  const { addClientProject } = useWhyteStore();
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
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    milestones: [
      { id: 'M-1', label: "Initial Site Appraisal", date: new Date(), isCompleted: false, description: "Baseline site metrics verified." }
    ] as (Omit<Milestone, 'date'> & { date: Date })[],
    tasks: [
      { id: 'T-1', title: "Site Measurement Verification", priority: "High" as const, status: "Todo" as const, subtasks: [] as SubTask[] }
    ] as ProjectTask[]
  });

  const totalSteps = 6;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      lastActivity: "Architectural Onboarding Synchronized", 
      isActivated: false, 
      initialDepositPaid: false, 
      totalBudget: budget, 
      milestones: formData.milestones.map(m => ({ ...m, date: format(m.date, "MMM dd, yyyy") })), 
      tasks: formData.tasks.map((t, i) => ({ ...t, id: t.id || `T-${id}-${i + 1}`, status: 'Todo' })), 
      installments: getInstallmentPlan(formData.tier, budget), 
      description: formData.description 
    };

    setTimeout(() => { 
      addClientProject(newProject); 
      setLoading(false); 
      toast({ title: "Commission Initialized", description: `Dossier ${id} has been registered in the Master Registry.` });
      router.push("/admin/clients"); 
    }, 1500);
  };

  const isStepValid = () => { 
    if (step === 1) return formData.name && formData.email; 
    if (step === 2) return formData.project && formData.description; 
    if (step === 3) return formData.totalBudget && Number(formData.totalBudget) > 0; 
    if (step === 4) return formData.startDate && formData.endDate;
    if (step === 5) return formData.milestones.length > 0 && formData.milestones.every(m => m.label);
    if (step === 6) return formData.tasks.length > 0 && formData.tasks.every(t => t.title);
    return true; 
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/admin/clients" className="inline-flex items-center gap-2 text-accent/40 hover:text-accent transition-all group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em]">Back to Master Registry</span>
        </Link>
        <div className="space-y-4">
          <div className="flex items-center gap-4"><div className="h-px w-8 bg-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Architectural Onboarding</span></div>
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
          <form onSubmit={handleSubmit} className="space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><User className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Client Identity</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Full Name</Label><Input placeholder="E.g., Alara Kibaki" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                    <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Email Address</Label><Input type="email" placeholder="client@domain.com" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><Briefcase className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Project Scope</h3></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Project Designation</Label><Input placeholder="E.g., Muthaiga Penthouse Renovation" className="rounded-none border-accent/20 h-14 text-xl font-headline italic focus:ring-accent" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} /></div>
                  <div className="space-y-3"><Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Architectural Narrative</Label><Textarea placeholder="Detailed briefing requirements..." className="min-h-[180px] rounded-none border-accent/20 text-lg p-6 font-light italic leading-relaxed focus:ring-accent" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center gap-4 mb-2"><Calculator className="h-5 w-5 text-accent/40" /><h3 className="text-2xl font-headline italic">Financial Framework</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                      <Select onValueChange={(v: any) => setFormData({...formData, tier: v})} defaultValue={formData.tier}>
                        <SelectTrigger className="rounded-none border-accent/20 h-14 text-sm font-bold uppercase tracking-widest focus:ring-accent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="Premium" className="uppercase tracking-widest text-[11px] font-bold py-3">Premium (50/30/20 Plan)</SelectItem>
                          <SelectItem value="Deluxe" className="uppercase tracking-widest text-[11px] font-bold py-3">Deluxe (60/20/20 Plan)</SelectItem>
                          <SelectItem value="Golden" className="uppercase tracking-widest text-[11px] font-bold py-3">Golden (70/30 Priority Plan)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Capital Commitment (KES)</Label>
                      <Input type="number" placeholder="5,000,000" className="rounded-none border-accent/20 h-14 text-2xl font-headline italic focus:ring-accent" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} />
                    </div>
                  </div>
                  <div className="p-8 bg-secondary/30 border border-accent/5 italic text-sm text-accent/60">
                    The chosen tier determines the automated liquidation schedule for site procurement and artisanal fees.
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
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-14 rounded-none justify-start text-base border-accent/20 uppercase tracking-widest font-bold">
                            <CalendarIcon className="mr-3 h-5 w-5 opacity-40" />
                            {format(formData.startDate, "MMM dd, yyyy")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-none">
                          <Calendar mode="single" selected={formData.startDate} onSelect={(d) => d && setFormData({...formData, startDate: d})} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Projected Delivery Target</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full h-14 rounded-none justify-start text-base border-accent/20 uppercase tracking-widest font-bold">
                            <CalendarIcon className="mr-3 h-5 w-5 opacity-40" />
                            {format(formData.endDate, "MMM dd, yyyy")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-none">
                          <Calendar mode="single" selected={formData.endDate} onSelect={(d) => d && setFormData({...formData, endDate: d})} initialFocus />
                        </PopoverContent>
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
                    <Button type="button" variant="outline" size="sm" onClick={addMilestone} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white transition-all">
                      <Plus className="h-4 w-4 mr-2" /> Append Target
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {formData.milestones.map((m, idx) => (
                      <div key={m.id} className="p-8 border border-accent/5 bg-secondary/5 space-y-6 relative group transition-all hover:bg-white hover:shadow-xl">
                        <Button variant="ghost" size="icon" onClick={() => removeMilestone(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Target Label</Label>
                            <Input value={m.label} onChange={(e) => updateMilestone(idx, 'label', e.target.value)} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-accent/10 focus:ring-accent" placeholder="E.g., Structural Handover" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Sync Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full h-12 rounded-none justify-start text-sm border-accent/10 font-bold uppercase tracking-widest">
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
                    <Button type="button" variant="outline" size="sm" onClick={addTask} className="rounded-none h-10 px-6 text-[11px] uppercase tracking-widest font-bold border-accent/20 hover:bg-accent hover:text-white transition-all">
                      <Plus className="h-4 w-4 mr-2" /> Append Protocol
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {formData.tasks.map((task, idx) => (
                      <div key={task.id} className="p-8 border border-accent/5 bg-secondary/5 space-y-6 relative group transition-all hover:bg-white hover:shadow-xl">
                        <Button variant="ghost" size="icon" onClick={() => removeTask(idx)} className="absolute top-4 right-4 h-8 w-8 text-destructive/20 hover:text-destructive transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                          <div className="md:col-span-8 space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Protocol Identity</Label>
                            <Input value={task.title} onChange={(e) => updateTask(idx, 'title', e.target.value)} className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-accent/10 focus:ring-accent" placeholder="E.g., Initial Site Measurements" />
                          </div>
                          <div className="md:col-span-4 space-y-2">
                            <Label className="text-[11px] uppercase tracking-widest font-bold opacity-40">Urgency</Label>
                            <Select value={task.priority} onValueChange={(v: any) => updateTask(idx, 'priority', v)}>
                              <SelectTrigger className="rounded-none border-accent/10 h-12 text-[11px] font-bold uppercase tracking-widest">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-none">
                                <SelectItem value="Low" className="uppercase tracking-widest text-[10px] font-bold">Low Priority</SelectItem>
                                <SelectItem value="Medium" className="uppercase tracking-widest text-[10px] font-bold">Medium Priority</SelectItem>
                                <SelectItem value="High" className="uppercase tracking-widest text-[10px] font-bold">High Urgency</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-12 flex items-center justify-between border-t border-accent/5">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={handleBack} className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[12px] group">
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" /> Previous Protocol
                </Button>
              ) : <div />}
              
              {step < totalSteps ? (
                <Button type="button" onClick={handleNext} disabled={!isStepValid()} className="bg-accent text-white rounded-none h-16 px-12 uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em] flex gap-3">
                  Continue Onboarding <ChevronRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading || !isStepValid()} className="bg-accent text-white rounded-none h-16 px-16 uppercase tracking-widest text-[12px] font-bold shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all hover:tracking-[0.2em] flex gap-3">
                  {loading ? (
                    <><Zap className="h-5 w-5 animate-pulse" /> Synchronizing...</>
                  ) : (
                    <><CheckCircle2 className="h-5 w-5" /> Authorize Commission</>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="p-10 border border-dashed border-accent/20 bg-secondary/5 text-center rounded-none">
        <p className="text-[11px] uppercase tracking-[0.5em] text-accent/40 font-bold italic">
          High-integrity data collection ensures seamless project lifecycle management and financial audit compliance.
        </p>
      </div>
    </div>
  );
}
