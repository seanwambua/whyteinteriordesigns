
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Search, 
  Plus, 
  ShieldCheck, 
  Trash2, 
  Mail, 
  Phone, 
  Clock, 
  FileCheck,
  Award,
  MoreVertical,
  CheckCircle2,
  Settings2,
  Landmark,
  UserPlus,
  Loader2,
  Scale,
  Key,
  ShieldAlert,
  Zap,
  Activity,
  Banknote,
  FileSearch,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { useWhyteStore, Steward, ClientProject } from "@/store/use-whyte-store";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function StewardRegistryPage() {
  const { stewards, addSteward, updateSteward, removeSteward, financialSteward, setFinancialSteward, clientProjects } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateRandomToken = () => {
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `WHYTE-STWD-${part1}-${part2}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    accessToken: "",
    status: "Active" as Steward['status']
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredStewards = useMemo(() => {
    return stewards.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [stewards, search]);

  const handleAddSteward = () => {
    if (!formData.name || !formData.email || !formData.accessToken) return;
    setIsSubmitting(true);
    
    const newSteward: Steward = {
      id: `STW-${Math.floor(Math.random() * 9000) + 1000}`,
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      accessToken: formData.accessToken,
      status: formData.status,
      authorizedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      totalAudits: 0
    };

    setTimeout(() => {
      addSteward(newSteward);
      setIsSubmitting(false);
      setIsAddDialogOpen(false);
      setFormData({ name: "", email: "", contact: "", accessToken: "", status: "Active" });
      toast({ title: "Steward Authorized", description: `${newSteward.name} registered in studio protocol.` });
    }, 1200);
  };

  const handleRemove = (id: string) => {
    removeSteward(id);
    toast({ title: "Entity De-authorized", variant: "destructive" });
  };

  const handleSetPrimary = (name: string) => {
    setFinancialSteward(name);
    toast({ title: "Primary Steward Calibrated", description: `${name} is now the lead reconciliation entity.` });
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Governance Protocol</span>
          </div>
          <h1 className="text-5xl font-headline italic">Steward <span className="not-italic">Registry.</span></h1>
        </div>
        
        <div className="flex gap-4">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            <input 
              placeholder="Search entities..." 
              className="w-full pl-12 pr-4 rounded-none border border-accent/10 h-14 text-[13px] uppercase tracking-widest bg-white focus:outline-none focus:border-accent shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => {
              setFormData(prev => ({ ...prev, accessToken: generateRandomToken(), name: "", email: "", contact: "" }));
              setIsAddDialogOpen(true);
            }}
            className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[12px] font-bold flex gap-3 shadow-xl hover:tracking-[0.2em] transition-all"
          >
            <UserPlus className="h-5 w-5" /> Register Steward
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredStewards.map((steward, index) => {
            const isPrimary = financialSteward === steward.name;
            
            // OPERATIONAL METRICS CALCULATION
            const pendingActivations = clientProjects.filter(p => 
              p.assignedStewardId === steward.id && 
              !p.isActivated && 
              p.pendingActivationData
            ).length;

            const activeAudits = clientProjects.filter(p => 
              p.assignedStewardId === steward.id && 
              p.isActivated && 
              p.financialReportStatus !== 'Verified' &&
              (p.status === 'Completion' || p.status === 'Termination')
            ).length;

            const totalLoad = pendingActivations + activeAudits;

            return (
              <motion.div
                key={steward.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "rounded-none border-accent/5 shadow-2xl bg-white overflow-hidden group transition-all",
                  isPrimary ? "border-l-4 border-l-accent" : "hover:border-accent/20"
                )}>
                  <div className="flex flex-col lg:flex-row h-full items-stretch">
                    <div className="p-10 border-b lg:border-b-0 lg:border-r border-accent/5 bg-secondary/5 flex flex-col justify-between min-w-[350px]">
                      <div className="space-y-8">
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "h-16 w-16 rounded-none flex flex-col items-center justify-center shrink-0 border border-accent/5 transition-all shadow-lg",
                            isPrimary ? "bg-accent text-white" : "bg-white text-accent/40"
                          )}>
                            <Building2 className="h-6 w-6" />
                            <span className="text-[8px] font-black uppercase mt-1">STWD</span>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-accent/40 uppercase tracking-widest">{steward.id}</span>
                            <h3 className="text-2xl font-headline italic text-accent leading-tight">{steward.name}</h3>
                            {isPrimary && (
                              <Badge className="rounded-none bg-accent text-white text-[9px] uppercase tracking-widest font-bold py-1 px-3 mt-2">
                                Primary Authorized
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-accent/10">
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                            <Mail className="h-3.5 w-3.5 opacity-40" /> {steward.email}
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                            <Phone className="h-3.5 w-3.5 opacity-40" /> {steward.contact || "N/A"}
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-bold uppercase tracking-widest">
                            <Clock className="h-3.5 w-3.5 opacity-40" /> Authorized: {steward.authorizedDate}
                          </div>
                        </div>
                      </div>

                      <div className="pt-10">
                        <div className="p-4 bg-accent/[0.03] border border-accent/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Authorized Sync Code</span>
                            <Key className="h-3 w-3 text-accent/20" />
                          </div>
                          <code className="text-[11px] font-mono tracking-wider text-accent font-bold block truncate">{steward.accessToken}</code>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-10 lg:p-12 flex flex-col justify-between">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* OPERATIONAL LOAD SECTION */}
                        <div className="space-y-8">
                          <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40 flex items-center gap-3">
                            <Activity className="h-4 w-4" /> Operational Load
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600/60 flex items-center gap-2">
                                <Banknote className="h-3 w-3" /> Pending Activation
                              </p>
                              <p className={cn("text-3xl font-headline italic", pendingActivations > 0 ? "text-orange-600" : "text-accent/20")}>
                                {pendingActivations}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600/60 flex items-center gap-2">
                                <FileSearch className="h-3 w-3" /> Active Audits
                              </p>
                              <p className={cn("text-3xl font-headline italic", activeAudits > 0 ? "text-blue-600" : "text-accent/20")}>
                                {activeAudits}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2 pt-4">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-accent/40">
                              <span>Load Intensity Index</span>
                              <span>{Math.min(100, totalLoad * 20)}%</span>
                            </div>
                            <Progress value={totalLoad * 20} className="h-1 bg-accent/5 rounded-none" />
                          </div>
                        </div>

                        {/* HISTORICAL PERFORMANCE */}
                        <div className="space-y-8">
                          <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent/40 flex items-center gap-3">
                            <History className="h-4 w-4" /> Stewardship History
                          </h4>
                          <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Concluded Reconciliations</p>
                              <div className="flex items-center gap-3">
                                <Scale className="h-5 w-5 text-accent/40" />
                                <span className="text-3xl font-headline italic text-accent">{steward.totalAudits}</span>
                              </div>
                            </div>
                            <p className="text-[11px] font-light italic text-muted-foreground leading-relaxed">
                              This entity is responsible for forensic activation and final capital certification for all assigned dossiers.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-10 border-t border-accent/5 mt-12">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className={cn(
                            "rounded-none px-4 py-1.5 uppercase tracking-widest text-[9px] font-bold border-accent/10 transition-all",
                            steward.status === 'Active' ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-50 text-slate-400"
                          )}>
                            Registry Status: {steward.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4">
                          {!isPrimary && (
                            <Button 
                              onClick={() => handleSetPrimary(steward.name)}
                              variant="outline" 
                              className="rounded-none h-12 px-8 uppercase tracking-widest text-[10px] font-bold border-accent/10 hover:bg-accent hover:text-white transition-all shadow-sm flex gap-3"
                            >
                              <Settings2 className="h-4 w-4" /> Set as Primary
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleRemove(steward.id)}
                            variant="ghost" 
                            size="icon" 
                            className="h-12 w-12 text-accent/20 hover:text-destructive hover:bg-destructive/5 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredStewards.length === 0 && (
          <div className="text-center py-40 border border-dashed border-accent/10 bg-secondary/5 italic text-[12px] uppercase tracking-[0.3em] font-light">
            No authorized stewardship entities found in the current registry
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg p-0 overflow-hidden bg-white">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Authorization Protocol</span>
              </div>
              <DialogTitle className="text-4xl font-headline italic">Register Steward</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base leading-relaxed">
                Authorize a new professional entity. A unique **Stewardship Code** has been auto-generated for synchronization.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Entity Identity</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="E.g., Imani Financial Services"
                  className="rounded-none h-14 border-accent/20 text-lg focus:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Professional Email Protocol</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="compliance@entity.com"
                  className="rounded-none border-accent/20 h-12 text-base focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Direct Contact</Label>
                  <Input 
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="+254 XXX XXX XXX"
                    className="rounded-none border-accent/20 h-12 text-base focus:ring-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Initial Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v: any) => setFormData({...formData, status: v})}
                  >
                    <SelectTrigger className="rounded-none border-accent/20 h-12 text-sm font-bold uppercase tracking-widest">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Active">Authorized Active</SelectItem>
                      <SelectItem value="Inactive">Awaiting Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-6 bg-accent/[0.03] border border-dashed border-accent/20 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-accent">Auto-Generated Code</Label>
                  <ShieldAlert className="h-3 w-3 text-accent/40" />
                </div>
                <Input 
                  value={formData.accessToken} 
                  readOnly
                  className="rounded-none border-none h-12 bg-transparent font-mono tracking-[0.2em] uppercase font-bold text-lg p-0 focus-visible:ring-0"
                />
                <p className="text-[9px] text-muted-foreground italic uppercase tracking-widest">Unique identifier required for portal synchronization.</p>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em]"
                onClick={handleAddSteward}
                disabled={isSubmitting || !formData.name || !formData.email}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Authorizing Entry...</span>
                ) : "Authorize Steward Entry"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
