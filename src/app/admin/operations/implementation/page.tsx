
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  Clock, 
  Truck, 
  HardHat, 
  AlertCircle, 
  Plus, 
  Activity, 
  ChevronRight, 
  Settings2,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useWhyteStore, ClientProject, SiteReport } from "@/store/use-whyte-store";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function ProjectImplementationPage() {
  const { clientProjects, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<ClientProject | null>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  
  const [logForm, setLogForm] = useState({
    type: 'Progress' as SiteReport['type'],
    urgency: 'Normal' as SiteReport['urgency'],
    content: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Lifecycle Rule: Only projects in 'Execution' or 'Styling' that are activated are shown here.
  const liveProjects = clientProjects.filter(p => 
    p.isActivated && (p.status === 'Execution' || p.status === 'Styling' || p.status === 'Procurement')
  );

  const handleUpdateProgress = (id: string, val: number[]) => {
    updateClientProject(id, { progress: val[0] });
  };

  const handleAddLog = () => {
    if (!activeProject || !logForm.content) return;

    const newReport: SiteReport = {
      id: `LOG-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      type: logForm.type,
      urgency: logForm.urgency,
      content: logForm.content
    };

    const updatedReports = [newReport, ...(activeProject.siteReports || [])];
    
    updateClientProject(activeProject.id, { 
      siteReports: updatedReports,
      lastActivity: `${logForm.type}: ${logForm.content.substring(0, 30)}...`
    });

    toast({
      title: "Site Entry Synchronized",
      description: "Log has been appended to the project architectural record.",
    });

    setIsLogOpen(false);
    setLogForm({ type: 'Progress', urgency: 'Normal', content: '' });
  };

  const handleUpdateStatus = (id: string, status: ClientProject['status']) => {
    updateClientProject(id, { status });
    toast({
      title: "Phase Transition",
      description: `Project has transitioned to the ${status} phase.`,
    });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Live <span className="not-italic">Implementation.</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="p-4 bg-white border border-accent/5 shadow-sm text-right">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Network Capacity</span>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">{liveProjects.length} Active Sites</span>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-12">
        {liveProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden relative group">
              <div className="flex flex-col lg:flex-row min-h-[400px]">
                {/* Left Side: General Info & Progress */}
                <div className="lg:w-2/3 p-10 space-y-10 border-r border-accent/5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.4em] block">{project.id}</span>
                      <h3 className="text-4xl font-headline italic">{project.project}</h3>
                      <div className="flex items-center gap-4 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                        <span>{project.name}</span>
                        <div className="h-1 w-1 bg-accent/20 rounded-full" />
                        <span>{project.tier} Tier</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Select defaultValue={project.status} onValueChange={(v: any) => handleUpdateStatus(project.id, v)}>
                        <SelectTrigger className="rounded-none border-accent/10 h-10 w-44 uppercase tracking-widest text-[9px] font-bold">
                          <SelectValue placeholder="Phase Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="Procurement">Procurement</SelectItem>
                          <SelectItem value="Execution">Execution</SelectItem>
                          <SelectItem value="Styling">Styling</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between text-[10px] uppercase tracking-[0.4em] font-bold text-accent/60">
                      <span>Implementation Velocity</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Slider 
                      defaultValue={[project.progress]} 
                      max={100} 
                      step={1} 
                      onValueChange={(v) => handleUpdateProgress(project.id, v)}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-accent/5">
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2">
                        <Activity className="h-3 w-3" /> Technical Scope
                      </h4>
                      <p className="text-xs font-light leading-relaxed text-muted-foreground italic">
                        {project.workScope || "Detailed scope synchronization pending."}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2">
                        <Truck className="h-3 w-3" /> Active Deployments
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(project.vendorAllocations || []).map(va => (
                          <span key={va.id} className="text-[8px] uppercase tracking-widest bg-secondary/50 px-3 py-1 border border-accent/5">
                            {va.vendorName}
                          </span>
                        ))}
                        {(!project.vendorAllocations || project.vendorAllocations.length === 0) && (
                          <span className="text-[8px] uppercase tracking-widest text-muted-foreground opacity-50 italic">No partners allocated.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Log Entries */}
                <div className="lg:w-1/3 bg-secondary/10 p-10 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2">
                      <Clock className="h-3 w-3" /> Site Diary
                    </h4>
                    <Button 
                      variant="ghost" 
                      onClick={() => { setActiveProject(project); setIsLogOpen(true); }}
                      className="h-8 w-8 p-0 rounded-full border border-accent/10 hover:bg-accent hover:text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {(project.siteReports || []).map((report) => (
                      <div key={report.id} className="p-6 bg-white border border-accent/5 shadow-sm space-y-3 relative overflow-hidden group/log">
                        {report.urgency === 'Critical' && <div className="absolute top-0 right-0 p-2"><AlertTriangle className="h-3 w-3 text-destructive" /></div>}
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-bold uppercase tracking-widest ${
                            report.type === 'Issue' ? 'text-destructive' : 'text-accent/60'
                          }`}>
                            {report.type}
                          </span>
                          <span className="text-[8px] font-bold text-accent/20">{report.date}</span>
                        </div>
                        <p className="text-[11px] font-light italic leading-relaxed text-accent/80">
                          "{report.content}"
                        </p>
                      </div>
                    ))}
                    {(!project.siteReports || project.siteReports.length === 0) && (
                      <div className="text-center py-12 opacity-30 italic text-[10px] uppercase tracking-widest">
                        No diary entries synchronization
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {liveProjects.length === 0 && (
          <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5">
            <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No projects currently in live implementation phases</p>
          </div>
        )}
      </div>

      <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Site Synchronization</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">New Diary Entry</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Document site progress, technical issues, or logistical updates.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Entry Nature</Label>
                <Select value={logForm.type} onValueChange={(v: any) => setLogForm({...logForm, type: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Progress">Progress Update</SelectItem>
                    <SelectItem value="Issue">Site Issue</SelectItem>
                    <SelectItem value="Log">General Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Urgency Protocol</Label>
                <Select value={logForm.urgency} onValueChange={(v: any) => setLogForm({...logForm, urgency: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue placeholder="Urgency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Critical">Critical Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Architectural Note</Label>
              <Textarea 
                value={logForm.content}
                onChange={(e) => setLogForm({...logForm, content: e.target.value})}
                placeholder="Details from the site visit..."
                className="rounded-none border-accent/20 min-h-[120px] focus:ring-accent resize-none italic"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[10px] font-bold"
              onClick={handleAddLog}
            >
              Commit to Registry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
