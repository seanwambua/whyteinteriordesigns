"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  ChevronRight, 
  Check, 
  Briefcase, 
  User, 
  Bell, 
  Sparkles, 
  ArrowLeft, 
  X,
  Lock,
  Trophy,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { clientProjects } = useWhyteStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    projectRef: "",
    fullName: "",
    email: "",
    notifications: true
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 1) {
      const project = clientProjects.find(p => p.id.toUpperCase() === formData.projectRef.toUpperCase());
      if (project) {
        setFormData({
          ...formData,
          fullName: project.name,
          email: project.email
        });
        setStep(2);
      } else {
        toast({
          title: "Verification Failed",
          description: "Project Reference ID not found in studio archives. Please contact support.",
          variant: "destructive"
        });
      }
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem("whyte_onboarded", "true");
        localStorage.setItem("whyte_verified_project_id", formData.projectRef.toUpperCase());
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 4000);
      }, 2000);
    }
  };

  const handleBack = () => setStep(step - 1);

  if (!isMounted) return null;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-2xl"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="h-20 w-20 rounded-full border border-white/20 flex items-center justify-center bg-white/5 relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-white/40"
              />
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center items-center gap-4 mb-2"
            >
              <div className="h-px w-8 bg-white/20" />
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em]">Identity Synchronized</span>
              <div className="h-px w-8 bg-white/20" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-4xl md:text-5xl font-headline text-white italic"
            >
              Welcome to the <br /> <span className="not-italic">Inner Circle.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-white/60 font-light text-base italic leading-relaxed max-w-md mx-auto"
            >
              Your project archives are now unlocked. Transitioning you to your private command center...
            </motion.p>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "linear", delay: 1 }}
            className="h-0.5 bg-white/20 max-w-xs mx-auto overflow-hidden"
          >
            <div className="h-full bg-white w-full" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/5 flex flex-col items-center justify-center p-4 md:p-8 font-body">
      <div className="w-full max-w-3xl flex justify-end mb-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-accent/40 hover:text-accent hover:bg-transparent flex items-center gap-2 group">
              <span className="text-[10px] font-bold uppercase tracking-widest">Exit Session</span>
              <X className="h-4 w-4 transition-transform group-hover:rotate-90" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-none border-accent/20 font-body">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-accent/40" />
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Session Protection</span>
              </div>
              <AlertDialogTitle className="text-2xl font-headline italic">Interrupt the synchronization?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed">
                Exiting now will pause your digital transition. You will need to re-verify your project ID to access the private studio archives.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-6">
              <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[10px] font-bold h-12">Return to Process</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => router.push("/pricing")}
                className="bg-accent text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12 hover:bg-accent/90"
              >
                Exit Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="max-w-3xl w-full">
        <div className="mb-8 text-center space-y-2">
          <div className="flex justify-center items-center gap-4 mb-1">
            <div className="h-px w-8 bg-accent/20" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Digital Transition</span>
            <div className="h-px w-8 bg-accent/20" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline italic">Welcome to the <span className="not-italic">Studio.</span></h1>
          <p className="text-muted-foreground font-light text-base italic">Let's synchronize your existing project with our digital command center.</p>
        </div>

        <div className="mb-6 max-w-sm mx-auto">
          <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-accent/40 mb-1.5">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-accent/10 rounded-none" />
        </div>

        <Card className="rounded-none border-accent/10 shadow-xl bg-white overflow-hidden">
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
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-headline">Project Verification</h2>
                      <p className="text-muted-foreground font-light text-sm leading-relaxed">
                        Enter the unique Project Reference ID found on your initial design contract (e.g., WP-0082) to securely link your journey.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Reference ID</Label>
                        <Input 
                          placeholder="WP-XXXX" 
                          className="rounded-none border-accent/20 h-12 text-xl tracking-[0.2em] focus:ring-accent uppercase font-bold"
                          value={formData.projectRef}
                          onChange={(e) => setFormData({...formData, projectRef: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4">
                        <User className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-headline">Identity Sync</h2>
                      <p className="text-muted-foreground font-light text-sm leading-relaxed">
                        Please confirm the details we have on file for your Nairobi residency or commercial property.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Full Name</Label>
                        <Input 
                          className="rounded-none border-accent/20 h-12 focus:ring-accent bg-secondary/10" 
                          value={formData.fullName}
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Contact Email</Label>
                        <Input 
                          className="rounded-none border-accent/20 h-12 focus:ring-accent bg-secondary/10" 
                          value={formData.email}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4">
                        <Bell className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-headline">Studio Communications</h2>
                      <p className="text-muted-foreground font-light text-sm leading-relaxed">
                        Configure how you'd like to receive architectural updates, site reports, and milestone approvals.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-5 border border-accent/10 bg-accent/5">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold uppercase tracking-widest">Real-time Site Updates</p>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Receive SMS/Email for daily progress</p>
                        </div>
                        <div className="h-5 w-10 bg-accent rounded-full flex items-center px-1 cursor-pointer">
                          <div className="h-3 w-3 bg-white rounded-full ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-8 flex items-center justify-between border-t border-accent/5 mt-8">
                  {step > 1 ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleBack}
                      className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[9px] flex items-center gap-2 h-10"
                    >
                      <ArrowLeft className="h-3 w-3" /> Previous Step
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button 
                    onClick={handleNext}
                    disabled={step === 1 && !formData.projectRef}
                    className="bg-accent text-white hover:bg-accent/90 rounded-none h-12 px-10 uppercase tracking-[0.2em] transition-all min-w-[180px] text-[10px] font-bold shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Finalizing...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {step === totalSteps ? "Finalize Access" : "Continue"} <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>

        <p className="text-center mt-8 text-[9px] uppercase tracking-[0.5em] text-accent/30 font-bold">
          Exclusively for Whyte Interior Designs Clients
        </p>
      </div>
    </div>
  );
}
