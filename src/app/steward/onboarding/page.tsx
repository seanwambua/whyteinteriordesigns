"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronRight, 
  Check, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  Scale, 
  FileText, 
  ArrowLeft,
  Landmark,
  Building2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useWhyteStore } from "@/store/use-whyte-store";

export default function StewardOnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { stewards, financialSteward, setFinancialSteward } = useWhyteStore();
  
  const [formData, setFormData] = useState({
    accessToken: "",
    stewardId: "",
    stewardName: "",
    agreedToTerms: false,
    agreedToNDA: false,
    notifications: true
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNext = () => {
    if (step === 1) {
      const normalizedInput = formData.accessToken.trim().toUpperCase();
      const found = stewards.find(s => s.accessToken.toUpperCase() === normalizedInput);
      
      if (found) {
        setFormData({
          ...formData,
          stewardId: found.id,
          stewardName: found.name
        });
        setStep(2);
      } else {
        toast({
          title: "Access Denied",
          description: "Stewardship Code not recognized by the Master Registry. Please contact Senior Partners.",
          variant: "destructive"
        });
      }
    } else if (step === 2) {
      if (formData.agreedToTerms && formData.agreedToNDA) {
        setStep(3);
      } else {
        toast({
          title: "Legal Protocol Incomplete",
          description: "You must authorize all legal clauses to proceed.",
          variant: "destructive"
        });
      }
    } else {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem("whyte_steward_onboarded", "true");
        localStorage.setItem("whyte_active_steward_id", formData.stewardId);
        // Calibrate primary steward if not already set or if different
        if (financialSteward !== formData.stewardName) {
          setFinancialSteward(formData.stewardName);
        }
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/steward");
        }, 3500);
      }, 2000);
    }
  };

  const handleBack = () => setStep(step - 1);

  if (!isMounted) return null;

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden font-body">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-2xl"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="h-20 w-20 rounded-none border border-white/20 flex items-center justify-center bg-white/5 relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 border border-white/40"
              />
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center items-center gap-4 mb-2"
            >
              <div className="h-px w-8 bg-white/20" />
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em]">Audit Registry Link Established</span>
              <div className="h-px w-8 bg-white/20" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-4xl md:text-5xl font-headline text-white italic"
            >
              Stewardship <span className="not-italic">Activated.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-white/60 font-light text-base italic leading-relaxed max-w-md mx-auto"
            >
              The reconciliation workbench is now active. All fiscal dossiers have been decrypted for your entity.
            </motion.p>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "linear", delay: 1 }}
            className="h-0.5 bg-white/20 max-w-xs mx-auto overflow-hidden"
          >
            <div className="h-full bg-white w-full" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 font-body">
      <div className="max-w-3xl w-full">
        <div className="mb-8 text-center space-y-2">
          <div className="flex justify-center items-center gap-4 mb-1">
            <div className="h-px w-12 bg-slate-900/20" />
            <span className="text-slate-900 text-[10px] font-bold uppercase tracking-[0.4em]">Governance Protocol</span>
            <div className="h-px w-12 bg-slate-900/20" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline italic">Steward <span className="not-italic">Verification.</span></h1>
          <p className="text-slate-500 font-light text-base italic">Authenticate your stewardship entity to access the professional audit terminal.</p>
        </div>

        <div className="mb-6 max-w-sm mx-auto">
          <div className="flex justify-between text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-1.5">
            <span>Protocol Stage {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-slate-200 rounded-none" />
        </div>

        <Card className="rounded-none border-slate-200 shadow-xl bg-white overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <CardContent className="p-8 md:p-12 lg:p-16">
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-12 w-12 bg-slate-50 flex items-center justify-center text-slate-900 mb-4 border border-slate-100">
                        <Lock className="h-5 w-5" />
                      </div>
                      <h2 className="text-3xl font-headline italic">Stewardship Code</h2>
                      <p className="text-slate-500 font-light text-sm leading-relaxed max-w-xl">
                        Enter the unique Stewardship Code provided by the Senior Partners within the master registry.
                      </p>
                    </div>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Authorized Stewardship Code</Label>
                        <Input 
                          placeholder="WHYTE-STWD-XXXX-XXXX" 
                          className="rounded-none border-slate-200 h-14 text-xl md:text-2xl tracking-[0.1em] focus:ring-slate-900 uppercase font-bold"
                          value={formData.accessToken}
                          onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-12 w-12 bg-slate-50 flex items-center justify-center text-slate-900 mb-4 border border-slate-100">
                        <Scale className="h-5 w-5" />
                      </div>
                      <h2 className="text-3xl font-headline italic">Legal Synchronization</h2>
                      <p className="text-slate-500 font-light text-sm leading-relaxed">
                        Authorize the professional frameworks governing your access to the studio ledger.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Non-Disclosure & Privacy Protocol</Label>
                        <ScrollArea className="h-40 w-full border border-slate-100 p-5 bg-slate-50/50">
                          <div className="text-[11px] font-light leading-relaxed text-slate-600 space-y-3 italic">
                            <p><strong>1. Confidentiality Commitment:</strong> The Steward acknowledges that all financial data, client identities, and site cost allocations are proprietary.</p>
                            <p><strong>2. Data Sovereignty:</strong> No data extracted may be reproduced or transmitted outside the authorized reconciliation cycle.</p>
                            <p><strong>3. Audit Integrity:</strong> The Steward agrees to perform all functions with professional precision.</p>
                            <p><strong>4. Impasse Resolution:</strong> Any discrepancies must be escalated to the Senior Developer Panel.</p>
                          </div>
                        </ScrollArea>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id="terms" 
                            checked={formData.agreedToTerms} 
                            onCheckedChange={(v) => setFormData({...formData, agreedToTerms: !!v})}
                            className="rounded-none border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                          />
                          <label htmlFor="terms" className="text-[11px] font-bold uppercase tracking-widest text-slate-600 cursor-pointer">
                            Authorize Professional Terms of Service
                          </label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id="nda" 
                            checked={formData.agreedToNDA} 
                            onCheckedChange={(v) => setFormData({...formData, agreedToNDA: !!v})}
                            className="rounded-none border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                          />
                          <label htmlFor="nda" className="text-[11px] font-bold uppercase tracking-widest text-slate-600 cursor-pointer">
                            Execute Non-Disclosure Agreement (NDA)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-12 w-12 bg-slate-50 flex items-center justify-center text-slate-900 mb-4 border border-slate-100">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <h2 className="text-3xl font-headline italic">Entity Confirmation</h2>
                      <p className="text-slate-500 font-light text-sm leading-relaxed">
                        Confirm the steward entity identity recognized by the studio registry.
                      </p>
                    </div>
                    <div className="space-y-4 max-w-lg">
                      <div className="p-6 border border-slate-100 bg-slate-50/50 space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Assigned Steward</span>
                        <p className="text-xl font-headline italic text-slate-900">{formData.stewardName}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 italic uppercase tracking-widest font-light leading-relaxed">
                        By finalizing access, you confirm that you are an authorized representative of the above entity and that all audit functions will be performed under this identity.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-8 flex items-center justify-between border-t border-slate-100 mt-8">
                  {step > 1 ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleBack}
                      className="text-slate-400 hover:text-slate-900 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 h-10 transition-all"
                    >
                      <ArrowLeft className="h-3 w-3" /> Previous Protocol
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button 
                    onClick={handleNext}
                    disabled={step === 1 && !formData.accessToken}
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-none h-14 px-12 uppercase tracking-[0.3em] transition-all min-w-[200px] text-[10px] font-bold shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3"><Loader2 className="h-4 w-4 animate-spin" /> Finalizing...</span>
                    ) : (
                      <span className="flex items-center gap-3">
                        {step === totalSteps ? "Synchronize Terminal" : "Continue"} <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>

        <p className="text-center mt-10 text-[9px] uppercase tracking-[0.6em] text-slate-300 font-bold">
          Stewardship Verification — Secure Financial Synchronization
        </p>
      </div>
    </div>
  );
}
