
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
    agreedToNonCompete: false,
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
      if (formData.agreedToTerms && formData.agreedToNDA && formData.agreedToNonCompete && formData.consentText === "I CONSENT") {
        setStep(3);
      } else {
        toast({
          title: "Legal Protocol Incomplete",
          description: "You must authorize all mandates and explicitly type 'I CONSENT' to proceed.",
          variant: "destructive"
        });
      }
    } else {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem("whyte_steward_onboarded", "true");
        localStorage.setItem("whyte_active_steward_id", formData.stewardId);
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
      <div className="min-h-screen bg-accent flex items-center justify-center p-6 overflow-hidden font-body">
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
              <ShieldCheck className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center items-center gap-6 mb-2"
            >
              <div className="h-px w-12 bg-white/20" />
              <span className="text-white/40 text-[11px] font-bold uppercase tracking-[0.6em]">Registry Link Established</span>
              <div className="h-px w-12 bg-white/20" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-5xl md:text-6xl font-headline text-white italic leading-tight"
            >
              Stewardship <span className="not-italic">Activated.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-white/60 font-light text-xl italic leading-relaxed max-w-lg mx-auto"
            >
              The forensic workbench is now active. All assigned dossiers have been decrypted for your entity.
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
    <div className="min-h-screen bg-secondary/10 flex flex-col items-center justify-center p-4 md:p-12 font-body">
      <div className="max-w-4xl w-full">
        <div className="mb-12 text-center space-y-4">
          <div className="flex justify-center items-center gap-6 mb-2">
            <div className="h-px w-16 bg-accent/20" />
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.5em]">Governance Protocol</span>
            <div className="h-px w-16 bg-accent/20" />
          </div>
          <h1 className="text-5xl md:text-6xl font-headline italic leading-tight">Steward <span className="not-italic">Verification.</span></h1>
          <p className="text-muted-foreground font-light text-xl italic max-w-2xl mx-auto leading-relaxed">Authenticate your professional entity to access the private studio auditing terminal.</p>
        </div>

        <div className="mb-10 max-w-sm mx-auto">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 mb-2">
            <span>Protocol Stage {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-accent/10 rounded-none" />
        </div>

        <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <CardContent className="p-10 md:p-16 lg:p-24">
                {step === 1 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="h-16 w-16 bg-accent/5 flex items-center justify-center text-accent mb-8 border border-accent/10 shadow-inner">
                        <Lock className="h-8 w-8" />
                      </div>
                      <h2 className="text-4xl font-headline italic">Stewardship Code</h2>
                      <p className="text-muted-foreground font-light text-lg leading-relaxed max-w-2xl">
                        Enter the high-entropy Stewardship Code provided by Senior Partners to securely synchronize your professional identity.
                      </p>
                    </div>
                    <div className="space-y-6 max-w-lg">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Authorized Code Registry</Label>
                        <Input 
                          placeholder="WHYTE-STWD-XXXX-XXXX" 
                          className="rounded-none border-accent/10 h-16 text-2xl md:text-3xl tracking-[0.15em] focus:ring-accent uppercase font-bold shadow-none bg-accent/[0.01]"
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
                      <div className="h-16 w-16 bg-accent/5 flex items-center justify-center text-accent mb-8 border border-accent/10 shadow-inner">
                        <Scale className="h-8 w-8" />
                      </div>
                      <h2 className="text-4xl font-headline italic">Ethics & Legal Protocol</h2>
                      <p className="text-muted-foreground font-light text-lg leading-relaxed">
                        Authorize the professional frameworks and ethical mandates governing your oversight of the studio ledger.
                      </p>
                    </div>
                    
                    <div className="space-y-10">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Forensic Mandates</Label>
                        <ScrollArea className="h-64 w-full border border-accent/10 p-10 bg-accent/[0.01] shadow-inner">
                          <div className="text-[13px] font-light leading-relaxed text-accent/70 space-y-6 italic">
                            <p><strong>1. Forensic Integrity:</strong> The Steward must perform all audits with uncompromising accuracy and professional skepticism.</p>
                            <p><strong>2. Conflict Disclosure:</strong> Stewards must declare any commercial interest in site trade partners or material suppliers.</p>
                            <p><strong>3. Confidentiality Mandate:</strong> All financial data, client identities, and site cost allocations are proprietary assets of the Studio.</p>
                            <p><strong>4. Data Sovereignty:</strong> No data extracted may be reproduced or transmitted outside the authorized reconciliation cycle.</p>
                            <p><strong>5. Impasse Resolution:</strong> Any discrepancies must be escalated to the Senior Partner panel for immediate forensic resolution.</p>
                            <p><strong>6. Non-Compete Protocol:</strong> The Steward is prohibited from providing independent financial advisory or audit services to studio-authorized trade partners or clients outside the ecosystem for the duration of the commission cycle.</p>
                          </div>
                        </ScrollArea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        <div className="flex items-center space-x-4 p-6 border border-accent/5 bg-accent/[0.01] hover:bg-accent/5 transition-all cursor-pointer group" onClick={() => setFormData({...formData, agreedToTerms: !formData.agreedToTerms})}>
                          <Checkbox checked={formData.agreedToTerms} className="rounded-none border-accent/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                          <label className="text-[10px] font-bold uppercase tracking-widest text-accent/60 group-hover:text-accent transition-colors">Terms of Service</label>
                        </div>
                        <div className="flex items-center space-x-4 p-6 border border-accent/5 bg-accent/[0.01] hover:bg-accent/5 transition-all cursor-pointer group" onClick={() => setFormData({...formData, agreedToNDA: !formData.agreedToNDA})}>
                          <Checkbox checked={formData.agreedToNDA} className="rounded-none border-accent/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                          <label className="text-[10px] font-bold uppercase tracking-widest text-accent/60 group-hover:text-accent transition-colors">Digital NDA</label>
                        </div>
                        <div className="flex items-center space-x-4 p-6 border border-accent/5 bg-accent/[0.01] hover:bg-accent/5 transition-all cursor-pointer group" onClick={() => setFormData({...formData, agreedToNonCompete: !formData.agreedToNonCompete})}>
                          <Checkbox checked={formData.agreedToNonCompete} className="rounded-none border-accent/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                          <label className="text-[10px] font-bold uppercase tracking-widest text-accent/60 group-hover:text-accent transition-colors">Non-Compete</label>
                        </div>
                      </div>

                      <div className="space-y-4 pt-8 border-t border-accent/5">
                        <Label className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent text-center block">Type "I CONSENT" to authorize professional mandates</Label>
                        <Input 
                          placeholder="I CONSENT"
                          value={formData.consentText}
                          onChange={(e) => setFormData({...formData, consentText: e.target.value})}
                          className="rounded-none border-accent/10 h-16 uppercase font-bold tracking-[0.3em] text-center text-xl focus:ring-accent bg-accent/[0.01] shadow-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="h-16 w-16 bg-accent/5 flex items-center justify-center text-accent mb-8 border border-accent/10 shadow-inner">
                        <BadgeCheck className="h-8 w-8" />
                      </div>
                      <h2 className="text-4xl font-headline italic">Entity Confirmation</h2>
                      <p className="text-muted-foreground font-light text-lg leading-relaxed">
                        Authorize the terminal decryption under the following professional identity.
                      </p>
                    </div>

                    <div className="p-12 border border-accent/10 bg-accent/[0.02] space-y-10 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 p-6 opacity-5"><Landmark className="h-48 w-48" /></div>
                      <div className="flex items-center gap-10 relative z-10">
                        <div className="h-24 w-24 bg-accent text-white flex items-center justify-center font-headline italic text-4xl shadow-2xl">
                          {formData.stewardName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="space-y-2">
                          <span className="text-[12px] font-bold text-accent/40 uppercase tracking-[0.5em]">{formData.stewardId}</span>
                          <h3 className="text-4xl font-headline italic text-accent leading-tight">{formData.stewardName}</h3>
                          <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[10px] font-bold py-2 px-6 mt-4 shadow-xl">AUTHORIZED STEWARDSHIP ENTITY</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-accent/5 relative z-10">
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-widest font-bold text-accent/40">Credential Verification</p>
                          <p className="text-[15px] font-bold uppercase tracking-widest text-accent flex items-center gap-3">
                            <BadgeCheck className="h-4.5 w-4.5 opacity-40" /> Verified {formData.authorizedDate}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[11px] uppercase tracking-widest font-bold text-accent/40">Professional Designation</p>
                          <p className="text-[15px] font-bold uppercase tracking-widest text-accent flex items-center gap-3">
                            <Award className="h-4.5 w-4.5 opacity-40" /> Senior Financial Auditor
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-accent/40 italic uppercase tracking-[0.4em] font-bold leading-relaxed text-center">
                      Certification signifies professional synchronization with the Master Studio Ledger.
                    </p>
                  </div>
                )}

                <div className="pt-12 flex items-center justify-between border-t border-accent/10 mt-12">
                  {step > 1 ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleBack}
                      className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[11px] flex items-center gap-3 h-12 transition-all px-0"
                    >
                      <ArrowLeft className="h-4 w-4" /> Previous Protocol
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button 
                    onClick={handleNext}
                    disabled={
                      (step === 1 && !formData.accessToken) ||
                      (step === 2 && (formData.consentText !== "I CONSENT" || !formData.agreedToTerms || !formData.agreedToNDA || !formData.agreedToNonCompete))
                    }
                    className="bg-accent text-white hover:bg-accent/90 rounded-none h-16 px-16 uppercase tracking-[0.4em] transition-all min-w-[250px] text-[11px] font-bold shadow-2xl hover:tracking-[0.5em]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-4"><Loader2 className="h-5 w-5 animate-spin" /> Synchronizing...</span>
                    ) : (
                      <span className="flex items-center gap-4">
                        {step === totalSteps ? "Synchronize Terminal" : "Continue"} <ChevronRight className="h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>

        <p className="text-center mt-12 text-[10px] uppercase tracking-[0.8em] text-accent/20 font-bold">
          Whyte Interior Designs — Nairobi Studio HQ — Stewardship Verification
        </p>
      </div>
    </div>
  );
}
