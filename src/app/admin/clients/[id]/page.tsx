
"use client";

import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, Milestone, VendorAllocation } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Wallet,
  Layout,
  HardHat,
  Package,
  Clock,
  Hammer
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function ProjectManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject, collaborators } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
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

  const handleToggleMilestone = (index: number) => {
    const updatedMilestones = [...project.milestones];
    updatedMilestones[index] = { 
      ...updatedMilestones[index], 
      isCompleted: !updatedMilestones[index].isCompleted 
    };
    
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

  const addVendorAllocation = () => {
    const newAllocation: VendorAllocation = {
      id: `VA-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      vendorName: "",
      role: "",
      costType: "Daily",
      costValue: 0,
      timelineDays: 1,
      materials: []
    };
    updateClientProject(project.id, {
      vendorAllocations: [...(project.vendorAllocations || []), newAllocation]
    });
  };

  const updatePlanning = (field: keyof ClientProject, value: any) => {
    updateClientProject(project.id, { [field]: value });
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

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-12">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0">Overview</TabsTrigger>
          <TabsTrigger value="planning" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0">Resource Architect</TabsTrigger>
          <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0">Financial Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-12 m-0">
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
                </div>

                <div className="space-y-4">
                  {project.milestones.map((milestone, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
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
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
               <Card className="rounded-none border-accent/5 shadow-xl bg-white p-8 space-y-6">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">Technical Brief</h3>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center pb-4 border-b border-accent/5">
                     <span className="text-[10px] uppercase tracking-widest opacity-60">Spatial Scale</span>
                     <span className="text-sm font-bold">{project.roomsCount || 'N/A'} Rooms</span>
                   </div>
                   <div className="space-y-2">
                     <span className="text-[10px] uppercase tracking-widest opacity-60">Work Scope</span>
                     <p className="text-xs font-light italic leading-relaxed text-muted-foreground">{project.workScope || 'Scope not yet defined.'}</p>
                   </div>
                 </div>
               </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="m-0 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-8">
                <div className="flex items-center gap-3">
                  <Layout className="h-5 w-5 text-accent/40" />
                  <h3 className="text-xl font-headline italic">Spatial Configuration</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-accent/40">Total Room Count</Label>
                    <Input 
                      type="number" 
                      value={project.roomsCount || ""} 
                      onChange={(e) => updatePlanning('roomsCount', parseInt(e.target.value))}
                      className="rounded-none border-accent/10 focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-accent/40">Architectural Scope</Label>
                    <Textarea 
                      value={project.workScope || ""} 
                      onChange={(e) => updatePlanning('workScope', e.target.value)}
                      className="rounded-none border-accent/10 focus:ring-accent min-h-[150px] resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase tracking-widest text-accent/40">Site Operational Budget (KES)</Label>
                    <Input 
                      type="number" 
                      value={project.operationalBudget || ""} 
                      onChange={(e) => updatePlanning('operationalBudget', parseInt(e.target.value))}
                      className="rounded-none border-accent/10 focus:ring-accent"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <HardHat className="h-5 w-5 text-accent" />
                  <h2 className="text-2xl font-headline italic">Trade & Vendor Matrix</h2>
                </div>
                <Button onClick={addVendorAllocation} variant="outline" className="rounded-none h-12 uppercase tracking-widest text-[9px] flex gap-2">
                  <Plus className="h-4 w-4" /> Allocate Trade
                </Button>
              </div>

              <div className="space-y-6">
                {(project.vendorAllocations || []).map((allocation, idx) => (
                  <motion.div
                    key={allocation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 border border-accent/5 bg-white shadow-xl space-y-8"
                  >
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                        <div className="space-y-2">
                          <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Partner Identity</Label>
                          <Select 
                            value={allocation.vendorName} 
                            onValueChange={(v) => {
                              const updated = [...(project.vendorAllocations || [])];
                              updated[idx].vendorName = v;
                              updatePlanning('vendorAllocations', updated);
                            }}
                          >
                            <SelectTrigger className="rounded-none border-accent/10 h-10">
                              <SelectValue placeholder="Select Collaborator" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                              {collaborators.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Architectural Role</Label>
                          <Input 
                            value={allocation.role} 
                            onChange={(e) => {
                              const updated = [...(project.vendorAllocations || [])];
                              updated[idx].role = e.target.value;
                              updatePlanning('vendorAllocations', updated);
                            }}
                            className="rounded-none border-accent/10 h-10"
                          />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/40 hover:text-destructive ml-4">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-accent/5">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Compensation Model</Label>
                        <div className="flex gap-2">
                          <Button 
                            variant={allocation.costType === 'Daily' ? 'default' : 'outline'}
                            onClick={() => {
                              const updated = [...(project.vendorAllocations || [])];
                              updated[idx].costType = 'Daily';
                              updatePlanning('vendorAllocations', updated);
                            }}
                            className="rounded-none flex-1 h-10 text-[9px] uppercase tracking-widest"
                          >Daily</Button>
                          <Button 
                            variant={allocation.costType === 'Percentage' ? 'default' : 'outline'}
                            onClick={() => {
                              const updated = [...(project.vendorAllocations || [])];
                              updated[idx].costType = 'Percentage';
                              updatePlanning('vendorAllocations', updated);
                            }}
                            className="rounded-none flex-1 h-10 text-[9px] uppercase tracking-widest"
                          >% Project</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Rate / Percentage</Label>
                        <Input 
                          type="number"
                          value={allocation.costValue} 
                          onChange={(e) => {
                            const updated = [...(project.vendorAllocations || [])];
                            updated[idx].costValue = parseFloat(e.target.value);
                            updatePlanning('vendorAllocations', updated);
                          }}
                          className="rounded-none border-accent/10 h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Deployment Window (Days)</Label>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-accent/20" />
                          <Input 
                            type="number"
                            value={allocation.timelineDays} 
                            onChange={(e) => {
                              const updated = [...(project.vendorAllocations || [])];
                              updated[idx].timelineDays = parseInt(e.target.value);
                              updatePlanning('vendorAllocations', updated);
                            }}
                            className="rounded-none border-accent/10 h-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Label className="text-[9px] font-bold uppercase tracking-widest opacity-40">Shared Material Lists</Label>
                      <div className="flex gap-2 flex-wrap">
                        {allocation.materials.map((mat, mIdx) => (
                          <Badge key={mIdx} variant="secondary" className="rounded-none px-3 py-1 flex gap-2 items-center">
                            {mat} <XCircle className="h-3 w-3 opacity-40 cursor-pointer" />
                          </Badge>
                        ))}
                        <Button variant="ghost" className="h-6 px-2 text-[9px] uppercase tracking-widest text-accent/40 border border-dashed border-accent/20 rounded-none">
                          <Plus className="h-3 w-3 mr-1" /> Add Material
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="m-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
               <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-10">
                 <div className="flex items-center gap-3">
                   <Wallet className="h-5 w-5 text-accent/40" />
                   <h3 className="text-xl font-headline italic">Installment Schedule</h3>
                 </div>
                 
                 <div className="space-y-6">
                   {project.installments.map((ins, i) => (
                     <div key={i} className={`p-8 border flex items-center justify-between ${ins.status === 'Paid' ? 'border-green-600/20 bg-green-600/5' : 'border-accent/10 bg-secondary/5'}`}>
                       <div className="space-y-2">
                         <div className="flex items-center gap-4">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">{ins.label}</span>
                           <Badge className={`rounded-none uppercase tracking-widest text-[8px] ${
                             ins.status === 'Paid' ? 'bg-green-600 text-white' : 'bg-accent/10 text-accent border-accent/20'
                           }`}>
                             {ins.status}
                           </Badge>
                         </div>
                         <p className="text-2xl font-headline italic text-accent">KES {ins.amount.toLocaleString()}</p>
                       </div>
                       {ins.status === 'Pending' && (
                         <Button variant="outline" className="rounded-none h-12 uppercase tracking-widest text-[9px] border-accent/20">Verify Receipt</Button>
                       )}
                     </div>
                   ))}
                 </div>
               </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-none border-accent/5 bg-accent p-12 text-white">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-10">Financial Health</h3>
                <div className="space-y-8">
                   <div className="space-y-1">
                     <p className="text-[10px] uppercase tracking-widest text-white/40">Authorized Budget</p>
                     <p className="text-3xl font-headline italic">KES {project.totalBudget.toLocaleString()}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] uppercase tracking-widest text-white/40">Liquid Operational Pool</p>
                     <p className="text-3xl font-headline italic text-white/60">KES {(project.operationalBudget || 0).toLocaleString()}</p>
                   </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function XCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}
