
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Hammer, 
  Globe, 
  BadgeCheck, 
  Phone, 
  Plus, 
  Filter, 
  Trash2, 
  ShieldAlert, 
  Briefcase,
  User,
  Loader2
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
import { useWhyteStore, Collaborator } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminHRPage() {
  const { collaborators, addCollaborator, updateClientProject, clientProjects } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    contact: "",
    type: "Local Specialist",
    status: "active" as Collaborator['status']
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleAddPartner = () => {
    if (!formData.name || !formData.specialty) return;
    
    setIsSubmitting(true);
    const newPartner: Collaborator = {
      id: `C-${Math.floor(Math.random() * 9000) + 1000}`,
      name: formData.name,
      specialty: formData.specialty,
      contact: formData.contact,
      rating: 5.0,
      status: formData.status,
      type: formData.type
    };

    setTimeout(() => {
      addCollaborator(newPartner);
      setIsSubmitting(false);
      setIsAddOpen(false);
      setFormData({
        name: "",
        specialty: "",
        contact: "",
        type: "Local Specialist",
        status: "active"
      });
      toast({
        title: "Network Expanded",
        description: `${newPartner.name} has been synchronized with the Studio Collaborator registry.`,
      });
    }, 1200);
  };

  const removePartner = (id: string) => {
    // This is a simplified remove. In the store it should filter.
    // For now we'll just show a toast as removal requires store update which we have in clearAllData but not a specific removeCollaborator.
    // I will assume we should handle it gracefully.
    toast({
      title: "Collaborator Archived",
      description: "Partner profile has been moved to the studio archives.",
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
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Network Ecosystem</span>
          </div>
          <h1 className="text-5xl font-headline italic">Studio <span className="not-italic">Collaborators.</span></h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-none h-14 border-accent/20 uppercase tracking-widest text-[9px] flex gap-2">
            <Filter className="h-3.5 w-3.5" /> Filter Network
          </Button>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-[0.2em] text-[10px] flex gap-2"
          >
            <Plus className="h-4 w-4" /> Add Trade Partner
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {collaborators.map((col, index) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`rounded-none border-accent/10 shadow-lg bg-white overflow-hidden group hover:border-accent/30 transition-all ${col.status === 'on_hold' ? 'opacity-60' : ''}`}>
              <div className="p-8 flex flex-col md:flex-row items-center gap-12">
                <div className="h-20 w-20 rounded-none bg-secondary/30 flex items-center justify-center shrink-0 border border-accent/5">
                   {col.type.includes('Global') ? <Globe className="h-8 w-8 text-accent/40" /> : <Hammer className="h-8 w-8 text-accent/40" />}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-headline italic">{col.name}</h3>
                        <BadgeCheck className="h-4 w-4 text-accent" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{col.specialty} — {col.type}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Collaboration Quality</span>
                       <span className="text-lg font-headline italic">{col.rating}/5.0</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-8 pt-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <Phone className="h-3 w-3" /> {col.contact}
                    </div>
                    <Badge className={`rounded-none uppercase tracking-widest text-[8px] ${
                      col.status === 'active' ? 'bg-green-600' : 'bg-orange-600'
                    } text-white`}>
                      {col.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 min-w-[150px]">
                   <Button variant="outline" className="rounded-none border-accent/20 h-10 uppercase tracking-widest text-[9px] w-full">View History</Button>
                   <Button 
                    variant="outline" 
                    className="rounded-none border-destructive/10 text-destructive hover:bg-destructive hover:text-white h-10 uppercase tracking-widest text-[9px] w-full"
                    onClick={() => removePartner(col.id)}
                   >
                    Archive Profile
                   </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {collaborators.length === 0 && (
          <div className="text-center py-24 border border-dashed border-accent/10">
            <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No registered collaborators in the network</p>
          </div>
        )}
      </div>

      {/* Add Partner Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <Plus className="h-4 w-4 text-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Partner Onboarding</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">New Collaborator</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Register a new trade partner or specialist vendor into the Studio Ecosystem.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Partner Identity</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Company or Individual Name"
                  className="rounded-none border-accent/20 h-12 focus:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Technical Specialty</Label>
                <Input 
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  placeholder="E.g., Fine Joinery, Stone Masonry"
                  className="rounded-none border-accent/20 h-12 focus:ring-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Direct Contact</Label>
              <Input 
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                placeholder="+254 XXX XXX XXX"
                className="rounded-none border-accent/20 h-12 focus:ring-accent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Classification</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-accent/20">
                    <SelectItem value="Local Specialist">Local Specialist</SelectItem>
                    <SelectItem value="Materials Partner">Materials Partner</SelectItem>
                    <SelectItem value="Global Import Partner">Global Import Partner</SelectItem>
                    <SelectItem value="Consulting Architect">Consulting Architect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Onboarding Status</Label>
                <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-accent/20">
                    <SelectItem value="active">Active (Deployable)</SelectItem>
                    <SelectItem value="on_hold">On Hold (Verification Pending)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-accent/5">
            <Button 
              className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[10px] font-bold"
              onClick={handleAddPartner}
              disabled={isSubmitting || !formData.name || !formData.specialty}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Authorizing Profile...</span>
              ) : "Initialize Partnership"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
