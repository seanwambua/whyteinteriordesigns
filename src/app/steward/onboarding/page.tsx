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
  const { financialSteward } = useWhyteStore();
  
  const [formData, setFormData] = useState({
    accessToken: "",
    agreedToTerms: false,
    agreedToNDA: false,
    notifications: true
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1) {
      if (formData.accessToken.toUpperCase() === "WHYTE-STEWARD-ALPHA") {
        setStep(2);
      } else {
        toast({
          title: "Access Denied",
          description: "Stewardship Token not recognized by the Master Registry.",
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden font-body">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-10 max-w-2xl"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="h-24 w-24 rounded-none border border-white/20 flex items-center justify-center bg-white/5 relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 border border-white/40"
              />
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center items-center gap-4 mb-4"
            >
              <div className="h-px w-8 bg-white/20" />
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em]">Audit Registry Link Established</span>
              <div className="h-px w-8 bg-white/20" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-5xl md:text-6xl font-headline text-white italic"
            >
              Stewardship <span className="not-italic">Activated.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-white/60 font-light text-lg italic leading-relaxed max-w-md mx-auto"
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-body">
      <div className="max-w-4xl w-full">
        <div className="mb-16 text-center space-y-4">
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="h-px w-12 bg-slate-900/20" />
            <span className="text-slate-900 text-[11px] font-bold uppercase tracking-[0.4em]">Governance Protocol</span>
            <div className="h-px w-12 bg-slate-900/20" />
          </div>
          <h1 className="text-6xl font-headline italic">Steward <span className="not-italic">Verification.</span></h1>
          <p className="text-slate-500 font-light text-lg italic">Authenticate your stewardship entity to access the professional audit terminal.</p>
        </div>

        <div className="mb-12 max-w-md mx-auto">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-3">
            <span>Protocol Stage {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-slate-200 rounded-none" />
        </div>

        <Card className="rounded-none border-slate-200 shadow-2xl bg-white overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <CardContent className="p-12 md:p-20">
                {step === 1 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="h-14 w-14 bg-slate-50 flex items-center justify-center text-slate-900 mb-8 border border-slate-100">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h2 className="text-4xl font-headline italic">Stewardship Token</h2>
                      <p className="text-slate-500 font-light text-lg leading-relaxed max-w-xl">
                        Enter the unique security token provided by the Senior Partners. For this prototype, use <span className="font-bold text-slate-900">WHYTE-STEWARD-ALPHA</span>.
                      </p>
                    </div>
                    <div className="space-y-6 max-w-md">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Professional Access Token</Label>
                        <Input 
                          placeholder="XXXX-XXXX-XXXX" 
                          className="rounded-none border-slate-200 h-16 text-2xl tracking-[0.3em] focus:ring-slate-900 uppercase font-bold"
                          value={formData.accessToken}
                          onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="h-14 w-14 bg-slate-50 flex items-center justify-center text-slate-900 mb-8 border border-slate-100">
                        <Scale className="h-6 w-6" />
                      </div>
                      <h2 className="text-4xl font-headline italic">Legal Synchronization</h2>
                      <p className="text-slate-500 font-light text-lg leading-relaxed">
                        Authorize the professional frameworks governing your access to the studio ledger.
                      </p>
                    </div>
                    
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Non-Disclosure & Data Privacy Protocol</Label>
                        <ScrollArea className="h-48 w-full border border-slate-100 p-6 bg-slate-50/50">
                          <div className="text-[12px] font-light leading-relaxed text-slate-600 space-y-4 italic">
                            <p><strong>1. Confidentiality Commitment:</strong> The Steward acknowledges that all financial data, client identities, and site cost allocations within the Whyte Interior Designs registry are strictly proprietary.</p>
                            <p><strong>2. Data Sovereignty:</strong> No data extracted from the terminal may be reproduced, transmitted, or utilized outside the authorized reconciliation cycle.</p>
                            <p><strong>3. Audit Integrity:</strong> The Steward agrees to perform all reconciliation functions with professional precision, documenting all findings within the studio's synchronized log.</p>
                            <p><strong>4. Impasse Resolution:</strong> Any discrepancies in the architectural ledger must be escalated immediately to the Senior Developer Panel.</p>
                          </div>
                        </ScrollArea>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="terms" 
                            checked={formData.agreedToTerms} 
                            onCheckedChange={(v) => setFormData({...formData, agreedToTerms: !!v})}
                            className="rounded-none border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                          />
                          <label htmlFor="terms" className="text-[12px] font-bold uppercase tracking-widest text-slate-600 cursor-pointer">
                            Authorize Professional Terms of Service
                          </label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="nda" 
                            checked={formData.agreedToNDA} 
                            onCheckedChange={(v) => setFormData({...formData, agreedToNDA: !!v})}
                            className="rounded-none border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                          />
                          <label htmlFor="nda" className="text-[12px] font-bold uppercase tracking-widest text-slate-600 cursor-pointer">
                            Execute Non-Disclosure Agreement (NDA)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="h-14 w-14 bg-slate-50 flex items-center justify-center text-slate-900 mb-8 border border-slate-100">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <h2 className="text-4xl font-headline italic">Entity Confirmation</h2>
                      <p className="text-slate-500 font-light text-lg leading-relaxed">
                        Confirm the steward entity identity currently recognized by the studio registry.
                      </p>
                    </div>
                    <div className="space-y-6 max-w-xl">
                      <div className="p-8 border border-slate-100 bg-slate-50/50 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assigned Steward</span>
                        <p className="text-2xl font-headline italic text-slate-900">{financialSteward}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 italic uppercase tracking-widest font-light leading-relaxed">
                        By finalizing access, you confirm that you are an authorized representative of the above entity and that all audit functions will be performed under this identity.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-16 flex items-center justify-between border-t border-slate-100 mt-16">
                  {step > 1 ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleBack}
                      className="text-slate-400 hover:text-slate-900 font-bold uppercase tracking-widest text-[11px] flex items-center gap-3 transition-all"
                    >
                      <ArrowLeft className="h-4 w-4" /> Previous Protocol
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button 
                    onClick={handleNext}
                    disabled={step === 1 && !formData.accessToken}
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-none h-16 px-16 uppercase tracking-[0.3em] transition-all min-w-[240px] text-[11px] font-bold shadow-2xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin" /> Authorizing...</span>
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

        <p className="text-center mt-12 text-[10px] uppercase tracking-[0.6em] text-slate-300 font-bold">
          Stewardship Verification — Secure Financial Synchronization
        </p>
      </div>
    </div>
  );
}
