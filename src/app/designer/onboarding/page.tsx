
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, 
  Check, 
  PencilRuler, 
  User, 
  Bell, 
  ArrowLeft, 
  X,
  Lock,
  Loader2,
  ShieldCheck,
  Compass
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useWhyteStore } from "@/store/use-whyte-store";

export default function DesignerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { designers } = useWhyteStore();
  
  const [formData, setFormData] = useState({
    accessCode: "",
    designerId: "",
    fullName: "",
    specialty: "",
    notifications: true
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1) {
      // Normalize input by removing extra whitespace and matching case
      const normalizedInput = formData.accessCode.trim().toUpperCase();
      const found = designers.find(d => d.accessToken.toUpperCase() === normalizedInput);
      
      if (found) {
        setFormData({
          ...formData,
          designerId: found.id,
          fullName: found.name,
          specialty: found.specialty
        });
        setStep(2);
      } else {
        toast({
          title: "Verification Failed",
          description: "Unique Access Token not recognized by the Master Registry. Please contact Senior Partners.",
          variant: "destructive"
        });
      }
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem("whyte_designer_onboarded", "true");
        localStorage.setItem("whyte_active_designer_id", formData.designerId);
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/designer");
        }, 3500);
      }, 2000);
    }
  };

  const handleBack = () => setStep(step - 1);

  if (!isMounted) return null;

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
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em]">Credentials Verified</span>
              <div className="h-px w-8 bg-white/20" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-5xl md:text-6xl font-headline text-white italic"
            >
              Access <span className="not-italic">Authorized.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-white/60 font-light text-lg italic leading-relaxed max-w-md mx-auto"
            >
              Synchronizing with the Creative Workbench... Your active site dossiers are being decrypted.
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
    <div className="min-h-screen bg-neutral-50/50 flex flex-col items-center justify-center p-6 font-body">
      <div className="max-w-4xl w-full">
        <div className="mb-16 text-center space-y-4">
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="h-px w-12 bg-accent/20" />
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.4em]">Creative Protocol</span>
            <div className="h-px w-12 bg-accent/20" />
          </div>
          <h1 className="text-6xl font-headline italic">Designer <span className="not-italic">Workbench.</span></h1>
          <p className="text-muted-foreground font-light text-lg italic">Authenticate your professional identity to access site deployment dossiers.</p>
        </div>

        <div className="mb-12 max-w-md mx-auto">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] font-bold text-accent/40 mb-3">
            <span>Protocol Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-accent/5 rounded-none" />
        </div>

        <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
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
                    <div className="space-y-4 text-center md:text-left">
                      <div className="h-14 w-14 bg-accent/5 flex items-center justify-center text-accent mb-8 rounded-none border border-accent/10">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h2 className="text-4xl font-headline italic">Identity Verification</h2>
                      <p className="text-muted-foreground font-light text-lg leading-relaxed max-w-xl">
                        Enter your unique 64-bit Access Token provided by the studio. This credential is required to synchronize your professional workbench.
                      </p>
                    </div>
                    <div className="space-y-6 max-w-lg">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">High-Entropy Access Token</Label>
                        <Input 
                          placeholder="XXXX-XXXX-XXXX" 
                          className="rounded-none border-neutral-200 h-16 text-xl md:text-2xl tracking-[0.2em] focus:ring-accent uppercase font-bold"
                          value={formData.accessCode}
                          onChange={(e) => setFormData({...formData, accessCode: e.target.value})}
                        />
                        <p className="text-[10px] text-muted-foreground italic uppercase tracking-widest mt-2">
                          Note: Tokens are case-insensitive but must match the studio registry exactly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="h-14 w-14 bg-accent/5 flex items-center justify-center text-accent mb-8 rounded-none border border-accent/10">
                        <Compass className="h-6 w-6" />
                      </div>
                      <h2 className="text-4xl font-headline italic">Professional Profile</h2>
                      <p className="text-muted-foreground font-light text-lg leading-relaxed">
                        Confirm your creative designation within the studio hierarchy.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Creative Identity</Label>
                        <Input 
                          className="rounded-none border-neutral-200 h-14 text-lg bg-neutral-50/50" 
                          value={formData.fullName}
                          readOnly
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Core Specialty</Label>
                        <Input 
                          className="rounded-none border-neutral-200 h-14 text-lg bg-neutral-50/50" 
                          value={formData.specialty}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="h-14 w-14 bg-accent/5 flex items-center justify-center text-accent mb-8 rounded-none border border-accent/10">
                        <Bell className="h-6 w-6" />
                      </div>
                      <h2 className="text-4xl font-headline italic">Deployment Alerts</h2>
                      <p className="text-muted-foreground font-light text-lg leading-relaxed">
                        Configure your notification protocols for critical site logs and administrative authorizations.
                      </p>
                    </div>
                    <div className="space-y-6 max-w-xl">
                      <div className="flex items-center justify-between p-8 border border-neutral-100 bg-neutral-50/30">
                        <div className="space-y-1">
                          <p className="text-base font-bold uppercase tracking-widest text-accent">Real-time Site Sync</p>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-light">Critical issue alerts & briefing approvals</p>
                        </div>
                        <div className="h-6 w-12 bg-accent rounded-full flex items-center px-1 cursor-pointer">
                          <div className="h-4 w-4 bg-white rounded-full ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-16 flex items-center justify-between border-t border-neutral-100 mt-16">
                  {step > 1 ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleBack}
                      className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[11px] flex items-center gap-3 transition-all"
                    >
                      <ArrowLeft className="h-4 w-4" /> Previous Protocol
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button 
                    onClick={handleNext}
                    disabled={step === 1 && !formData.accessCode}
                    className="bg-accent text-white hover:bg-accent/90 rounded-none h-16 px-16 uppercase tracking-[0.3em] transition-all min-w-[240px] text-[11px] font-bold shadow-2xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin" /> Finalizing...</span>
                    ) : (
                      <span className="flex items-center gap-3">
                        {step === totalSteps ? "Authorize Workspace" : "Continue"} <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>

        <p className="text-center mt-12 text-[10px] uppercase tracking-[0.6em] text-accent/20 font-bold">
          Whyte Interior Designs — Authorized Creative Leads Only
        </p>
      </div>
    </div>
  );
}
