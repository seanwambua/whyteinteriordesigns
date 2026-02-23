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
  Building2,
  BadgeCheck,
  Award
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useWhyteStore } from "@/store/use-whyte-store";
import { Badge } from "@/components/ui/badge";

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
    authorizedDate: "",
    agreedToTerms: false,
    agreedToNDA: false,
    consentText: "",
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
          stewardName: found.name,
          authorizedDate: found.authorizedDate
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
      if (formData.agreedToTerms && formData.agreedToNDA && formData.consentText === "I CONSENT") {
        setStep(3);
      } else {
        toast({
          title: "Legal Protocol Incomplete",
          description: "You must authorize all legal clauses and explicitly type 'I CONSENT' to proceed.",
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
                      <h2 className="text-3xl font-headline italic">Ethics & Legal Protocol</h2>
                      <p className="text-slate-500 font-light text-sm leading-relaxed">
                        Authorize the professional frameworks and ethics governing your access to the studio ledger.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Professional Mandates</Label>
                        <ScrollArea className="h-40 w-full border border-slate-100 p-5 bg-slate-50/50">
                          <div className="text-[11px] font-light leading-relaxed text-slate-600 space-y-3 italic">
                            <p><strong>1. Forensic Integrity:</strong> The Steward must perform all audits with uncompromising accuracy and professional skepticism.</p>
                            <p><strong>2. Conflict of Interest:</strong> Stewards must declare any commercial interest in site trade partners or material suppliers.</p>
                            <p><strong>3. Confidentiality Commitment:</strong> All financial data, client identities, and site cost allocations are proprietary.</p>
                            <p><strong>4. Data Sovereignty:</strong> No data extracted may be reproduced or transmitted outside the authorized reconciliation cycle.</p>
                            <p><strong>5. Impasse Resolution:</strong> Any discrepancies must be escalated to the Senior Partner panel for immediate resolution.</p>
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

                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Type "I CONSENT" to authorize the stewardship mandate</Label>
                        <Input 
                          placeholder="I CONSENT"
                          value={formData.consentText}
                          onChange={(e) => setFormData({...formData, consentText: e.target.value})}
                          className="rounded-none border-slate-200 h-12 uppercase font-bold tracking-widest text-center focus:ring-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <div className="h-12 w-12 bg-slate-50 flex items-center justify-center text-slate-900 mb-4 border border-slate-100">
                        <BadgeCheck className="h-5 w-5" />
                      </div>
                      <h2 className="text-3xl font-headline italic">Entity Confirmation</h2>
                      <p className="text-slate-500 font-light text-sm leading-relaxed">
                        Authorize the decryption of the stewardship terminal under the following professional identity.
                      </p>
                    </div>

                    <div className="p-10 border border-slate-200 bg-slate-50/50 space-y-8 relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 right-0 p-4 opacity-5"><Landmark className="h-32 w-32" /></div>
                      <div className="flex items-center gap-8 relative z-10">
                        <div className="h-20 w-20 bg-slate-900 text-white flex items-center justify-center font-headline italic text-3xl shadow-xl">
                          {formData.stewardName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">{formData.stewardId}</span>
                          <h3 className="text-3xl font-headline italic text-slate-900">{formData.stewardName}</h3>
                          <Badge className="bg-slate-900 text-white rounded-none uppercase tracking-widest text-[9px] font-bold py-1 px-3">Authorized Stewardship Entity</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-200 relative z-10">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Authorization Date</p>
                          <p className="text-[13px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                            <BadgeCheck className="h-3.5 w-3.5 opacity-40" /> {formData.authorizedDate}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Professional Designation</p>
                          <p className="text-[13px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                            <Award className="h-3.5 w-3.5 opacity-40" /> Financial Auditor
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 italic uppercase tracking-widest font-light leading-relaxed text-center">
                      By finalizing, you certify that you are an authorized representative of the above entity.
                    </p>
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
                    disabled={
                      (step === 1 && !formData.accessToken) ||
                      (step === 2 && (formData.consentText !== "I CONSENT" || !formData.agreedToTerms || !formData.agreedToNDA))
                    }
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
