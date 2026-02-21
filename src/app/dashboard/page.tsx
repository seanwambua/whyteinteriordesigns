
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, ChevronRight, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";

export default function ClientDashboardPage() {
  const activeProject = {
    title: "The Muthaiga Residence",
    status: "Procurement & Sourcing",
    progress: 65,
    lastUpdate: "Italian marble shipment arrived at Nairobi port.",
    nextMilestone: "On-site installation starts next Tuesday",
  };

  return (
    <div className="max-w-6xl space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Personal Workspace</span>
        </div>
        <h1 className="text-5xl font-headline">Welcome back, <span className="italic">Excellence.</span></h1>
        <p className="text-muted-foreground font-light max-w-xl text-lg">
          Monitor your ongoing transformation and coordinate with our design studio in real-time.
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
          <Card className="rounded-none border-accent/10 shadow-2xl overflow-hidden bg-white">
            <div className="bg-accent h-1 w-full" />
            <CardHeader className="p-10 pb-6">
              <div className="flex justify-between items-start mb-4">
                <CardTitle className="text-3xl font-headline">{activeProject.title}</CardTitle>
                <span className="text-[10px] font-bold text-accent border border-accent/20 px-4 py-1.5 uppercase tracking-[0.2em]">Active Project</span>
              </div>
              <p className="text-accent text-sm font-bold uppercase tracking-[0.2em]">{activeProject.status}</p>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] font-bold text-accent/60">
                  <span>Project Progress</span>
                  <span>{activeProject.progress}%</span>
                </div>
                <Progress value={activeProject.progress} className="h-1 bg-secondary rounded-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent/40 flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Latest Update
                  </h4>
                  <p className="text-sm font-light italic leading-relaxed text-muted-foreground">
                    "{activeProject.lastUpdate}"
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent/40 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Next Up
                  </h4>
                  <p className="text-sm font-bold uppercase tracking-widest text-accent">
                    {activeProject.nextMilestone}
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <Button asChild variant="outline" className="border-accent text-accent rounded-none h-14 px-8 uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all w-full md:w-auto">
                  <Link href="/dashboard/projects" className="flex items-center gap-2">
                    View Project Archive <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Contact */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-none border-accent/5 shadow-xl bg-secondary/20 p-8 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Studio Access</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/50 border border-accent/5 hover:border-accent/20 transition-all group cursor-pointer">
                <div className="h-10 w-10 flex items-center justify-center bg-accent text-white group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Chat with Designer</p>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Available 9am - 6pm EAT</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white/50 border border-accent/5 hover:border-accent/20 transition-all group cursor-pointer">
                <div className="h-10 w-10 flex items-center justify-center bg-accent text-white group-hover:scale-110 transition-transform">
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <Link href="/feedback">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Submit Mid-Project Review</p>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Your feedback refined our work</p>
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-8 border-l-2 border-accent/10 space-y-4">
             <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/60 italic">Architectural Tip</h4>
             <p className="text-xs font-light text-muted-foreground leading-relaxed italic">
               "Natural light in the foyer will peak around 10am. We've adjusted the Italian marble placement to capture the morning glow."
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
