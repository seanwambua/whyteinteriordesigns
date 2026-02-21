
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, ArrowLeft, Banknote, ChevronRight, User, Briefcase, Calculator, Flag, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useWhyteStore, ClientProject, Milestone } from "@/store/use-whyte-store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

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
    milestones: [
      { label: "Project Initialization", date: "Month 1", isCompleted: true, description: "Kick-off and initial site survey." }
    ] as Milestone[]
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { label: "", date: "", isCompleted: false, description: "" }]
    });
  };

  const removeMilestone = (index: number) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index)
    });
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updated = [...formData.milestones];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, milestones: updated });
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
      { label: "Initial Deposit (70%)", percentage: 70, amount: budget * 0.7, status: 'Pending' as const },
      { label: "Final Handover (30%)", percentage: 30, amount: budget * 0.3, status: 'Pending' as const },
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
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      lastActivity: "Briefing Synchronized",
      financialReportStatus: 'Pending',
      isActivated: false,
      initialDepositPaid: false,
      totalBudget: budget,
      milestones: formData.milestones,
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
    if (step === 2) return formData.project && formData.description;
    if (step === 3) return formData.totalBudget && Number(formData.totalBudget) > 0;
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Button asChild variant="ghost" className="text-accent/40 hover:text-accent p-0 font-bold uppercase tracking-widest text-[9px] h-auto flex items-center gap-2 mb-4">
          <Link href="/admin/clients"><ArrowLeft className="h-3 w-3" /> Back to Directory</Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Architectural Onboarding</span>
        </div>
        <h1 className="text-5xl font-headline italic">Initialize <span className="not-italic">New Commission.</span></h1>
      </motion.div>

      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-accent/40 mb-2">
          <span>Phase {step} of {totalSteps}</span>
          <span>{Math.round(progress)}% Seeded</span>
        </div>
        <Progress value={progress} className="h-1 bg-accent/5 rounded-none" />
      </div>

      <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
        <div className="bg-accent h-1.5 w-full" />
        <CardContent className="p-10 md:p-16">
          <form onSubmit={handleSubmit} className="space-y-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <User className="h-5 w-5 text-accent/40" />
                    <h3 className="text-xl font-headline italic">Client Identity</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Full Name</Label>
                      <Input placeholder="Client Name" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email Address</Label>
                      <Input type="email" placeholder="client@example.com" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <Briefcase className="h-5 w-5 text-accent/40" />
                    <h3 className="text-xl font-headline italic">Project Scope</h3>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Title</Label>
                    <Input placeholder="E.g., Runda Residency - Master Suite" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" required value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Architectural Brief</Label>
                    <Textarea placeholder="Describe the spatial goals..." className="min-h-[150px] rounded-none border-accent/20 focus:ring-accent resize-none p-6 text-lg" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <Calculator className="h-5 w-5 text-accent/40" />
                    <h3 className="text-xl font-headline italic">Financial Framework</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                      <Select onValueChange={(v: ClientProject['tier']) => setFormData({...formData, tier: v})} defaultValue={formData.tier}>
                        <SelectTrigger className="rounded-none border-accent/20 h-14 text-lg">
                          <SelectValue placeholder="Select Tier" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-accent/20">
                          <SelectItem value="Premium" className="py-3">Premium (50/30/20 Plan)</SelectItem>
                          <SelectItem value="Deluxe" className="py-3">Deluxe (60/20/20 Plan)</SelectItem>
                          <SelectItem value="Golden" className="py-3">Golden (70/30 Plan)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Budget (KES)</Label>
                      <Input type="number" placeholder="10,000,000" className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent" required value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="p-6 bg-secondary/30 border border-accent/5 space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Payment Schedule Expectations</p>
                    <div className="space-y-2">
                      {getInstallmentPlan(formData.tier, Number(formData.totalBudget) || 0).map((ins, i) => (
                        <div key={i} className="flex justify-between text-[11px] font-light italic">
                          <span>{ins.label}</span>
                          <span className="font-bold">KES {ins.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <Flag className="h-5 w-5 text-accent/40" />
                      <h3 className="text-xl font-headline italic">Project Roadmap</h3>
                    </div>
                    <Button type="button" onClick={addMilestone} variant="outline" className="rounded-none h-10 uppercase tracking-widest text-[9px] flex gap-2">
                      <Plus className="h-3.5 w-3.5" /> Add Milestone
                    </Button>
                  </div>
                  
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {formData.milestones.map((milestone, idx) => (
                      <div key={idx} className="p-6 border border-accent/10 bg-secondary/5 relative space-y-4">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 text-destructive/40 hover:text-destructive" onClick={() => removeMilestone(idx)} disabled={formData.milestones.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[9px] uppercase tracking-widest opacity-40">Label</Label>
                            <Input placeholder="Milestone Name" className="rounded-none h-10 text-sm" value={milestone.label} onChange={(e) => updateMilestone(idx, 'label', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] uppercase tracking-widest opacity-40">Target Timeline</Label>
                            <Input placeholder="E.g., Month 2" className="rounded-none h-10 text-sm" value={milestone.date} onChange={(e) => updateMilestone(idx, 'date', e.target.value)} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] uppercase tracking-widest opacity-40">Objective</Label>
                          <Input placeholder="Details..." className="rounded-none h-10 text-sm" value={milestone.description} onChange={(e) => updateMilestone(idx, 'description', e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-10 flex items-center justify-between border-t border-accent/5">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={handleBack} className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[10px]">Previous Phase</Button>
              ) : <div />}
              
              {step < totalSteps ? (
                <Button type="button" onClick={handleNext} disabled={!isStepValid()} className="bg-accent text-white rounded-none h-14 px-12 uppercase tracking-[0.2em] text-[10px] font-bold flex gap-3 hover:bg-accent/90 transition-all">
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="bg-accent text-white rounded-none h-14 px-12 uppercase tracking-[0.3em] text-[10px] font-bold flex gap-4 hover:bg-accent/90 transition-all shadow-2xl disabled:opacity-50">
                  {loading ? "Initializing Journey..." : <><ClipboardList className="h-5 w-5" /> Authorize Commission</>}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
