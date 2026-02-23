
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
  Loader2,
  ShieldCheck,
  Scale,
  Banknote,
  FileText,
  Handshake,
  LayoutList
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
    agreedToTerms: false,
    agreedToNDA: false,
    depositRef: "",
    notifications: true
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalSteps = 4;
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
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em]">Dossier Synchronized</span>
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
              Your governance and financial protocols are now established. Transitioning you to your workspace...
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
                onClick={() => router.push("/")}
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
          <h1 className="text-4xl md:text-5xl font-headline italic">Portal <span className="not-italic">Authorization.</span></h1>
          <p className="text-muted-foreground font-light text-base italic">Establishing the governance and financial framework for your commission.</p>
        </div>

        <div className="mb-6 max-w-sm mx-auto">
          <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-accent/40 mb-1.5">
            <span>Protocol Stage {step} of {totalSteps}</span>
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
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4 border border-accent/10">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-headline italic">Project Verification</h2>
                      <p className="text-muted-foreground font-light text-sm leading-relaxed">
                        Enter the unique Project Reference ID found on your design contract (e.g., WP-0082) to securely link your commission dossier.
                      </p>
                    </div>
                    <div className="space-y-4 max-w-md">
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
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4 border border-accent/10">
                        <User className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-headline italic">Identity & Communications</h2>
                      <p className="text-muted-foreground font-light text-sm leading-relaxed">
                        Confirm your registration details and set your preferred site synchronization protocols.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-accent/5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Full Name</Label>
                        <Input className="rounded-none border-accent/20 h-12 bg-secondary/10" value={formData.fullName} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Contact Email</Label>
                        <Input className="rounded-none border-accent/20 h-12 bg-secondary/10" value={formData.email} readOnly />
                      </div>
                    </div>

                    <div className="space-y-4 max-w-lg">
                      <div className="flex items-center justify-between p-6 border border-accent/10 bg-accent/5">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold uppercase tracking-widest">Real-time Site Updates</p>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-light italic">Receive notifications for critical site protocols</p>
                        </div>
                        <div className="h-5 w-10 bg-accent rounded-full flex items-center px-1 cursor-pointer">
                          <div className="h-3 w-3 bg-white rounded-full ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4 border border-accent/10">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-headline italic">Governance Protocol</h2>
                      <p className="text-muted-foreground font-light text-sm leading-relaxed">
                        Authorize the legal and operational mandates governing your collaboration with Whyte Interior Designs.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Studio Mandates & Privacy</Label>
                        <ScrollArea className="h-48 w-full border border-accent/10 p-6 bg-secondary/5">
                          <div className="text-[11px] font-light leading-relaxed text-accent/70 space-y-4 italic">
                            <p><strong>1. Architectural Lead:</strong> The client acknowledges that Whyte Interior Designs maintains total artistic lead over architectural site protocols to realize the creative brief.</p>
                            <p><strong>2. Financial Integrity:</strong> Capital realization occurs strictly via the authorized payment plan synchronized in this portal. Any reorganization requires formal multi-party agreement.</p>
                            <p><strong>3. Data Sovereignty:</strong> All architectural plans, material registries, and site log metadata are protected under the Studio's Digital Sovereignty protocol.</p>
                            <p><strong>4. Quality Sign-off:</strong> Final handover is subject to a forensic audit by our assigned Financial Steward.</p>
                          </div>
                        </ScrollArea>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id="terms" 
                            checked={formData.agreedToTerms} 
                            onCheckedChange={(v) => setFormData({...formData, agreedToTerms: !!v})}
                            className="rounded-none border-accent/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                          />
                          <label htmlFor="terms" className="text-[11px] font-bold uppercase tracking-widest text-accent/60 cursor-pointer">
                            I authorize the Standard Studio Terms of Service
                          </label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id="nda" 
                            checked={formData.agreedToNDA} 
                            onCheckedChange={(v) => setFormData({...formData, agreedToNDA: !!v})}
                            className="rounded-none border-accent/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                          />
                          <label htmlFor="nda" className="text-[11px] font-bold uppercase tracking-widest text-accent/60 cursor-pointer">
                            I execute the Non-Disclosure Agreement (NDA)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4 border border-accent/10">
                        <Banknote className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-headline italic">Initial Capital Verification</h2>
                      <p className="text-muted-foreground font-light text-sm leading-relaxed">
                        To finalize dossier synchronization, please provide the transaction reference code for your initial commission deposit.
                      </p>
                    </div>
                    
                    <div className="p-8 bg-accent/[0.03] border border-accent/5 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Authorized Transaction Reference</Label>
                        <Input 
                          placeholder="E.g., TRX-9921-WHYTE" 
                          className="rounded-none border-accent/20 h-14 text-xl tracking-[0.2em] focus:ring-accent uppercase font-bold"
                          value={formData.depositRef}
                          onChange={(e) => setFormData({...formData, depositRef: e.target.value})}
                        />
                        <p className="text-[9px] text-muted-foreground italic uppercase tracking-widest mt-2">
                          This reference will be validated by the Financial Steward to unlock your full workspace.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 border border-dashed border-accent/20 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 italic">
                        Verification establishes the legally binding start of the commission lifecycle.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-10 flex items-center justify-between border-t border-accent/10 mt-10">
                  {step > 1 ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleBack}
                      className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 h-10 transition-all"
                    >
                      <ArrowLeft className="h-3 w-3" /> Previous Protocol
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button 
                    onClick={handleNext}
                    disabled={
                      (step === 1 && !formData.projectRef) || 
                      (step === 3 && (!formData.agreedToTerms || !formData.agreedToNDA)) ||
                      (step === 4 && !formData.depositRef)
                    }
                    className="bg-accent text-white hover:bg-accent/90 rounded-none h-14 px-12 uppercase tracking-[0.3em] transition-all min-w-[200px] text-[10px] font-bold shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3"><Loader2 className="h-4 w-4 animate-spin" /> Synchronizing...</span>
                    ) : (
                      <span className="flex items-center gap-3">
                        {step === totalSteps ? "Finalize Synchronization" : "Continue"} <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>

        <p className="text-center mt-10 text-[9px] uppercase tracking-[0.6em] text-accent/20 font-bold">
          Whyte Interior Designs — Nairobi Studio HQ — Secure Protocol
        </p>
      </div>
    </div>
  );
}
