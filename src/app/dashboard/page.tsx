
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, ChevronRight, MessageSquare, Clock, Layout, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ClientDashboardPage() {
  // Simulating an onboarding check
  const [isOnboarded, setIsOnboarded] = useState(false);

  const activeProject = {
    title: "The Muthaiga Residence",
    id: "WP-0082",
    status: "Execution & Installation",
    progress: 78,
    lastUpdate: "Italian marble shipment installed in the foyer. Master suite textiles arriving Friday.",
    nextMilestone: "Final styling and lighting synchronization",
    team: "Lead Designer + 2 Technical Architects"
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Onboarding Banner for existing clients */}
      {!isOnboarded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-white"
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Client Portal — Nairobi Studio</span>
        </div>
        <h1 className="text-6xl font-headline">The <span className="italic">Evolution.</span></h1>
        <p className="text-muted-foreground font-light max-w-xl text-lg leading-relaxed italic">
          Your project is an ongoing dialogue between architecture and identity. Monitor the transformation below.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Project Status */}
        <motion.div 
          className="lg:col-span-2"
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
                <div className="text-[10px] font-bold text-accent border border-accent/20 px-6 py-2 uppercase tracking-[0.3em] bg-accent/5">
                  Live Execution
                </div>
              </div>
              <p className="text-accent text-sm font-bold uppercase tracking-[0.3em] italic">{activeProject.status}</p>
            </CardHeader>
            <CardContent className="p-12 pt-0 space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.4em] font-bold text-accent/60">
                  <span>Journey Progress</span>
                  <span>{activeProject.progress}%</span>
                </div>
                <Progress value={activeProject.progress} className="h-1 bg-secondary rounded-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/30 flex items-center gap-2 italic">
                    <Clock className="h-3 w-3" /> Latest Studio Entry
                  </h4>
                  <p className="text-sm font-light italic leading-relaxed text-muted-foreground border-l border-accent/10 pl-6">
                    "{activeProject.lastUpdate}"
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/30 flex items-center gap-2 italic">
                    <Layout className="h-3 w-3" /> Studio Directives
                  </h4>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent bg-secondary/50 p-4 border border-accent/5">
                    {activeProject.nextMilestone}
                  </p>
                </div>
              </div>

              <div className="pt-12 flex flex-col sm:flex-row gap-6">
                <Button asChild variant="outline" className="border-accent text-accent rounded-none h-14 px-10 uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all flex-1">
                  <Link href="/dashboard/projects" className="flex items-center gap-2">
                    Architectural Archives <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-[0.2em] hover:bg-accent/90 transition-all flex-1">
                  <Link href="/dashboard/consultations">
                    Request Studio Session
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Studio Engagement */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-none border-accent/5 shadow-xl bg-secondary/20 p-8 space-y-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 text-center">Studio Access</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-6 bg-white border border-accent/5 hover:border-accent/20 transition-all group cursor-pointer">
                <div className="h-12 w-12 flex items-center justify-center bg-accent text-white group-hover:scale-105 transition-transform duration-500">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Designer Direct</p>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-light mt-1">Nairobi Studio Active</p>
                </div>
              </div>
              
              <Link href="/feedback" className="block">
                <div className="flex items-center gap-4 p-6 bg-white border border-accent/5 hover:border-accent/20 transition-all group cursor-pointer">
                  <div className="h-12 w-12 flex items-center justify-center border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Submit Milestone Review</p>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-light mt-1">Refine our direction</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="pt-8 border-t border-accent/5">
              <h4 className="text-[9px] uppercase tracking-[0.4em] font-bold text-accent/30 italic mb-4">Assigned Experts</h4>
              <p className="text-xs font-light text-muted-foreground italic tracking-wide">
                {activeProject.team}
              </p>
            </div>
          </Card>

          <div className="p-10 bg-accent text-white space-y-6">
             <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/40 italic">Architectural Tip</h4>
             <p className="text-sm font-light leading-relaxed italic">
               "We've adjusted the lighting synchronicity in the foyer to peak during the 5 PM Nairobi golden hour, accentuating the Galana stone textures."
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
