
"use client";

import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, VendorAllocation, Milestone, ProjectTask } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  User, 
  Plus, 
  Trash2, 
  Activity,
  Wallet,
  Layout,
  HardHat,
  Clock,
  Users,
  Settings2,
  XCircle,
  PlayCircle,
  Truck,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
  Building2,
  FileCheck,
  Calendar as CalendarIcon
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function ProjectMasterTerminal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject, collaborators, financialSteward } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isEditingRoadmap, setIsEditingRoadmap] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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

  // --- HANDLERS ---

  const handleUpdateStatus = (status: ClientProject['status']) => {
    updateClientProject(project.id, { 
      status,
      lastActivity: `Lifecycle transitioned to ${status}.`
    });
    toast({
      title: "Lifecycle Updated",
      description: `Commission moved to ${status} phase.`,
    });
  };

  const handleUpdateProgress = (val: number) => {
    updateClientProject(project.id, { progress: val });
  };

  // Milestone Logic
  const handleToggleMilestone = (index: number) => {
    const updated = [...project.milestones];
    updated[index] = { ...updated[index], isCompleted: !updated[index].isCompleted };
    updateClientProject(project.id, { milestones: updated });
  };

  const handleUpdateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updated = [...project.milestones];
    updated[index] = { ...updated[index], [field]: value };
    updateClientProject(project.id, { milestones: updated });
  };

  const handleAddMilestone = () => {
    const newM: Milestone = { label: "New Milestone", date: format(new Date(), "yyyy-MM-dd"), isCompleted: false, description: "" };
    updateClientProject(project.id, { milestones: [...project.milestones, newM] });
  };

  const handleRemoveMilestone = (idx: number) => {
    updateClientProject(project.id, { milestones: project.milestones.filter((_, i) => i !== idx) });
  };

  // Task Logic (Kanban Integration)
  const handleUpdateTaskStatus = (taskId: string, newStatus: ProjectTask['status']) => {
    const updatedTasks = (project.tasks || []).map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    
    // Auto-calculate velocity based on tasks
    const done = updatedTasks.filter(t => t.status === 'Done').length;
    const total = updatedTasks.length;
    const velocity = total > 0 ? Math.round((done / total) * 100) : project.progress;

    updateClientProject(project.id, { 
      tasks: updatedTasks,
      progress: velocity,
      lastActivity: `Task "${updatedTasks.find(t => t.id === taskId)?.title}" synchronized to ${newStatus}.`
    });
  };

  const handleAddTask = () => {
    const newTask: ProjectTask = {
      id: `T-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      title: "New Site Task",
      status: "Todo",
      priority: "Medium"
    };
    updateClientProject(project.id, { tasks: [...(project.tasks || []), newTask] });
  };

  // Financial Logic
  const handleToggleInstallment = (idx: number) => {
    const updated = [...project.installments];
    updated[idx] = { ...updated[idx], status: updated[idx].status === 'Paid' ? 'Pending' : 'Paid' };
    updateClientProject(project.id, { installments: updated });
  };

  const handleVerifyAudit = () => {
    updateClientProject(project.id, { financialReportStatus: 'Verified' });
    toast({
      title: "Audit Synchronized",
      description: "Project financial report verified by Studio Steward.",
    });
  };

  // --- SUB-COMPONENTS ---

  const KanbanCol = ({ status, title, color }: { status: ProjectTask['status'], title: string, color: string }) => {
    const tasks = (project.tasks || []).filter(t => t.status === status);
    return (
      <div className="flex-1 min-w-[280px] bg-secondary/5 border border-accent/5 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/60">{title}</h3>
          </div>
          <Badge variant="outline" className="rounded-none text-[9px] border-accent/10 opacity-40">{tasks.length}</Badge>
        </div>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white border border-accent/5 shadow-md p-6 space-y-4 group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-accent/30 uppercase tracking-widest">{task.id}</span>
                  <h4 className="text-sm font-bold uppercase tracking-widest leading-tight group-hover:text-accent transition-colors">{task.title}</h4>
                </div>
                <Badge variant="ghost" className="text-[8px] uppercase tracking-widest opacity-40 p-0 h-auto">{task.priority}</Badge>
              </div>
              <div className="flex items-center justify-end pt-4 border-t border-accent/5 gap-2">
                {status !== 'Todo' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-accent/40" onClick={() => handleUpdateTaskStatus(task.id, status === 'Done' ? 'In Progress' : 'Todo')}>
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                )}
                {status !== 'Done' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-accent/40" onClick={() => handleUpdateTaskStatus(task.id, status === 'Todo' ? 'In Progress' : 'Done')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 font-body">
      {/* Header Cockpit */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Button asChild variant="ghost" className="text-accent/40 hover:text-accent p-0 font-bold uppercase tracking-widest text-[9px] h-auto flex items-center gap-2">
          <Link href="/admin/clients"><ArrowLeft className="h-3 w-3" /> Back to Registry</Link>
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
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

          <div className="flex flex-wrap items-center gap-4 bg-white p-6 border border-accent/5 shadow-2xl">
            <div className="space-y-1 pr-8 border-r border-accent/10">
              <Label className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40">Phase Lifecycle</Label>
              <Select value={project.status} onValueChange={(v: any) => handleUpdateStatus(v)}>
                <SelectTrigger className="rounded-none border-none h-8 p-0 text-xs font-bold uppercase tracking-widest text-accent focus:ring-0 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Procurement">Procurement</SelectItem>
                  <SelectItem value="Execution">Execution</SelectItem>
                  <SelectItem value="Styling">Styling</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Termination Pending">Termination Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="px-8 border-r border-accent/10">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Tier</span>
              <Badge className={`rounded-none uppercase tracking-widest text-[8px] ${project.tier === 'Golden' ? 'bg-accent' : 'bg-accent/40'} text-white`}>
                {project.tier}
              </Badge>
            </div>
            <div className="pl-4">
              {!project.isActivated ? (
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white rounded-none uppercase tracking-widest text-[9px] h-10 px-6">
                  <Link href="/admin/operations/planning">Verify Activation</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 text-[9px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4" /> Active Journey
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2">
            <Layout className="h-3.5 w-3.5" /> Overview
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2">
            <Activity className="h-3.5 w-3.5" /> Roadmap
          </TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2">
            <PlayCircle className="h-3.5 w-3.5" /> Site Workflow
          </TabsTrigger>
          <TabsTrigger value="network" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2">
            <Users className="h-3.5 w-3.5" /> Network
          </TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2">
            <Wallet className="h-3.5 w-3.5" /> Ledger
          </TabsTrigger>
        </TabsList>

        {/* --- OVERVIEW TAB --- */}
        <TabsContent value="overview" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <Card className="rounded-none border-accent/5 shadow-xl bg-white overflow-hidden">
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

              <div className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Architectural Brief</h3>
                <div className="p-10 border border-accent/5 bg-white shadow-xl relative">
                  <p className="text-lg font-light italic text-accent/80 leading-relaxed">
                    "{project.description || project.workScope || "No brief documentation synchronized."}"
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-none border-accent/5 shadow-xl bg-white p-8 space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Technical Specs</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-accent/5">
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Spatial Scale</span>
                    <span className="text-sm font-bold">{project.roomsCount || 'N/A'} Rooms</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Authorized Representative</span>
                    <p className="text-xs font-bold text-accent">{project.email}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- ROADMAP TAB --- */}
        <TabsContent value="roadmap" className="m-0 space-y-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-headline italic">Architectural Roadmap</h2>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setIsEditingRoadmap(!isEditingRoadmap)} className="text-[9px] uppercase tracking-[0.3em] font-bold text-accent/60">
                {isEditingRoadmap ? "Exit Editor" : "Curate Roadmap"}
              </Button>
              {isEditingRoadmap && (
                <Button onClick={handleAddMilestone} variant="outline" className="rounded-none h-10 border-accent/20 uppercase tracking-widest text-[9px] flex gap-2">
                  <Plus className="h-3.5 w-3.5" /> Append Phase
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {project.milestones.map((milestone, idx) => (
              <motion.div key={idx} className={`p-8 border flex flex-col group transition-all ${milestone.isCompleted ? 'border-green-600/20 bg-green-600/[0.02]' : 'border-accent/5 bg-white shadow-xl'}`}>
                <div className="flex items-start justify-between gap-8">
                  <div className="flex gap-8 items-start flex-1">
                    <button 
                      onClick={() => !isEditingRoadmap && handleToggleMilestone(idx)}
                      disabled={isEditingRoadmap}
                      className={`h-12 w-12 rounded-full border flex items-center justify-center shrink-0 transition-all ${milestone.isCompleted ? 'bg-green-600 border-green-600 text-white' : 'border-accent/10 text-accent/10 hover:border-accent hover:text-accent'} ${isEditingRoadmap ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      {milestone.isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                    </button>
                    
                    <div className="space-y-4 flex-1">
                      {isEditingRoadmap ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2 space-y-2">
                            <Label className="text-[9px] uppercase tracking-widest opacity-40">Label</Label>
                            <Input value={milestone.label} onChange={(e) => handleUpdateMilestone(idx, 'label', e.target.value)} className="rounded-none h-10 text-sm font-bold uppercase tracking-widest" />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label className="text-[9px] uppercase tracking-widest opacity-40">Target Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal rounded-none h-10 border-accent/10 text-sm",
                                    !milestone.date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 opacity-40" />
                                  {milestone.date && isValid(new Date(milestone.date)) ? format(new Date(milestone.date), "PPP") : milestone.date || "Select Date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 rounded-none" align="start">
                                <Calendar
                                  mode="single"
                                  selected={milestone.date && isValid(new Date(milestone.date)) ? new Date(milestone.date) : undefined}
                                  onSelect={(d) => handleUpdateMilestone(idx, 'date', d ? format(d, "yyyy-MM-dd") : "")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="md:col-span-4 space-y-2">
                            <Label className="text-[9px] uppercase tracking-widest opacity-40">Objective</Label>
                            <Textarea value={milestone.description} onChange={(e) => handleUpdateMilestone(idx, 'description', e.target.value)} className="rounded-none min-h-[80px] text-sm font-light italic" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <h4 className={`text-lg font-headline ${milestone.isCompleted ? 'text-foreground' : 'text-accent/60'}`}>{milestone.label}</h4>
                            <span className="text-[9px] font-bold text-accent/30 uppercase tracking-widest">
                              {milestone.date && isValid(new Date(milestone.date)) ? format(new Date(milestone.date), "MMM dd, yyyy") : milestone.date}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-light italic max-w-xl leading-relaxed">{milestone.description}</p>
                        </>
                      )}
                    </div>
                  </div>
                  {isEditingRoadmap && <Button variant="ghost" size="icon" onClick={() => handleRemoveMilestone(idx)} className="text-destructive/40 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* --- WORKFLOW TAB --- */}
        <TabsContent value="workflow" className="m-0 space-y-12">
          {!project.isActivated ? (
            <div className="py-24 text-center border border-dashed border-accent/10 bg-secondary/5 space-y-6">
              <ClipboardList className="h-12 w-12 text-accent/20 mx-auto" />
              <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">Workflow initialization requires financial activation</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-headline italic">Live Site Implementation</h2>
                <Button onClick={handleAddTask} className="bg-accent text-white rounded-none h-12 px-6 uppercase tracking-widest text-[10px] flex gap-2">
                  <Plus className="h-4 w-4" /> New Task
                </Button>
              </div>
              <div className="flex gap-8 overflow-x-auto pb-12 custom-scrollbar">
                <KanbanCol status="Todo" title="Site Backlog" color="bg-orange-400" />
                <KanbanCol status="In Progress" title="In Implementation" color="bg-accent" />
                <KanbanCol status="Done" title="Task Completed" color="bg-green-600" />
              </div>
            </div>
          )}
        </TabsContent>

        {/* --- NETWORK TAB --- */}
        <TabsContent value="network" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-8">
                <div className="flex items-center gap-3">
                  <Layout className="h-5 w-5 text-accent/40" />
                  <h3 className="text-xl font-headline italic">Spatial Logic</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-accent/40">Total Room Count</Label>
                    <Input type="number" value={project.roomsCount || ""} onChange={(e) => updateClientProject(project.id, { roomsCount: parseInt(e.target.value) })} className="rounded-none border-accent/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-accent/40">Site Operational Budget (KES)</Label>
                    <Input type="number" value={project.operationalBudget || ""} onChange={(e) => updateClientProject(project.id, { operationalBudget: parseInt(e.target.value) })} className="rounded-none border-accent/10" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-headline italic">Network Matrix</h2>
                <Button variant="outline" className="rounded-none h-12 uppercase tracking-widest text-[9px] flex gap-2">
                  <Plus className="h-4 w-4" /> Allocate Partner
                </Button>
              </div>
              <div className="space-y-6">
                {(project.vendorAllocations || []).map((v, i) => (
                  <div key={v.id} className="p-8 border border-accent/5 bg-white shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="h-12 w-12 bg-secondary/30 flex items-center justify-center text-accent/40 font-bold text-xs">{v.vendorName[0]}</div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-headline italic">{v.vendorName}</h4>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{v.role} • {v.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-accent/40 mb-1">Cost Model</p>
                      <Badge variant="secondary" className="rounded-none uppercase tracking-widest text-[8px]">{v.costType}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- LEDGER TAB --- */}
        <TabsContent value="ledger" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-8">
                <div className="flex items-center gap-3"><Wallet className="h-5 w-5 text-accent/40" /><h3 className="text-xl font-headline italic">Installment Schedule</h3></div>
                <div className="space-y-6">
                  {project.installments.map((ins, i) => (
                    <div key={i} className={`p-8 border flex items-center justify-between ${ins.status === 'Paid' ? 'border-green-600/20 bg-green-600/5' : 'border-accent/10 bg-secondary/5'}`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">{ins.label}</span>
                          <Badge className={`rounded-none uppercase tracking-widest text-[8px] ${ins.status === 'Paid' ? 'bg-green-600 text-white' : 'bg-accent/10 text-accent border-accent/20'}`}>{ins.status}</Badge>
                        </div>
                        <p className="text-2xl font-headline italic text-accent">KES {ins.amount.toLocaleString()}</p>
                      </div>
                      <Button variant="outline" onClick={() => handleToggleInstallment(i)} className="rounded-none h-12 uppercase tracking-widest text-[10px] border-accent/20">
                        {ins.status === 'Paid' ? 'Revoke Payment' : 'Verify Receipt'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-none border-accent/10 bg-accent p-12 text-white shadow-2xl">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-10">Financial Health</h3>
                <div className="space-y-10">
                   <div className="space-y-1">
                     <p className="text-[10px] uppercase tracking-widest text-white/40">Authorized Budget</p>
                     <p className="text-3xl font-headline italic">KES {project.totalBudget.toLocaleString()}</p>
                   </div>
                   <div className="space-y-1 border-t border-white/10 pt-8">
                     <p className="text-[10px] uppercase tracking-widest text-white/40">Audit Protocol Status</p>
                     <div className="flex items-center gap-3">
                       {project.financialReportStatus === 'Verified' ? <FileCheck className="h-5 w-5 text-green-400" /> : <Building2 className="h-5 w-5 text-white/20" />}
                       <span className="text-xl font-headline italic">{project.financialReportStatus || "Pending"}</span>
                     </div>
                   </div>
                   {project.financialReportStatus !== 'Verified' && (
                     <Button onClick={handleVerifyAudit} className="w-full h-14 bg-white text-accent hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px] font-bold mt-4 shadow-2xl">
                       Authorize Steward Audit
                     </Button>
                   )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
