
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
  LayoutList,
  AlertTriangle,
  RefreshCcw,
  Clock,
  Key,
  FileSearch,
  PenTool,
  TrendingUp,
  RotateCcw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { clientProjects, updateClientProject, addInquiry } = useWhyteStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    accessCode: "",
    fullName: "",
    email: "",
    agreedToTerms: false,
    agreedToNonCompete: false,
    depositRef: "",
    depositAmount: "",
    notifications: true,
    signature: ""
  });

  const [currentProject, setCurrentProject] = useState<ClientProject | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isReorgPending = currentProject?.reorganization?.status === 'Pending_Agreement' && !currentProject.reorganization.clientAgreed;
  const totalSteps = isReorgPending ? 5 : 4;
  const progress = (step / totalSteps) * 100;

  const getExpectedDeposit = () => {
    if (!currentProject) return 0;
    
    // If a reorg is pending agreement, we use the first installment from the PROPOSED plan
    if (isReorgPending && currentProject.reorganization?.proposedInstallments.length) {
      return currentProject.reorganization.proposedInstallments[0].amount;
    }

    const depositInstallment = currentProject.installments.find(i => i.label.toLowerCase().includes('deposit'));
    return depositInstallment?.amount || 0;
  };

  const expectedDeposit = getExpectedDeposit();
  const isAmountMatching = Number(formData.depositAmount) === expectedDeposit;

  const handleNext = () => {
    if (step === 1) {
      const normalizedCode = formData.accessCode.trim().toUpperCase();
      const project = clientProjects.find(p => p.accessCode.toUpperCase() === normalizedCode);
      
      if (project) {
        setCurrentProject(project);
        setFormData({
          ...formData,
          fullName: project.name,
          email: project.email
        });
        setStep(2);
      } else {
        toast({
          title: "Verification Failed",
          description: "Access Code not recognized. Please contact your Studio Manager.",
          variant: "destructive"
        });
      }
    } else if (step === 4 && isReorgPending) {
      // Formal Agreement Step
      if (formData.signature !== "AUTHORIZE") {
        toast({ title: "Authorization Mismatch", description: "Please type AUTHORIZE to digitally sign the new terms.", variant: "destructive" });
        return;
      }
      setStep(5);
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final Step Submission
      if (!isAmountMatching) {
        toast({
          title: "Protocol Mismatch",
          description: "Payment amount mismatch. Request a reorganization to proceed.",
          variant: "destructive"
        });
        return;
      }

      setLoading(true);
      setTimeout(() => {
        if (currentProject) {
          // If we were in a reorg approval flow, we mark the reorg as agreed
          const reorgUpdates = isReorgPending ? {
            reorganization: {
              ...currentProject.reorganization!,
              clientAgreed: true
            }
          } : {};

          updateClientProject(currentProject.id, {
            ...reorgUpdates,
            pendingActivationData: {
              amount: Number(formData.depositAmount),
              reference: formData.depositRef,
              timestamp: new Date().toISOString()
            },
            lastActivity: isReorgPending 
              ? "Client Onboarding: Restructuring Authorized & Final Deposit Logged" 
              : "Client Onboarding Executed — Awaiting Steward Sync"
          });
        }
        
        localStorage.setItem("whyte_onboarded", "true");
        localStorage.setItem("whyte_client_access_code", formData.accessCode.trim().toUpperCase());
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 5000);
      }, 2000);
    }
  };

  const handleRequestReorg = () => {
    if (!currentProject) return;
    
    setLoading(true);
    const reorgInquiry = {
      id: `REQ-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name: formData.fullName,
      email: formData.email,
      type: 'financial_reorganization' as const,
      serviceType: 'bundle' as const,
      message: `Onboarding Phase: Financing Reorganization Request. Reported Capital: KES ${Number(formData.depositAmount).toLocaleString()}. Reference Provided: ${formData.depositRef || 'N/A'}. Reason: Amount mismatch with projected protocol.`,
      status: 'new' as const,
      urgency: 'critical' as const,
      date: format(new Date(), "MMM dd, yyyy"),
      projectId: currentProject.id
    };
    
    setTimeout(() => {
      addInquiry(reorgInquiry);
      updateClientProject(currentProject.id, {
        reorganization: {
          status: 'Requested',
          requestedBy: 'Client',
          terms: `Initial Onboarding Mismatch: Client reports KES ${Number(formData.depositAmount).toLocaleString()} paid vs KES ${expectedDeposit.toLocaleString()} expected.`,
          proposedInstallments: [],
          clientAgreed: false,
          stewardWitnessed: false
        },
        lastActivity: "Financing Reorganization Requested during Onboarding"
      });
      
      localStorage.setItem("whyte_onboarded", "true");
      localStorage.setItem("whyte_client_access_code", formData.accessCode.trim().toUpperCase());
      
      setLoading(false);
      toast({ 
        title: "Request Transmitted", 
        description: "Your financing review has been prioritized. Decrypting portal access..." 
      });
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 5000);
    }, 1500);
  };

  const handleBack = () => setStep(step - 1);

  if (!isMounted) return null;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center p-6 overflow-hidden font-body text-white">
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
            <div className="h-20 w-20 rounded-none border border-white/20 flex items-center justify-center bg-white/5 relative">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-none border border-white/40" />
              <Clock className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          
          <div className="space-y-2">
            <div className="flex justify-center items-center gap-4 mb-2">
              <div className="h-px w-8 bg-white/20" />
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em]">Authorization Pending</span>
              <div className="h-px w-8 bg-white/20" />
            </div>
            <h2 className="text-4xl md:text-5xl font-headline italic">Credentials <span className="not-italic">Submitted.</span></h2>
            <p className="text-white/60 font-light text-base italic leading-relaxed max-w-md mx-auto">
              Your identity has been synchronized. The workspace will unlock once forensic verification is complete by the studio steward.
            </p>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear", delay: 1 }}
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
            <Button variant="ghost" className="text-accent/40 hover:text-accent hover:bg-transparent flex items-center gap-2 group transition-none">
              <span className="text-[10px] font-bold uppercase tracking-widest">Exit Session</span>
              <X className="h-4 w-4 transition-none" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-none border-accent/20 font-body">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Lock className="h-4 w-4 text-accent/40" /><span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Security</span></div>
              <AlertDialogTitle className="text-2xl font-headline italic">Interrupt synchronization?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed">Exiting will pause your digital transition.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-6">
              <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[10px] font-bold h-12 shadow-none transition-none">Return</AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push("/")} className="bg-accent text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12 shadow-none border-none transition-none">Exit</AlertDialogAction>
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
        </div>

        <div className="mb-6 max-w-sm mx-auto">
          <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-accent/40 mb-1.5">
            <span>Protocol Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1 bg-accent/10 rounded-none" />
        </div>

        <Card className="rounded-none border-accent/10 shadow-xl bg-white overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
              <CardContent className="p-8 md:p-12">
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4 border border-accent/10"><Key className="h-5 w-5" /></div>
                      <h2 className="text-2xl font-headline italic">Portfolio Access Code</h2>
                      <p className="text-muted-foreground font-light text-sm max-w-xl">Enter your unique identity code found on your master architectural contract (e.g., KIBET-AUTH-99X1).</p>
                    </div>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Client Access Code</Label>
                        <Input 
                          placeholder="CLIENT-AUTH-XXXX" 
                          className="rounded-none border-accent/20 h-12 text-xl tracking-[0.2em] focus:ring-accent uppercase font-bold shadow-none transition-none" 
                          value={formData.accessCode} 
                          onChange={(e) => setFormData({...formData, accessCode: e.target.value})} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4 border border-accent/10"><User className="h-5 w-5" /></div>
                      <h2 className="text-2xl font-headline italic">Identity Sync</h2>
                      <p className="text-muted-foreground font-light text-sm">Confirm your registration details for this code.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-accent/5">
                      <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Full Name</Label><Input className="rounded-none border-accent/20 h-12 bg-secondary/10 shadow-none transition-none" value={formData.fullName} readOnly /></div>
                      <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email</Label><Input className="rounded-none border-accent/20 h-12 bg-secondary/10 shadow-none transition-none" value={formData.email} readOnly /></div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4 border border-accent/10"><ShieldCheck className="h-5 w-5" /></div>
                      <h2 className="text-2xl font-headline italic">Governance Protocol</h2>
                      <p className="text-muted-foreground font-light text-sm">Authorize the legal and operational mandates.</p>
                    </div>
                    <div className="space-y-6">
                      <ScrollArea className="h-40 w-full border border-accent/10 p-6 bg-secondary/5">
                        <div className="text-[11px] font-light leading-relaxed text-accent/70 space-y-4 italic">
                          <p><strong>1. Architectural Lead:</strong> Whyte Interiors maintains total artistic lead over architectural site protocols.</p>
                          <p><strong>2. Financial Integrity:</strong> Capital realization occurs strictly via the authorized payment plan synchronized in this portal.</p>
                          <p><strong>3. Data Sovereignty:</strong> Plans and site logs are protected assets of the Studio.</p>
                          <p><strong>4. Non-Compete:</strong> Refrain from engaging trade partners directly outside the synchronized ecosystem.</p>
                        </div>
                      </ScrollArea>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-3"><Checkbox id="terms" checked={formData.agreedToTerms} onCheckedChange={(v) => setFormData({...formData, agreedToTerms: !!v})} className="rounded-none border-accent/30 transition-none" /><label htmlFor="terms" className="text-[11px] font-bold uppercase tracking-widest text-accent/60 cursor-pointer">I authorize the Terms of Service</label></div>
                        <div className="flex items-center space-x-3"><Checkbox id="non-compete" checked={formData.agreedToNonCompete} onCheckedChange={(v) => setFormData({...formData, agreedToNonCompete: !!v})} className="rounded-none border-accent/30 transition-none" /><label htmlFor="non-compete" className="text-[11px] font-bold uppercase tracking-widest text-accent/60 cursor-pointer">I authorize the Non-Compete Mandate</label></div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && isReorgPending && (
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-orange-50 flex items-center justify-center text-orange-600 mb-4 border border-orange-100"><FileSearch className="h-5 w-5" /></div>
                      <h2 className="text-2xl font-headline italic text-orange-600">Restructuring Review</h2>
                      <p className="text-muted-foreground font-light text-sm">Review the proposed financing reorganization for your commission.</p>
                    </div>
                    
                    <div className="space-y-10">
                      <div className="p-8 bg-secondary/30 border border-accent/5 space-y-4">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Agreement Rationale</Label>
                        <p className="text-lg font-light italic leading-relaxed text-accent/80 border-l-2 border-accent/20 pl-8">
                          "{currentProject?.reorganization?.terms}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {currentProject?.reorganization?.studioClaim && (
                          <div className="p-6 border border-orange-200 bg-orange-50/30 space-y-3">
                            <div className="flex items-center gap-3"><TrendingUp className="h-4 w-4 text-orange-600" /><span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Studio Claim</span></div>
                            <p className="text-[11px] italic font-light">"{currentProject.reorganization.studioClaim.rationale}"</p>
                            <p className="text-xl font-headline text-orange-700">+ KES {currentProject.reorganization.studioClaim.amount.toLocaleString()}</p>
                          </div>
                        )}
                        {currentProject?.reorganization?.reimbursement && (
                          <div className="p-6 border border-blue-200 bg-blue-50/30 space-y-3">
                            <div className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-blue-600" /><span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Credit Return</span></div>
                            <p className="text-[11px] italic font-light">"{currentProject.reorganization.reimbursement.rationale}"</p>
                            <p className="text-xl font-headline text-blue-700">- KES {currentProject.reorganization.reimbursement.amount.toLocaleString()}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Proposed Payout Schedule</Label>
                        <div className="divide-y divide-accent/5 border border-accent/5">
                          {currentProject?.reorganization?.proposedInstallments.map((ins, i) => (
                            <div key={i} className="p-4 flex justify-between items-center bg-white">
                              <span className="text-[11px] font-bold uppercase tracking-widest">{ins.label}</span>
                              <span className="text-sm font-headline italic">KES {ins.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-accent/10 space-y-4">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent block text-center">Digital Authorization</Label>
                        <Input 
                          placeholder="TYPE AUTHORIZE TO SIGN" 
                          value={formData.signature}
                          onChange={(e) => setFormData({...formData, signature: e.target.value.toUpperCase()})}
                          className="rounded-none h-14 border-accent/20 text-center font-headline italic text-xl tracking-widest shadow-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {((step === 4 && !isReorgPending) || (step === 5 && isReorgPending)) && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="h-10 w-10 bg-accent/5 flex items-center justify-center text-accent mb-4 border border-accent/10"><Banknote className="h-5 w-5" /></div>
                      <h2 className="text-2xl font-headline italic">Capital Verification</h2>
                      <p className="text-muted-foreground font-light text-sm">Provide transaction details for the initial deposit of your {isReorgPending ? 'restructured' : 'primary'} commission.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-accent/[0.03] border border-accent/5">
                      <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Amount (KES)</Label><Input type="number" placeholder="0.00" className="rounded-none border-accent/20 h-12 text-xl focus:ring-accent shadow-none transition-none" value={formData.depositAmount} onChange={(e) => setFormData({...formData, depositAmount: e.target.value})} /></div>
                      <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Requirement</Label><div className="h-12 flex items-center px-4 bg-secondary/20"><span className="text-lg font-headline italic text-accent opacity-60">KES {expectedDeposit.toLocaleString()}</span></div></div>
                    </div>
                    <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Reference Code</Label><Input placeholder="TRX-XXXX" className="rounded-none border-accent/20 h-12 text-lg tracking-widest focus:ring-accent uppercase font-bold shadow-none transition-none" value={formData.depositRef} onChange={(e) => setFormData({...formData, depositRef: e.target.value})} /></div>
                    {!isAmountMatching && formData.depositAmount !== "" && (
                      <div className="p-6 bg-orange-50 border border-orange-200 space-y-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                          <p className="text-[11px] italic text-orange-700 leading-relaxed font-light">
                            Protocol Variance Identified: The reported amount does not match the {isReorgPending ? 'restructured' : 'projected'} requirement. To proceed, please request a **Financing Reorganization** for forensic review.
                          </p>
                        </div>
                        <Button 
                          onClick={handleRequestReorg} 
                          disabled={loading}
                          variant="outline" 
                          className="w-full rounded-none border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white transition-none h-12 uppercase tracking-widest text-[10px] font-bold flex gap-2"
                        >
                          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <><RefreshCcw className="h-3 w-3" /> Initialize Reorganization Review</>}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-8 flex items-center justify-between border-t border-accent/10 mt-8">
                  {step > 1 ? <Button variant="ghost" onClick={handleBack} className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 h-10 px-0 transition-none shadow-none bg-transparent"> <ArrowLeft className="h-3 w-3" /> Back</Button> : <div />}
                  <Button onClick={handleNext} disabled={loading || (step === 1 && !formData.accessCode) || (step === 3 && (!formData.agreedToTerms || !formData.agreedToNonCompete)) || (step === totalSteps && (!formData.depositRef || !formData.depositAmount || (!isAmountMatching && formData.depositAmount !== "")))} className="bg-accent text-white rounded-none h-12 px-10 uppercase tracking-[0.2em] text-[10px] font-bold shadow-xl border-none transition-none">
                    {loading ? <span className="flex items-center gap-3"><Loader2 className="h-4 w-4 animate-spin" /> Syncing...</span> : <span className="flex items-center gap-3">{step === totalSteps ? "Authorize & Finalize" : "Continue Protocol"} <ChevronRight className="h-4 w-4" /></span>}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
