
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, ArrowLeft, Banknote, ChevronRight, User, Briefcase, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
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
    totalBudget: ""
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const id = `WP-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const newProject: ClientProject = {
      id,
      name: formData.name,
      email: formData.email,
      project: formData.project,
      tier: formData.tier,
      status: "Planning",
      progress: 0,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      lastActivity: "Planning Phase Initialized",
      financialReportStatus: 'Pending',
      isActivated: false,
      initialDepositPaid: false,
      totalBudget: Number(formData.totalBudget) || 0
    };

    // Synchronize to store
    setTimeout(() => {
      addClientProject(newProject);
      setLoading(false);
      toast({
        title: "Briefing Initialized",
        description: `Project ${id} is now in the Planning queue. Deposit verification required for activation.`,
      });
      router.push("/admin/operations/planning");
    }, 1500);
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.email;
    if (step === 2) return formData.project && formData.totalBudget;
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 font-body">
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
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Briefing Onboarding</span>
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
        <CardContent className="p-12 md:p-16">
          <form onSubmit={handleSubmit} className="space-y-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <User className="h-5 w-5 text-accent/40" />
                    <h3 className="text-xl font-headline italic">Identity Verification</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Client Full Name</Label>
                      <Input 
                        placeholder="E.g., Jonathan Muthaiga" 
                        className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent bg-transparent" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email Address</Label>
                      <Input 
                        type="email" 
                        placeholder="client@example.com" 
                        className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent bg-transparent" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <Calculator className="h-5 w-5 text-accent/40" />
                    <h3 className="text-xl font-headline italic">Financial Architecture</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Commission Tier</Label>
                      <Select 
                        onValueChange={(v: ClientProject['tier']) => setFormData({...formData, tier: v})} 
                        defaultValue={formData.tier}
                      >
                        <SelectTrigger className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent bg-transparent">
                          <SelectValue placeholder="Select Commission Tier" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-accent/20 font-body">
                          <SelectItem value="Premium" className="py-3">Premium (50% Deposit)</SelectItem>
                          <SelectItem value="Deluxe" className="py-3">Deluxe (60% Deposit)</SelectItem>
                          <SelectItem value="Golden" className="py-3">Golden (70% Deposit)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Target Budget (KES)</Label>
                      <Input 
                        type="number"
                        placeholder="E.g., 15,000,000" 
                        className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent bg-transparent" 
                        required 
                        value={formData.totalBudget}
                        onChange={(e) => setFormData({...formData, totalBudget: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Title</Label>
                    <Input 
                      placeholder="E.g., Runda Residency - Phase II" 
                      className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent bg-transparent" 
                      required 
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <Briefcase className="h-5 w-5 text-accent/40" />
                    <h3 className="text-xl font-headline italic">Architectural Brief</h3>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Initial Briefing Notes</Label>
                    <Textarea 
                      placeholder="Describe the primary spatial goals and aesthetic ambitions..." 
                      className="min-h-[200px] rounded-none border-accent/20 focus:ring-accent resize-none bg-transparent text-lg p-6" 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="p-6 bg-secondary/30 border border-accent/5 flex items-center gap-4">
                    <Banknote className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Financial Activation Requirement</p>
                      <p className="text-xs text-muted-foreground italic">
                        Initializing as {formData.tier} Tier will require a verified {formData.tier === 'Premium' ? '50%' : formData.tier === 'Deluxe' ? '60%' : '70%'} deposit of KES {((Number(formData.totalBudget) || 0) * (formData.tier === 'Premium' ? 0.5 : formData.tier === 'Deluxe' ? 0.6 : 0.7)).toLocaleString()}.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-10 flex items-center justify-between border-t border-accent/5">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleBack}
                  className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[10px]"
                >
                  Previous Phase
                </Button>
              ) : <div />}
              
              {step < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-accent text-white rounded-none h-14 px-12 uppercase tracking-[0.2em] text-[10px] font-bold flex gap-3 hover:bg-accent/90"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-accent text-white rounded-none h-14 px-12 uppercase tracking-[0.3em] text-[10px] font-bold flex gap-4 hover:bg-accent/90 transition-all shadow-2xl disabled:opacity-50"
                >
                  {loading ? "Synchronizing Brief..." : <><ClipboardList className="h-5 w-5" /> Finalize Briefing</>}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
