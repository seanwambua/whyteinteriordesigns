"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Handshake, 
  Key, 
  FileCheck, 
  Camera, 
  Star, 
  ShieldCheck, 
  ChevronRight,
  Info,
  Clock,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { useEffect, useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HandoverProtocolPage() {
  const { clientProjects, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // HANDOVER: Projects in Execution with high progress (>90%) or in Completion phase but not yet reconciled
  const handoverProjects = useMemo(() => {
    return clientProjects.filter(p => 
      !p.isArchived && 
      p.isActivated && 
      (p.status === 'Completion' || (p.status === 'Execution' && p.progress >= 90))
    );
  }, [clientProjects]);

  if (!isMounted) return null;

  const handleAuthorizeHandover = (projectId: string) => {
    setIsSyncing(projectId);
    setTimeout(() => {
      updateClientProject(projectId, { 
        status: 'Completion', 
        lastActivity: "Handover Protocol Authorized — Site Keys & Quality Sign-off Verified" 
      });
      toast({ title: "Handover Synchronized", description: "Commission transitioned to historical completion phase." });
      setIsSyncing(null);
    }, 1500);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Handover <span className="not-italic">Protocols.</span></h1>
        </div>
      </motion.div>

      <Alert className="rounded-none border-accent/10 bg-accent/[0.02] p-6">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="text-[13px] font-bold uppercase tracking-widest text-accent mb-1">Final Delivery Framework</AlertTitle>
        <AlertDescription className="text-[13px] font-light italic text-muted-foreground leading-relaxed">
          Handover protocols manage the transition from site implementation to architectural completion. Verification includes quality sign-offs, digital key distribution, and final site documentation.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-8">
        {handoverProjects.map((project, index) => (
          <motion.div key={project.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-none border-accent/5 shadow-xl bg-white group overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={cn("w-2 shrink-0 self-stretch", project.status === 'Completion' ? 'bg-accent' : 'bg-accent/20')} />
                <CardContent className="p-10 flex-1 flex flex-col lg:flex-row gap-12">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] font-bold text-accent/40 uppercase tracking-widest">{project.id}</span>
                      <Badge variant="outline" className="rounded-none text-[11px] font-bold uppercase tracking-widest px-3 py-1 border-accent/20 text-accent">
                        {project.status}
                      </Badge>
                    </div>
                    <h3 className="text-4xl font-headline italic">{project.project}</h3>
                    <div className="flex flex-wrap gap-8 text-[12px] text-muted-foreground uppercase tracking-widest font-bold border-t border-accent/5 pt-6">
                      <div className="flex items-center gap-2"><User className="h-4 w-4 opacity-40" /> {project.name}</div>
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 opacity-40" /> Handover Target: {project.endDate}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-accent/60">
                        <span>Implementation Velocity</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5 bg-secondary rounded-none" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row lg:flex-col justify-between gap-6 min-w-[280px]">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="rounded-none h-14 border-accent/10 hover:bg-accent hover:text-white flex flex-col items-center justify-center p-0 gap-1 transition-all">
                        <Key className="h-4 w-4" />
                        <span className="text-[9px] uppercase tracking-widest font-bold">Keys Sync</span>
                      </Button>
                      <Button variant="outline" className="rounded-none h-14 border-accent/10 hover:bg-accent hover:text-white flex flex-col items-center justify-center p-0 gap-1 transition-all">
                        <Camera className="h-4 w-4" />
                        <span className="text-[9px] uppercase tracking-widest font-bold">Site Media</span>
                      </Button>
                      <Button variant="outline" className="rounded-none h-14 border-accent/10 hover:bg-accent hover:text-white flex flex-col items-center justify-center p-0 gap-1 transition-all">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-[9px] uppercase tracking-widest font-bold">QA Report</span>
                      </Button>
                      <Button variant="outline" className="rounded-none h-14 border-accent/10 hover:bg-accent hover:text-white flex flex-col items-center justify-center p-0 gap-1 transition-all">
                        <Star className="h-4 w-4" />
                        <span className="text-[9px] uppercase tracking-widest font-bold">Review</span>
                      </Button>
                    </div>
                    
                    {project.status === 'Completion' ? (
                      <div className="h-16 bg-accent/5 border border-accent/10 flex items-center justify-center gap-3 text-accent px-6">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Protocol Verified</span>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleAuthorizeHandover(project.id)}
                        disabled={isSyncing === project.id}
                        className="h-16 bg-accent text-white rounded-none uppercase tracking-widest text-[11px] font-bold shadow-xl transition-all hover:tracking-[0.2em]"
                      >
                        {isSyncing === project.id ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Authorizing...</span> : <><Handshake className="h-5 w-5 mr-2" /> Authorize Handover</>}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
        {handoverProjects.length === 0 && (
          <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 space-y-4">
            <div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
              <Handshake className="h-8 w-8 text-accent/20" />
            </div>
            <p className="text-[13px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">
              No commissions currently prioritized for handover synchronization
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Alert({ children, className, variant }: any) {
  return <div className={cn("border p-4 flex items-start gap-4", className)}>{children}</div>;
}
function AlertTitle({ children, className }: any) {
  return <h5 className={cn("font-bold", className)}>{children}</h5>;
}
function AlertDescription({ children, className }: any) {
  return <div className={cn("text-sm", className)}>{children}</div>;
}