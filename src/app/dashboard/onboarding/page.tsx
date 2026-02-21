
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Check, Briefcase, User, Bell, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    projectRef: "",
    fullName: "Valued Client",
    email: "client@example.com",
    notifications: true
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  const handleBack = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-secondary/5 flex items-center justify-center p-6 font-body">
      <div className="max-w-4xl w-full">
        <div className="mb-12 text-center space-y-4">
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="h-px w-8 bg-accent/20" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Digital Transition</span>
            <div className="h-px w-8 bg-accent/20" />
          </div>
          <h1 className="text-5xl font-headline italic">Welcome to the <span className="not-italic">Studio.</span></h1>
          <p className="text-muted-foreground font-light text-lg italic">Let's synchronize your existing project with our digital command center.</p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-accent/40 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-1 bg-accent/10 rounded-none" />
        </div>

        <Card className="rounded-none border-accent/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] bg-white overflow-hidden">
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
                      <div className="h-12 w-12 bg-accent/5 flex items-center justify-center text-accent mb-6">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <h2 className="text-3xl font-headline">Project Verification</h2>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        Enter the unique Project Reference ID found on your initial design contract (e.g., WP-0082) to securely link your journey.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Reference ID</Label>
                        <Input 
                          placeholder="WP-XXXX" 
                          className="rounded-none border-accent/20 h-14 text-xl tracking-[0.2em] focus:ring-accent uppercase"
                          value={formData.projectRef}
                          onChange={(e) => setFormData({...formData, projectRef: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="h-12 w-12 bg-accent/5 flex items-center justify-center text-accent mb-6">
                        <User className="h-6 w-6" />
                      </div>
                      <h2 className="text-3xl font-headline">Identity Sync</h2>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        Please confirm the details we have on file for your Nairobi residency or commercial property.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Full Name</Label>
                        <Input 
                          className="rounded-none border-accent/20 h-12 focus:ring-accent" 
                          value={formData.fullName}
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Contact Email</Label>
                        <Input 
                          className="rounded-none border-accent/20 h-12 focus:ring-accent" 
                          value={formData.email}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="h-12 w-12 bg-accent/5 flex items-center justify-center text-accent mb-6">
                        <Bell className="h-6 w-6" />
                      </div>
                      <h2 className="text-3xl font-headline">Studio Communications</h2>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        Configure how you'd like to receive architectural updates, site reports, and milestone approvals.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 border border-accent/10 bg-accent/5">
                        <div className="space-y-1">
                          <p className="text-sm font-bold uppercase tracking-widest">Real-time Site Updates</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Receive SMS/Email for daily progress</p>
                        </div>
                        <div className="h-6 w-12 bg-accent rounded-full flex items-center px-1">
                          <div className="h-4 w-4 bg-white rounded-full ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-16 flex items-center justify-between border-t border-accent/5 mt-16">
                  {step > 1 ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleBack}
                      className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[10px] flex items-center gap-2"
                    >
                      <ArrowLeft className="h-3 w-3" /> Previous Step
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button 
                    onClick={handleNext}
                    disabled={step === 1 && !formData.projectRef}
                    className="bg-accent text-white hover:bg-accent/90 rounded-none h-14 px-12 uppercase tracking-[0.2em] transition-all min-w-[200px]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">Synchronizing...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {step === totalSteps ? "Finalize Access" : "Continue"} <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>

        <p className="text-center mt-12 text-[10px] uppercase tracking-[0.5em] text-accent/30 font-bold">
          Exclusively for Whyte Interior Designs Clients
        </p>
      </div>
    </div>
  );
}
