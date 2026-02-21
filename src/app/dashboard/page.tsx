
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
  Wallet,
  Activity,
  Truck,
  HardHat,
  FileCheck,
  Calendar as CalendarIcon,
  Timer
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ClientSupportDialog } from "@/components/dashboard/client-support-dialog";
import { useWhyteStore, ClientProject, ProjectTask } from "@/store/use-whyte-store";
import { Badge } from "@/components/ui/badge";
import { parse, differenceInDays, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

export default function ClientDashboardPage() {
  const { clientProjects } = useWhyteStore();
  const [verifiedProjectId, setVerifiedProjectId] = useState<string | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportType, setSupportType] = useState<"project_support" | "complaint" | "termination_request">("project_support");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedId = localStorage.getItem("whyte_verified_project_id");
    setVerifiedProjectId(storedId);
  }, []);

  if (!isMounted) return null;

  const activeProject = clientProjects.find(p => p.id === verifiedProjectId) || clientProjects.find(p => p.isActivated);

  if (!activeProject) {
    return (
      <div className="max-w-6xl mx-auto py-32 text-center space-y-8 font-body">
        <div className="h-20 w-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <Briefcase className="h-10 w-10 text-accent/20" />
        </div>
        <h2 className="text-4xl font-headline italic">Project Synchronization Required.</h2>
        <p className="text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
          We could not locate an active journey associated with your session. Please verify your Project Reference ID to access the private archives.
        </p>
        <Button asChild className="bg-accent text-white rounded-none h-14 px-12 uppercase tracking-widest text-[10px] font-bold">
          <Link href="/dashboard/onboarding">Verify Studio Identity</Link>
        </Button>
      </div>
    );
  }

  const openSupport = (type: "project_support" | "complaint" | "termination_request") => {
    setSupportType(type);
    setIsSupportOpen(true);
  };

  const activeTasks = (activeProject.tasks || []).filter(t => t.status !== 'Done');
  const completedTasksCount = (activeProject.tasks || []).filter(t => t.status === 'Done').length;

  // Temporal Logic for Client View
  const deadline = parse(activeProject.endDate, "MMM dd, yyyy", new Date());
  const today = new Date();
  const daysRemaining = differenceInDays(deadline, today);
  const isOverdue = isAfter(today, deadline);

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Client Workspace</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-headline">The <span className="italic">Evolution.</span></h1>
            <p className="text-muted-foreground font-light italic">Synchronized with Nairobi Studio HQ</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
            <span className="text-lg font-headline italic text-accent">{activeProject.tier} Commission</span>
            <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[8px] border-accent/20 text-accent/60 mt-2">
              Status: {activeProject.status}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Main Status Card */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card className="rounded-none border-accent/10 shadow-2xl overflow-hidden bg-white">
              <div className="bg-accent h-1.5 w-full" />
              <CardHeader className="p-10 pb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.5em] block mb-2">{activeProject.id}</span>
                    <CardTitle className="text-4xl font-headline italic">{activeProject.project}</CardTitle>
                  </div>
                  <div className="flex gap-3">
                    {activeProject.isExtended && (
                      <Badge className="bg-orange-500 text-white rounded-none uppercase tracking-widest text-[8px] py-1.5">Timeline Extended</Badge>
                    )}
                    {activeProject.financialReportStatus === 'Verified' && (
                      <Badge className="bg-green-600 text-white rounded-none uppercase tracking-widest text-[8px] py-1.5 flex gap-2">
                        <FileCheck className="h-3 w-3" /> Audit Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between text-[9px] uppercase tracking-[0.4em] font-bold text-accent/60">
                    <span>Implementation Velocity</span>
                    <span>{activeProject.progress}%</span>
                  </div>
                  <Progress value={activeProject.progress} className="h-1 bg-secondary rounded-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-secondary/30 border-l-2 border-accent italic">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2 mb-4">
                      <Clock className="h-3 w-3" /> Latest Site Entry
                    </h4>
                    <p className="text-sm font-light leading-relaxed text-accent/80">
                      "{activeProject.lastActivity || 'Architectural synchronization established.'}"
                    </p>
                  </div>

                  <div className={cn("p-8 border-l-2 italic", isOverdue ? "bg-destructive/5 border-destructive" : "bg-accent/5 border-accent")}>
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40 flex items-center gap-2 mb-4">
                      <Timer className="h-3 w-3" /> Delivery Framework
                    </h4>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60">Estimated Handover</p>
                      <p className={cn("text-2xl font-headline font-bold", isOverdue ? "text-destructive" : "text-accent")}>
                        {activeProject.endDate}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest opacity-40">
                        {isOverdue ? "Authorized timeline extension pending" : `${daysRemaining} days until scheduled completion`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Operational Workflow (Tasks) */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Activity className="h-4 w-4 text-accent" />
                <h2 className="text-2xl font-headline italic">Live Site Workflow</h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">
                {completedTasksCount} Tasks Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(activeProject.tasks || []).slice(0, 4).map((task) => (
                <div key={task.id} className="p-6 border border-accent/5 bg-white shadow-sm flex flex-col justify-between min-h-[140px] group hover:border-accent/20 transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-bold text-accent/30 uppercase tracking-widest">{task.id}</span>
                      <Badge variant="ghost" className={`text-[8px] uppercase tracking-widest p-0 h-auto ${
                        task.status === 'Done' ? 'text-green-600' : 
                        task.status === 'In Progress' ? 'text-accent' : 'text-orange-500'
                      }`}>
                        {task.status}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest leading-tight group-hover:text-accent transition-colors">
                      {task.title}
                    </h4>
                  </div>
                  
                  {task.assignedVendor && (
                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase tracking-widest pt-4 border-t border-accent/5 mt-4">
                      <Truck className="h-3 w-3 opacity-40" /> {task.assignedVendor}
                    </div>
                  )}
                </div>
              ))}
              {(activeProject.tasks || []).length === 0 && (
                <div className="col-span-2 p-12 border border-dashed border-accent/10 text-center italic text-muted-foreground text-sm">
                  Operational workflow is currently being synchronized by the site architect.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Financials */}
          <Card className="rounded-none border-accent/5 shadow-xl bg-white p-8 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Financial Ledger</h3>
              <p className="text-xs font-light italic text-muted-foreground">Commission Tier: {activeProject.tier}</p>
            </div>
            
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

          {/* Site Resources Card */}
          <Card className="rounded-none border-accent/5 bg-secondary/30 p-8 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2">
              <HardHat className="h-3 w-3" /> Allocated Network
            </h4>
            <div className="space-y-4">
              {(activeProject.vendorAllocations || []).map((vendor, vIdx) => (
                <div key={vIdx} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">{vendor.vendorName}</p>
                    <p className="text-[9px] text-muted-foreground italic">{vendor.role}</p>
                  </div>
                  <Badge variant="ghost" className="text-[8px] uppercase tracking-widest opacity-40 p-0 h-auto">{vendor.category}</Badge>
                </div>
              ))}
              {(activeProject.vendorAllocations || []).length === 0 && (
                <p className="text-[10px] text-accent/30 italic uppercase tracking-widest text-center py-2">Vendor matrix initialization in progress</p>
              )}
            </div>
          </Card>

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
