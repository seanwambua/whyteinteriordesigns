
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  ChevronRight, 
  MessageSquare, 
  Clock, 
  Layout, 
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
  Flag,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ClientSupportDialog } from "@/components/dashboard/client-support-dialog";

export default function ClientDashboardPage() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportType, setSupportType] = useState<"project_support" | "complaint" | "termination_request">("project_support");

  const activeProject = {
    title: "The Muthaiga Residence",
    id: "WP-0082",
    planType: "Full Commission",
    status: "Execution & Installation",
    progress: 78,
    lastUpdate: "Italian marble shipment installed in the foyer. Master suite textiles arriving Friday.",
    nextMilestone: "Final styling and lighting synchronization",
    team: "Lead Designer + 2 Technical Architects",
    milestones: [
      { label: "Concept Approval", date: "Jan 12", isCompleted: true, desc: "Bespoke mood boards finalized." },
      { label: "Technical Drawings", date: "Feb 05", isCompleted: true, desc: "Architectural blueprints signed off." },
      { label: "Procurement Phase", date: "Mar 20", isCompleted: true, desc: "Imported marbles and textiles secured." },
      { label: "Site Installation", date: "Ongoing", isCompleted: false, desc: "Current phase of architectural layering." },
      { label: "Final Curation", date: "Apr 15", isCompleted: false, desc: "Final styling and white-glove handover." }
    ]
  };

  const openSupport = (type: "project_support" | "complaint" | "termination_request") => {
    setSupportType(type);
    setIsSupportOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 font-body">
      {/* Onboarding Banner */}
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Client Portal — Nairobi Studio</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-6xl font-headline">The <span className="italic">Evolution.</span></h1>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Active Plan</span>
            <span className="text-lg font-headline italic text-accent">{activeProject.planType}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Project Status */}
        <div className="lg:col-span-8 space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-none border-accent/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden bg-white">
              <div className="bg-accent h-1.5 w-full" />
              <CardHeader className="p-12 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.5em] block mb-2">{activeProject.id}</span>
                    <CardTitle className="text-4xl font-headline italic">{activeProject.title}</CardTitle>
                  </div>
                  <div className={`text-[10px] font-bold border px-6 py-2 uppercase tracking-[0.3em] ${
                    activeProject.status.includes('Termination') ? 'text-destructive border-destructive/20 bg-destructive/5' : 'text-accent border-accent/20 bg-accent/5'
                  }`}>
                    {activeProject.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-12 pt-0 space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.4em] font-bold text-accent/60">
                    <span>Journey Progress</span>
                    <span>{activeProject.progress}%</span>
                  </div>
                  <Progress value={activeProject.progress} className="h-1 bg-secondary rounded-none" />
                </div>

                {/* Latest Studio Entry */}
                <div className="p-8 bg-secondary/30 border-l-2 border-accent italic">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2 mb-4">
                    <Clock className="h-3 w-3" /> Latest Studio Entry
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-accent/80">
                    "{activeProject.lastUpdate}"
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <Flag className="h-4 w-4 text-accent" />
              <h2 className="text-2xl font-headline italic">Project Roadmap</h2>
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
                      {milestone.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-none border-accent/5 shadow-xl bg-secondary/10 p-8 space-y-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 text-center">Studio Access</h3>
            
            <div className="space-y-4">
              <Button 
                onClick={() => openSupport("project_support")}
                variant="outline"
                className="w-full h-20 rounded-none border-accent/20 bg-white hover:bg-accent hover:text-white group flex items-center justify-start px-6 gap-4 transition-all"
              >
                <div className="h-10 w-10 flex items-center justify-center border border-accent/10 rounded-full group-hover:border-white/20">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Raise Studio Inquiry</p>
                  <p className="text-[8px] opacity-60 uppercase tracking-widest font-light mt-1">Direct to Design Team</p>
                </div>
              </Button>

              <Button 
                onClick={() => openSupport("complaint")}
                variant="outline"
                className="w-full h-20 rounded-none border-orange-200 bg-white hover:bg-orange-600 hover:text-white group flex items-center justify-start px-6 gap-4 transition-all"
              >
                <div className="h-10 w-10 flex items-center justify-center border border-orange-100 rounded-full group-hover:border-white/20 text-orange-600 group-hover:text-white">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Report Site Issue</p>
                  <p className="text-[8px] opacity-60 uppercase tracking-widest font-light mt-1">Urgent Attention Required</p>
                </div>
              </Button>

              <Button 
                onClick={() => openSupport("termination_request")}
                variant="outline"
                className="w-full h-20 rounded-none border-destructive/10 bg-white hover:bg-destructive hover:text-white group flex items-center justify-start px-6 gap-4 transition-all"
              >
                <div className="h-10 w-10 flex items-center justify-center border border-destructive/10 rounded-full group-hover:border-white/20 text-destructive group-hover:text-white">
                  <XCircle className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Terminate Project</p>
                  <p className="text-[8px] opacity-60 uppercase tracking-widest font-light mt-1">Formal Contract Dissolution</p>
                </div>
              </Button>
            </div>

            <div className="pt-8 border-t border-accent/5">
              <h4 className="text-[9px] uppercase tracking-[0.4em] font-bold text-accent/30 italic mb-4">Assigned Experts</h4>
              <p className="text-xs font-light text-muted-foreground italic tracking-wide">
                {activeProject.team}
              </p>
            </div>
          </Card>

          <div className="p-10 bg-accent text-white space-y-6 shadow-2xl">
             <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/40 italic">Architectural Tip</h4>
             <p className="text-sm font-light leading-relaxed italic">
               "We've adjusted the lighting synchronicity in the foyer to peak during the 5 PM Nairobi golden hour, accentuating the Galana stone textures."
             </p>
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
