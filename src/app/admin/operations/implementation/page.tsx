
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  Clock, 
  Truck, 
  Plus, 
  Activity, 
  ChevronRight, 
  LayoutGrid,
  List,
  MoreVertical,
  CheckCircle2,
  Filter,
  ArrowRight,
  MoreHorizontal
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useWhyteStore, ClientProject, ProjectTask, SiteReport } from "@/store/use-whyte-store";
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
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function ProjectImplementationPage() {
  const router = useRouter();
  const { clientProjects, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    priority: "Medium" as ProjectTask['priority'],
    assignedVendor: ""
  });

  useEffect(() => {
    setIsMounted(true);
    // Auto-select first active project if none selected
    const active = clientProjects.find(p => p.isActivated);
    if (active && !selectedProjectId) {
      setSelectedProjectId(active.id);
    }
  }, [clientProjects, selectedProjectId]);

  if (!isMounted) return null;

  const liveProjects = clientProjects.filter(p => 
    p.isActivated && (p.status === 'Execution' || p.status === 'Styling' || p.status === 'Procurement' || p.status === 'Completed')
  );

  const selectedProject = liveProjects.find(p => p.id === selectedProjectId);

  const handleUpdateTaskStatus = (taskId: string, newStatus: ProjectTask['status']) => {
    if (!selectedProject) return;

    const updatedTasks = (selectedProject.tasks || []).map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );

    // Calculate velocity: (Done tasks / Total tasks) * 100
    const doneTasks = updatedTasks.filter(t => t.status === 'Done').length;
    const totalTasks = updatedTasks.length;
    const newProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : selectedProject.progress;

    updateClientProject(selectedProject.id, { 
      tasks: updatedTasks,
      progress: newProgress,
      lastActivity: `Task status updated: ${updatedTasks.find(t => t.id === taskId)?.title}`
    });

    toast({
      title: "Task Synchronized",
      description: `Velocity recalculated to ${newProgress}%.`,
    });
  };

  const handleAddTask = () => {
    if (!selectedProject || !newTaskForm.title) return;

    const newTask: ProjectTask = {
      id: `T-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      title: newTaskForm.title,
      status: "Todo",
      priority: newTaskForm.priority,
      assignedVendor: newTaskForm.assignedVendor
    };

    const updatedTasks = [...(selectedProject.tasks || []), newTask];
    
    // Recalculate progress with new task added
    const doneTasks = updatedTasks.filter(t => t.status === 'Done').length;
    const totalTasks = updatedTasks.length;
    const newProgress = Math.round((doneTasks / totalTasks) * 100);

    updateClientProject(selectedProject.id, { 
      tasks: updatedTasks,
      progress: newProgress,
      lastActivity: `New Task Assigned: ${newTask.title}`
    });

    setIsTaskDialogOpen(false);
    setNewTaskForm({ title: "", priority: "Medium", assignedVendor: "" });
    toast({
      title: "Task Registered",
      description: "Architectural task appended to project workflow.",
    });
  };

  const KanbanColumn = ({ status, title, color }: { status: ProjectTask['status'], title: string, color: string }) => {
    const tasks = (selectedProject?.tasks || []).filter(t => t.status === status);
    
    return (
      <div className="flex-1 min-w-[300px] bg-secondary/5 border border-accent/5 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/60">{title}</h3>
          </div>
          <Badge variant="outline" className="rounded-none text-[9px] border-accent/10 opacity-40">{tasks.length}</Badge>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layoutId={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-accent/5 shadow-md p-6 space-y-4 group hover:border-accent/20 transition-all cursor-grab active:cursor-grabbing"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-accent/30 uppercase tracking-widest">{task.id}</span>
                  <h4 className="text-sm font-bold uppercase tracking-widest leading-tight group-hover:text-accent transition-colors">{task.title}</h4>
                </div>
                <Badge variant="ghost" className="text-[8px] uppercase tracking-widest opacity-40 p-0 h-auto">{task.priority}</Badge>
              </div>

              {task.assignedVendor && (
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                  <Truck className="h-3 w-3 opacity-40" /> {task.assignedVendor}
                </div>
              )}

              <div className="flex items-center justify-end pt-4 border-t border-accent/5 gap-2">
                {status !== 'Todo' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-accent/5 text-accent/40"
                    onClick={() => handleUpdateTaskStatus(task.id, status === 'Done' ? 'In Progress' : 'Todo')}
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                )}
                {status !== 'Done' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-accent/5 text-accent/40"
                    onClick={() => handleUpdateTaskStatus(task.id, status === 'Todo' ? 'In Progress' : 'Done')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
          {tasks.length === 0 && (
            <div className="h-32 border border-dashed border-accent/10 flex items-center justify-center">
              <p className="text-[9px] uppercase tracking-widest text-accent/20 italic">Empty Stack</p>
            </div>
          )}
        </div>
      </div>
    );
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
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="bg-white border border-accent/5 shadow-xl flex p-1">
            <Button 
              variant={view === 'kanban' ? 'secondary' : 'ghost'} 
              className={`rounded-none h-10 px-4 flex gap-2 uppercase tracking-widest text-[9px] font-bold ${view === 'kanban' ? 'bg-accent text-white hover:bg-accent' : ''}`}
              onClick={() => setView('kanban')}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Task Kanban
            </Button>
            <Button 
              variant={view === 'list' ? 'secondary' : 'ghost'} 
              className={`rounded-none h-10 px-4 flex gap-2 uppercase tracking-widest text-[9px] font-bold ${view === 'list' ? 'bg-accent text-white hover:bg-accent' : ''}`}
              onClick={() => setView('list')}
            >
              <List className="h-3.5 w-3.5" /> Project Index
            </Button>
          </div>

          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[250px] rounded-none border-accent/10 h-12 uppercase tracking-widest text-[10px] font-bold">
              <SelectValue placeholder="Select Active Project" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-accent/10">
              {liveProjects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.project}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {view === 'kanban' && selectedProjectId && (
            <Button 
              onClick={() => setIsTaskDialogOpen(true)}
              className="bg-accent text-white rounded-none h-12 px-6 uppercase tracking-widest text-[10px] flex gap-2"
            >
              <Plus className="h-4 w-4" /> New Task
            </Button>
          )}
        </div>
      </motion.div>

      {selectedProject ? (
        <>
          <div className="flex items-center justify-between p-8 bg-white border border-accent/5 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 h-1 w-full bg-accent/5" />
            <div className="flex items-center gap-8">
              <div className="h-16 w-16 bg-secondary/30 rounded-full flex items-center justify-center text-accent font-headline text-2xl italic border border-accent/5">
                {selectedProject.project[0]}
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-headline italic">{selectedProject.project}</h2>
                <div className="flex items-center gap-4 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                  <span>{selectedProject.name}</span>
                  <div className="h-1 w-1 bg-accent/20 rounded-full" />
                  <span>{selectedProject.status} Phase</span>
                  <div className="h-1 w-1 bg-accent/20 rounded-full" />
                  <span className="text-accent">{selectedProject.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-12">
              <div className="text-right space-y-2 min-w-[200px]">
                <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-accent/40">
                  <span>Velocity</span>
                  <span>{selectedProject.progress}%</span>
                </div>
                <Progress value={selectedProject.progress} className="h-1 bg-secondary rounded-none" />
              </div>
              <Button asChild variant="ghost" className="h-12 w-12 rounded-full border border-accent/10 hover:bg-accent hover:text-white p-0">
                <Link href={`/admin/clients/${selectedProject.id}`}><ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>

          {view === 'kanban' ? (
            <div className="flex gap-8 overflow-x-auto pb-12 custom-scrollbar">
              <KanbanColumn status="Todo" title="Backlog / To-Do" color="bg-orange-400" />
              <KanbanColumn status="In Progress" title="In Implementation" color="bg-accent" />
              <KanbanColumn status="Done" title="Task Completed" color="bg-green-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {liveProjects.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-8 bg-white border cursor-pointer transition-all ${
                    selectedProjectId === p.id ? 'border-accent shadow-xl ring-1 ring-accent/10' : 'border-accent/5 shadow-md hover:border-accent/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-headline italic">{p.project}</h3>
                        <Badge variant="outline" className="rounded-none text-[8px] uppercase tracking-widest font-bold">{p.status}</Badge>
                      </div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Client: {p.name} • {p.id}</p>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-widest text-accent/40 block">Implementation Velocity</span>
                        <span className="text-lg font-headline italic">{p.progress}%</span>
                      </div>
                      <Button asChild variant="ghost" className="h-10 w-10 p-0" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/admin/clients/${p.id}`}><ChevronRight className="h-5 w-5" /></Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-32 border border-dashed border-accent/10 bg-secondary/5 space-y-6">
          <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No active implementation projects prioritized</p>
          <Button asChild variant="outline" className="rounded-none uppercase tracking-widest text-[10px]">
            <Link href="/admin/operations/planning">View Planning Briefs</Link>
          </Button>
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Workflow Assignment</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">Define New Task</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Add a granular implementation task for {selectedProject?.project}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Task Objective</Label>
              <Input 
                value={newTaskForm.title}
                onChange={(e) => setNewTaskForm({...newTaskForm, title: e.target.value})}
                placeholder="E.g., Site Measurement Verification"
                className="rounded-none border-accent/20 h-12 focus:ring-accent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Urgency Protocol</Label>
                <Select value={newTaskForm.priority} onValueChange={(v: any) => setNewTaskForm({...newTaskForm, priority: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Low">Low Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="High">High Urgency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Vendor Assignment</Label>
                <Select value={newTaskForm.assignedVendor} onValueChange={(v) => setNewTaskForm({...newTaskForm, assignedVendor: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue placeholder="Select Vendor" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {selectedProject?.vendorAllocations?.map(v => (
                      <SelectItem key={v.id} value={v.vendorName}>{v.vendorName}</SelectItem>
                    ))}
                    <SelectItem value="Internal Team">Internal Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[10px] font-bold shadow-2xl"
              onClick={handleAddTask}
              disabled={!newTaskForm.title}
            >
              Assign to Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
