"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  PencilRuler, 
  Mail, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2,
  Lock,
  ChevronRight,
  MoreVertical,
  Briefcase,
  History,
  Activity,
  UserPlus,
  ArrowUpRight,
  Key,
  Eye,
  LayoutList,
  BadgeCheck,
  Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWhyteStore, Designer, ClientProject } from "@/store/use-whyte-store";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DesignerRegistryPage() {
  const { designers, addDesigner, updateDesigner, removeDesigner, clientProjects, updateClientProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "Architectural Interior Design",
    role: "Interior Designer",
    experienceLevel: "Professional" as Designer['experienceLevel'],
    accessToken: "",
    status: "Active" as Designer['status']
  });

  const generateRandomToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `WHYTE-${part1}-${part2}`;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredDesigners = useMemo(() => {
    return designers.filter(d => 
      d.name.toLowerCase().includes(search.toLowerCase()) || 
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      d.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [designers, search]);

  const handleAddDesigner = () => {
    if (!formData.name || !formData.email || !formData.accessToken) return;
    const newDesigner: Designer = {
      id: `DES-${Math.floor(Math.random() * 9000) + 1000}`,
      ...formData,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    addDesigner(newDesigner);
    setIsAddDialogOpen(false);
    setFormData({ 
      name: "", 
      email: "", 
      specialty: "Architectural Interior Design", 
      role: "Interior Designer",
      experienceLevel: "Professional",
      accessToken: "", 
      status: "Active" 
    });
    toast({ title: "Designer Authorized", description: `${newDesigner.name} registered in studio hierarchy.` });
  };

  const handleAssignProject = (projectId: string) => {
    if (!selectedDesigner) return;
    updateClientProject(projectId, { 
      assignedDesignerId: selectedDesigner.id,
      lastActivity: `Creative Lead Assigned: ${selectedDesigner.name}`
    });
    toast({ title: "Commission Assigned", description: `Dossier ${projectId} linked to ${selectedDesigner.name}.` });
    setIsAssignDialogOpen(false);
  };

  const handleRemove = (id: string) => {
    removeDesigner(id);
    toast({ title: "Profile Archived", variant: "destructive" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return "bg-green-600 text-white";
      case 'On Leave': return "bg-orange-500 text-white";
      case 'Inactive': return "bg-neutral-400 text-white";
      default: return "bg-secondary";
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'Expert': return "text-accent border-accent/20 bg-accent/5";
      case 'Professional': return "text-blue-600 border-blue-100 bg-blue-50";
      case 'Beginner': return "text-muted-foreground border-neutral-100 bg-neutral-50";
      default: return "";
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Creative Hierarchy</span>
          </div>
          <h1 className="text-5xl font-headline italic">Designer <span className="not-italic">Registry.</span></h1>
        </div>
        
        <div className="flex gap-4">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            <input 
              placeholder="Search registry..." 
              className="w-full pl-12 pr-4 rounded-none border border-accent/10 h-14 text-[13px] uppercase tracking-widest bg-white focus:outline-none focus:border-accent shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => {
              setFormData(prev => ({ ...prev, accessToken: generateRandomToken(), name: "", email: "" }));
              setIsAddDialogOpen(true);
            }}
            className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold flex gap-3 shadow-xl hover:tracking-[0.2em] transition-all"
          >
            <UserPlus className="h-5 w-5" /> Register Designer
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDesigners.map((designer, index) => {
            const assignedProjects = clientProjects.filter(p => p.assignedDesignerId === designer.id && !p.isArchived);
            const accessedLogsCount = (clientProjects.reduce((acc, p) => acc + (p.siteReports?.length || 0), 0) / Math.max(1, designers.length)).toFixed(0);

            return (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-none border-accent/5 shadow-xl bg-white overflow-hidden group">
                  <div className="flex flex-col lg:flex-row items-stretch">
                    <div className="p-8 border-b lg:border-b-0 lg:border-r border-accent/5 bg-secondary/5 flex flex-col justify-between min-w-[320px]">
                      <div className="space-y-6">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-none bg-accent flex items-center justify-center text-white font-headline italic text-2xl shadow-lg">
                            {designer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-2xl font-headline italic text-accent">{designer.name}</h3>
                              {designer.experienceLevel === 'Expert' && <BadgeCheck className="h-4 w-4 text-accent" />}
                            </div>
                            <Badge className={cn("rounded-none uppercase tracking-widest text-[9px] font-bold py-0.5 px-2", getStatusColor(designer.status))}>
                              {designer.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-accent/5">
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                            <Award className="h-3.5 w-3.5 opacity-40" /> {designer.role}
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                            <Activity className="h-3.5 w-3.5 opacity-40" /> {designer.specialty}
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                            <Mail className="h-3.5 w-3.5 opacity-40" /> {designer.email}
                          </div>
                        </div>
                      </div>
                      <div className="pt-8 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={cn("rounded-none text-[9px] uppercase tracking-widest font-bold", getExperienceColor(designer.experienceLevel))}>
                            {designer.experienceLevel} Tier
                          </Badge>
                        </div>
                        <div className="p-4 bg-accent/[0.03] border border-accent/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Access Token</span>
                            <Key className="h-3 w-3 text-accent/20" />
                          </div>
                          <code className="text-sm font-mono tracking-widest text-accent font-bold block">{designer.accessToken}</code>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40 flex items-center gap-3">
                            <Briefcase className="h-4 w-4" /> Implementation Load ({assignedProjects.length})
                          </h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => { setSelectedDesigner(designer); setIsAssignDialogOpen(true); }}
                            className="rounded-none text-[10px] font-bold uppercase tracking-widest text-accent hover:bg-accent/5"
                          >
                            <Plus className="h-3.5 w-3.5 mr-2" /> Assign Dossier
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {assignedProjects.map(p => (
                            <Link key={p.id} href={`/admin/clients/${p.id}`} className="p-4 border border-accent/5 hover:border-accent/20 transition-all flex flex-col justify-between group/p">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold text-accent/30 uppercase tracking-widest">{p.id}</span>
                                <div className="flex gap-2">
                                  <Badge variant="ghost" className="text-[8px] uppercase tracking-widest p-0">{p.status}</Badge>
                                  <Eye className="h-3 w-3 text-accent/20" />
                                </div>
                              </div>
                              <p className="text-sm font-bold uppercase tracking-widest text-accent/80 group-hover/p:text-accent mt-2">{p.project}</p>
                            </Link>
                          ))}
                          {assignedProjects.length === 0 && (
                            <div className="col-span-full py-8 text-center border border-dashed border-accent/10 italic text-[11px] text-muted-foreground uppercase tracking-widest">
                              No active implementation dossiers assigned
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end pt-8 border-t border-accent/5 mt-8 gap-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemove(designer.id)}
                          className="h-10 w-10 text-destructive/20 hover:text-destructive hover:bg-destructive/5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="rounded-none h-10 px-6 uppercase tracking-widest text-[10px] font-bold border-accent/10 text-accent">
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg p-0 overflow-hidden bg-white">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Creative Authorization</span>
              </div>
              <DialogTitle className="text-4xl font-headline italic">Register Designer</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base">
                Authorize a new creative lead within the studio hierarchy and assign their professional designation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Full Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Creative Identity" className="rounded-none h-14 border-accent/20" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Studio Role</Label>
                  <Input value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="E.g., Senior Architect" className="rounded-none h-12 border-accent/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Experience Tier</Label>
                  <Select value={formData.experienceLevel} onValueChange={(v: any) => setFormData({...formData, experienceLevel: v})}>
                    <SelectTrigger className="rounded-none border-accent/20 h-12 text-sm font-bold uppercase"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Specialty Registry</Label>
                <Input value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} placeholder="E.g., Minimalism & Textures" className="rounded-none h-12 border-accent/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Communication Protocol (Email)</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="designer@whyte.design" className="rounded-none h-12 border-accent/20" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Access Token</Label>
                  <Input value={formData.accessToken} onChange={(e) => setFormData({...formData, accessToken: e.target.value})} placeholder="AUTO-GENERATED" className="rounded-none h-12 border-accent/20 uppercase font-bold tracking-widest bg-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Status Protocol</Label>
                  <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="rounded-none border-accent/20 h-12 text-sm font-bold uppercase"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDesigner} disabled={!formData.name || !formData.email || !formData.accessToken} className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em]">
                Authorize Designer Entry
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-md p-0 overflow-hidden bg-white">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3"><Briefcase className="h-5 w-5 text-accent" /><span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Tactical Assignment</span></div>
              <DialogTitle className="text-3xl font-headline italic">Assign Project</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground">Select an active implementation dossier for <strong>{selectedDesigner?.name}</strong>.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Available Dossiers</Label>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {clientProjects.filter(p => p.assignedDesignerId !== selectedDesigner?.id && !p.isArchived).map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => handleAssignProject(p.id)}
                    className="w-full text-left p-4 border border-accent/10 hover:bg-accent hover:text-white transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white/60">{p.id}</span>
                      </div>
                      <Badge variant="ghost" className="text-[8px] uppercase tracking-widest p-0 group-hover:text-white/80">{p.status}</Badge>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest mt-1">{p.project}</p>
                  </button>
                ))}
                {clientProjects.filter(p => !p.isArchived).length === 0 && (
                  <p className="text-center py-8 text-[11px] uppercase tracking-widest text-muted-foreground italic">No active dossiers in current cycle</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}