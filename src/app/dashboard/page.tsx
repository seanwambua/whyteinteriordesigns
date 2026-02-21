
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MessageSquare, 
  Clock, 
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
  Flag,
  XCircle,
  ArrowRight,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ClientSupportDialog } from "@/components/dashboard/client-support-dialog";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";

export default function ClientDashboardPage() {
  const { clientProjects } = useWhyteStore();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportType, setSupportType] = useState<"project_support" | "complaint" | "termination_request">("project_support");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const onboarded = localStorage.getItem("whyte_onboarded") === "true";
    setIsOnboarded(onboarded);
  }, []);

  if (!isMounted) return null;

  // For the client dashboard, we'll show the first activated project found
  // In a real auth scenario, this would filter by the user's specific project ID
  const activeProject = clientProjects.find(p => p.isActivated) || clientProjects[0];

  if (!activeProject) {
    return (
      <div className="max-w-6xl mx-auto py-24 text-center space-y-8 font-body">
        <h2 className="text-4xl font-headline italic">No active journey found.</h2>
        <p className="text-muted-foreground font-light">Please complete your project initialization or verification.</p>
        <Button asChild className="bg-accent text-white rounded-none h-14 px-12">
          <Link href="/dashboard/onboarding">Initialize Journey</Link>
        </Button>
      </div>
    );
  }

  const openSupport = (type: "project_support" | "complaint" | "termination_request") => {
    setSupportType(type);
    setIsSupportOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 font-body">
      {!isOnboarded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-white shadow-2xl"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-5 w-5 text-white/60" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Digital Welcome</span>
            </div>
            <h3 className="text-3xl font-headline italic">Complete Your Digital Transition.</h3>
            <p className="text-white/70 font-light max-w-xl text-sm leading-relaxed">
              Activate your full suite of studio tools to track real-time architectural progress and site logistics.
            </p>
          </div>
          <Button asChild className="bg-white text-accent hover:bg-white/90 rounded-none h-14 px-10 uppercase tracking-[0.2em] shrink-0">
            <Link href="/dashboard/onboarding">Start Onboarding</Link>
          </Button>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Client Portal — Nairobi Studio</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-6xl font-headline">The <span className="italic">Evolution.</span></h1>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
            <span className="text-lg font-headline italic text-accent">{activeProject.tier} Commission</span>
            <span className="text-[9px] uppercase tracking-widest text-accent/30 block mt-1">Status: {activeProject.status}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card className="rounded-none border-accent/10 shadow-2xl overflow-hidden bg-white">
              <div className="bg-accent h-1.5 w-full" />
              <CardHeader className="p-10 pb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.5em] block mb-2">{activeProject.id}</span>
                    <CardTitle className="text-4xl font-headline italic">{activeProject.project}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.4em] font-bold text-accent/60">
                    <span>Implementation Velocity</span>
                    <span>{activeProject.progress}%</span>
                  </div>
                  <Progress value={activeProject.progress} className="h-1 bg-secondary rounded-none" />
                </div>

                <div className="p-8 bg-secondary/30 border-l-2 border-accent italic">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2 mb-4">
                    <Clock className="h-3 w-3" /> Latest Site Entry
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-accent/80">
                    "{activeProject.lastActivity || 'Project synchronization active.'}"
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Flag className="h-4 w-4 text-accent" />
              <h2 className="text-2xl font-headline italic">Architectural Roadmap</h2>
            </div>
            
            <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-accent/10">
              {activeProject.milestones.map((milestone, idx) => (
                <div key={idx} className="relative group">
                  <div className={`absolute -left-10 top-1 h-6 w-6 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors ${
                    milestone.isCompleted ? 'border-accent bg-accent text-white' : 'border-accent/20 text-accent/20'
                  }`}>
                    {milestone.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4 fill-current" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-bold uppercase tracking-widest ${milestone.isCompleted ? 'text-accent' : 'text-accent/40'}`}>
                        {milestone.label}
                      </h4>
                      <span className="text-[10px] font-bold text-accent/30">{milestone.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-lg italic">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-none border-accent/5 shadow-xl bg-white p-8 space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 text-center">Financial Expectation</h3>
            
            <div className="space-y-4">
              {activeProject.installments.map((ins, i) => (
                <div key={i} className={`p-4 border ${ins.status === 'Paid' ? 'border-green-600/20 bg-green-600/5' : 'border-accent/10 bg-secondary/10'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{ins.label}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${ins.status === 'Paid' ? 'text-green-600' : 'text-accent/40'}`}>
                      {ins.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold tracking-widest text-accent">KES {ins.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-accent/5">
              <Button onClick={() => openSupport("project_support")} variant="outline" className="w-full h-14 rounded-none border-accent/20 text-accent hover:bg-accent hover:text-white uppercase tracking-widest text-[9px] font-bold">
                Raise Studio Inquiry
              </Button>
            </div>
          </Card>

          <div className="p-10 bg-accent text-white space-y-6 shadow-2xl">
             <div className="flex items-center gap-3">
               <Wallet className="h-4 w-4 text-white/40" />
               <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/40 italic">Investment Health</h4>
             </div>
             <p className="text-sm font-light leading-relaxed italic">
               Total Budget synchronized at <span className="text-white font-bold">KES {activeProject.totalBudget.toLocaleString()}</span> for the {activeProject.tier} Commission.
             </p>
          </div>

          <div className="p-8 border border-destructive/10 space-y-4 text-center">
             <Button onClick={() => openSupport("termination_request")} variant="ghost" className="text-destructive/40 hover:text-destructive text-[9px] uppercase tracking-widest font-bold h-auto p-0">
                Initiate Contract Dissolution
             </Button>
          </div>
        </div>
      </div>

      <ClientSupportDialog 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
        projectId={activeProject.id}
        defaultType={supportType}
      />
    </div>
  );
}
