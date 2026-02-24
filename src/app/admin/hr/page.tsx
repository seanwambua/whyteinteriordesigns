"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Users, 
  Compass, 
  HardHat, 
  Star, 
  Mail, 
  Phone, 
  ShieldCheck, 
  MoreVertical, 
  Trash2, 
  Filter,
  BadgeCheck,
  Building2,
  Globe,
  Loader2,
  ChevronRight,
  Activity,
  UserPlus,
  ShieldAlert,
  Zap
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWhyteStore, Collaborator } from "@/store/use-whyte-store";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function NetworkEcosystemPage() {
  const { collaborators, addCollaborator, removeCollaborator } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    category: "Collaborator" as Collaborator['category'],
    specialty: "",
    contact: "",
    email: "",
    rating: "5.0",
    status: "active" as Collaborator['status'],
    type: "Individual Artisan",
    subType: "Local"
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = useMemo(() => {
    return [
      { label: "Total Network", value: collaborators.length.toString(), icon: Users },
      { label: "Business Partners", value: collaborators.filter(c => c.category === 'Collaborator').length.toString(), icon: Compass },
      { label: "Trade Specialists", value: collaborators.filter(c => c.category === 'Vendor').length.toString(), icon: HardHat },
      { label: "Elite Rating", value: "4.9", icon: BadgeCheck },
    ];
  }, [collaborators]);

  if (!isMounted) return null;

  const filteredResources = collaborators.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                           (activeCategory === 'partners' && c.category === 'Collaborator') || 
                           (activeCategory === 'trades' && c.category === 'Vendor');
    return matchesSearch && matchesCategory;
  });

  const handleAddResource = () => {
    if (!formData.name || !formData.specialty || !formData.email) return;
    setIsSubmitting(true);
    
    const newResource: Collaborator = {
      id: `${formData.category === 'Collaborator' ? 'P' : 'V'}-${Math.floor(Math.random() * 9000) + 1000}`,
      name: formData.name,
      category: formData.category,
      specialty: formData.specialty,
      contact: formData.contact,
      email: formData.email,
      rating: parseFloat(formData.rating),
      status: formData.status,
      type: `${formData.type} — ${formData.subType}`
    };

    setTimeout(() => {
      addCollaborator(newResource);
      setIsSubmitting(false);
      setIsAddDialogOpen(false);
      setFormData({ 
        name: "", 
        category: "Collaborator", 
        specialty: "", 
        contact: "", 
        email: "",
        rating: "5.0",
        status: "active", 
        type: "Individual Artisan", 
        subType: "Local" 
      });
      toast({ title: "Resource Synchronized", description: `${newResource.name} authorized in network ecosystem.` });
    }, 1200);
  };

  const handleRemove = (id: string) => {
    removeCollaborator(id);
    toast({ title: "Profile Archived", description: "Resource moved to historical archives.", variant: "destructive" });
  };

  const getStatusBadge = (status: Collaborator['status']) => {
    switch (status) {
      case 'active': return "bg-green-600/5 text-green-600 border-green-600/20";
      case 'on_hold': return "bg-orange-50/5 text-orange-600 border-orange-500/20";
      case 'blacklisted': return "bg-destructive/5 text-destructive border-destructive/20";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Resource Matrix</span>
          </div>
          <h1 className="text-5xl font-headline italic">Network <span className="not-italic">Ecosystem.</span></h1>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/30" />
            <input 
              placeholder="Filter by name or specialty..." 
              className="pl-11 pr-4 h-14 bg-white border border-accent/10 w-80 text-[12px] uppercase tracking-widest focus:outline-none focus:border-accent/40 shadow-xl transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-[0.2em] text-[11px] font-bold flex gap-3 shadow-2xl hover:bg-accent/90 transition-none"
          >
            <Plus className="h-4 w-4" /> Add Resource
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="rounded-none border-accent/5 bg-white shadow-lg overflow-hidden group">
              <div className="h-1 w-full bg-accent/5" />
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-accent opacity-20 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-headline italic text-accent">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-10">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12 overflow-x-auto custom-scrollbar">
          <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0">Unified Registry ({collaborators.length})</TabsTrigger>
          <TabsTrigger value="partners" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-2"><Compass className="h-4 w-4" /> Business Partners</TabsTrigger>
          <TabsTrigger value="trades" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[13px] font-bold pb-5 px-0 flex gap-2"><HardHat className="h-4 w-4" /> Site Trades</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="m-0">
          <div className="bg-white border border-accent/5 shadow-2xl overflow-hidden">
            <div className="divide-y divide-accent/5">
              <AnimatePresence mode="popLayout">
                {filteredResources.map((res, index) => (
                  <motion.div
                    key={res.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 hover:bg-accent/[0.01] transition-none flex flex-col lg:flex-row lg:items-center justify-between gap-8 group"
                  >
                    <div className="flex items-center gap-8 flex-1">
                      <div className={cn(
                        "h-16 w-16 rounded-none flex flex-col items-center justify-center shrink-0 border border-accent/5 transition-all shadow-lg",
                        res.category === 'Collaborator' ? 'bg-accent text-white' : 'bg-secondary text-accent/40'
                      )}>
                         {res.category === 'Collaborator' ? <Compass className="h-6 w-6" /> : <HardHat className="h-6 w-6" />}
                         <span className="text-[8px] font-black uppercase mt-1">{res.category === 'Collaborator' ? 'PART' : 'TRAD'}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-bold text-accent/40 uppercase tracking-[0.4em]">{res.id}</span>
                          <h3 className="text-2xl font-headline italic text-accent">{res.name}</h3>
                          {res.rating >= 4.8 && <BadgeCheck className="h-4 w-4 text-accent" />}
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-[12px] text-muted-foreground uppercase tracking-widest font-bold">
                          <span className="text-accent/60">{res.specialty}</span>
                          <div className="h-1 w-1 bg-accent/20 rounded-full" />
                          <span className="opacity-40">{res.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 justify-between lg:justify-end">
                      <div className="flex flex-col lg:items-end gap-2 text-[11px] uppercase tracking-widest font-bold text-muted-foreground/60">
                        <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 opacity-40" /> {res.contact}</div>
                        <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 opacity-40" /> {res.email}</div>
                      </div>

                      <div className="text-right min-w-[100px] px-8 border-x border-accent/5">
                         <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/30 block mb-1">Integrity Score</span>
                         <div className="flex items-center gap-2 justify-end">
                           <Star className="h-4 w-4 fill-accent text-accent" />
                           <span className="text-2xl font-headline italic text-accent">{res.rating.toFixed(1)}</span>
                         </div>
                      </div>

                      <div className="flex items-center gap-6 pl-4">
                        <Badge variant="outline" className={cn("rounded-none uppercase tracking-widest text-[9px] font-bold px-4 py-1.5 transition-all shadow-sm", getStatusBadge(res.status))}>
                          {res.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-accent/20 hover:text-destructive transition-colors" onClick={() => handleRemove(res.id)}>
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredResources.length === 0 && (
              <div className="text-center py-40 bg-secondary/5 italic text-[13px] uppercase tracking-[0.4em] font-light text-accent/30">
                No verified resources identified in current cycle
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-12 border border-dashed border-accent/20 text-center bg-accent/[0.01] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck className="h-32 w-32" /></div>
        <p className="text-[11px] uppercase tracking-[0.5em] text-accent/30 font-bold italic leading-relaxed max-w-xl mx-auto relative z-10">
          "The Network Ecosystem is strictly synchronized with studio integrity protocols. unauthorized extraction is logged."
        </p>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg p-0 overflow-hidden bg-white shadow-2xl">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-10">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Registration Protocol</span>
              </div>
              <DialogTitle className="text-4xl font-headline italic">Register Resource</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base leading-relaxed">
                Authorize a new business partner or trade specialist within the studio network ecosystem.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Classification</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v: any) => setFormData({...formData, category: v})}
                  >
                    <SelectTrigger className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[10px] font-bold shadow-none bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Collaborator">Business Partner</SelectItem>
                      <SelectItem value="Vendor">Trade Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Status Protocol</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v: any) => setFormData({...formData, status: v})}
                  >
                    <SelectTrigger className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[10px] font-bold shadow-none bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="active">Active Integrity</SelectItem>
                      <SelectItem value="on_hold">On Hold / Audit</SelectItem>
                      <SelectItem value="blacklisted" className="text-destructive">Blacklisted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Entity Identity</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Professional Identity"
                  className="rounded-none border-accent/20 h-14 text-xl font-headline italic focus:ring-accent shadow-none transition-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Core Specialty</Label>
                  <Input 
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    placeholder="E.g., Structural Masonry"
                    className="rounded-none border-accent/20 h-12 text-sm font-bold uppercase tracking-widest transition-none"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Direct Contact</Label>
                  <Input 
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="+254 XXX XXX XXX"
                    className="rounded-none border-accent/20 h-12 text-sm font-bold transition-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Forensic Email Registry</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="identity@entity.studio"
                  className="rounded-none border-accent/20 h-12 text-base transition-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Capacity Model</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                    <SelectTrigger className="rounded-none border-accent/10 h-12 text-[10px] font-bold uppercase tracking-widest shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Individual Artisan">Individual Artisan</SelectItem>
                      <SelectItem value="Small Team">Boutique Team</SelectItem>
                      <SelectItem value="Industrial Firm">Industrial Authority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest opacity-60">Integrity Score</Label>
                  <Select value={formData.rating} onValueChange={(v) => setFormData({...formData, rating: v})}>
                    <SelectTrigger className="rounded-none border-accent/10 h-12 text-[10px] font-bold uppercase tracking-widest shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="5.0">5.0 — Elite</SelectItem>
                      <SelectItem value="4.5">4.5 — High</SelectItem>
                      <SelectItem value="4.0">4.0 — Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button 
                className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all border-none"
                onClick={handleAddResource}
                disabled={isSubmitting || !formData.name || !formData.specialty || !formData.email}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin" /> Authorizing...</span>
                ) : "Authorize Network Entry"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
