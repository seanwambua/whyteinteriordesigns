
"use client";

import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, Milestone } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  User, 
  Briefcase, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save,
  Activity,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function ProjectManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const project = clientProjects.find((p) => p.id === id);

  if (!isMounted) return null;
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <h2 className="text-3xl font-headline italic">Commission Not Found</h2>
        <Button asChild variant="outline" className="rounded-none px-8">
          <Link href="/admin/clients">Return to Directory</Link>
        </Button>
      </div>
    );
  }

  const handleToggleMilestone = (index: number) => {
    const updatedMilestones = [...project.milestones];
    updatedMilestones[index] = { 
      ...updatedMilestones[index], 
      isCompleted: !updatedMilestones[index].isCompleted 
    };
    
    // Auto-calculate progress based on completed milestones
    const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
    const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

    updateClientProject(project.id, { 
      milestones: updatedMilestones,
      progress: newProgress,
      lastActivity: `Milestone "${updatedMilestones[index].label}" status updated.`
    });

    toast({
      title: "Roadmap Synchronized",
      description: `Milestone "${updatedMilestones[index].label}" is now ${updatedMilestones[index].isCompleted ? 'Verified' : 'Pending'}.`,
    });
  };

  const handleUpdateStatus = (status: ClientProject['status']) => {
    updateClientProject(project.id, { 
      status,
      lastActivity: `Project status transitioned to ${status}.`
    });
    toast({
      title: "Lifecycle Transition",
      description: `Commission ${project.id} is now in the ${status} phase.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Button asChild variant="ghost" className="text-accent/40 hover:text-accent p-0 font-bold uppercase tracking-widest text-[9px] h-auto flex items-center gap-2 mb-4">
          <Link href="/admin/clients"><ArrowLeft className="h-3 w-3" /> Back to Directory</Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Project Terminal</span>
            </div>
            <h1 className="text-5xl font-headline italic">{project.project}</h1>
            <div className="flex items-center gap-6 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2"><User className="h-3.5 w-3.5 opacity-40" /> {project.name}</span>
              <div className="h-1 w-1 bg-accent/20 rounded-full" />
              <span className="opacity-40">{project.id}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-4 border border-accent/5 shadow-xl">
            <div className="space-y-1 pr-6 border-r border-accent/10">
              <Label className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40">Phase Transition</Label>
              <Select defaultValue={project.status} onValueChange={(v: ClientProject['status']) => handleUpdateStatus(v)}>
                <SelectTrigger className="rounded-none border-none h-8 p-0 text-xs font-bold uppercase tracking-widest text-accent focus:ring-0">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-accent/10">
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Procurement">Procurement</SelectItem>
                  <SelectItem value="Execution">Execution</SelectItem>
                  <SelectItem value="Styling">Styling</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Termination Pending" className="text-destructive">Termination Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pl-2">
              <Badge className={`rounded-none uppercase tracking-widest text-[8px] ${
                project.tier === 'Golden' ? 'bg-accent' : 'bg-accent/40'
              } text-white`}>
                {project.tier} Tier
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Progress Overview */}
          <Card className="rounded-none border-accent/5 shadow-2xl bg-white overflow-hidden">
            <div className="bg-accent h-1.5 w-full" />
            <CardContent className="p-10 space-y-10">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Implementation Velocity</p>
                  <h2 className="text-4xl font-headline italic">{project.progress}% Complete</h2>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Last Activity Sync</p>
                   <p className="text-xs font-light italic text-muted-foreground">{project.lastActivity}</p>
                </div>
              </div>
              <Progress value={project.progress} className="h-1 bg-secondary rounded-none" />
            </CardContent>
          </Card>

          {/* Roadmap Management */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Activity className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-headline italic">Architectural Roadmap</h2>
              </div>
              <Button variant="outline" className="rounded-none h-10 border-accent/20 uppercase tracking-widest text-[9px] flex gap-2">
                <Plus className="h-3.5 w-3.5" /> Add Milestone
              </Button>
            </div>

            <div className="space-y-4">
              {project.milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-8 border flex items-center justify-between group transition-all ${
                    milestone.isCompleted ? 'border-green-600/20 bg-green-600/[0.02]' : 'border-accent/5 bg-white'
                  }`}
                >
                  <div className="flex gap-8 items-start">
                    <button 
                      onClick={() => handleToggleMilestone(idx)}
                      className={`h-12 w-12 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        milestone.isCompleted ? 'bg-green-600 border-green-600 text-white' : 'border-accent/10 text-accent/10 hover:border-accent hover:text-accent'
                      }`}
                    >
                      {milestone.isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                    </button>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <h4 className={`text-lg font-headline ${milestone.isCompleted ? 'text-foreground' : 'text-accent/60'}`}>
                          {milestone.label}
                        </h4>
                        <span className="text-[9px] font-bold text-accent/30 uppercase tracking-widest">{milestone.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-light italic max-w-xl leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive/40 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Financials */}
          <Card className="rounded-none border-accent/5 shadow-xl bg-white p-8 space-y-8">
            <div className="flex items-center justify-center gap-3">
              <Wallet className="h-4 w-4 text-accent/40" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Financial Ledger</h3>
            </div>
            
            <div className="space-y-4">
              {project.installments.map((ins, i) => (
                <div key={i} className={`p-6 border ${ins.status === 'Paid' ? 'border-green-600/20 bg-green-600/5' : 'border-accent/10 bg-secondary/5'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-accent/40">{ins.label}</span>
                    <Badge className={`rounded-none uppercase tracking-widest text-[8px] ${
                      ins.status === 'Paid' ? 'bg-green-600 text-white' : 'bg-accent/10 text-accent border-accent/20'
                    }`}>
                      {ins.status}
                    </Badge>
                  </div>
                  <p className="text-xl font-headline italic text-accent">KES {ins.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-accent/5 text-center">
               <div className="space-y-1 mb-6">
                 <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-accent/40">Total Budget Authorization</p>
                 <p className="text-2xl font-headline italic">KES {project.totalBudget.toLocaleString()}</p>
               </div>
               {project.depositCode && (
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/50 border border-accent/5">
                   <span className="text-[9px] font-bold uppercase tracking-widest text-accent/40">Deposit Auth:</span>
                   <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{project.depositCode}</span>
                 </div>
               )}
            </div>
          </Card>

          <div className="p-10 border border-dashed border-accent/20 bg-accent/5 space-y-6 text-center">
            <Sparkles className="h-8 w-8 text-accent/20 mx-auto" />
            <div className="space-y-2">
              <h4 className="text-xl font-headline italic">Project Support</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed italic">
                Direct all site-specific inquiries and architectural clarifications through the private client portal channel.
              </p>
            </div>
            <Button variant="outline" className="w-full h-12 rounded-none border-accent/20 text-accent uppercase tracking-widest text-[9px] font-bold hover:bg-accent hover:text-white transition-all">
              Initiate Response Sequence
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
