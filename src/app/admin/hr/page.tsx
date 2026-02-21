"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Hammer, 
  Globe, 
  BadgeCheck, 
  Phone, 
  Plus, 
  Filter, 
  Loader2,
  Users,
  Compass,
  Building2,
  HardHat,
  MapPin,
  Star,
  ExternalLink,
  Zap,
  Briefcase,
  Search,
  MoreVertical,
  Mail,
  ShieldCheck
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
import { cn } from "@/lib/utils";

export default function AdminHRPage() {
  const { collaborators, addCollaborator, removeCollaborator } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeDialog, setActiveDialog] = useState<"partner" | "vendor" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  // Separate Form States
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    specialty: "",
    entityType: "Design Firm",
    influence: "Boutique",
    contact: "",
  });

  const [vendorForm, setVendorForm] = useState({
    name: "",
    trade: "Masonry",
    location: "",
    capacity: "Individual Artisan",
    contact: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const filteredCollaborators = collaborators.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPartner = () => {
    if (!partnerForm.name || !partnerForm.specialty) return;
    setIsSubmitting(true);
    
    const newPartner: Collaborator = {
      id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
      name: partnerForm.name,
      category: 'Collaborator',
      specialty: partnerForm.specialty,
      contact: partnerForm.contact,
      rating: 5.0,
      status: 'active',
      type: `${partnerForm.entityType} — ${partnerForm.influence}`
    };

    setTimeout(() => {
      addCollaborator(newPartner);
      setIsSubmitting(false);
      setActiveDialog(null);
      setPartnerForm({ name: "", specialty: "", entityType: "Design Firm", influence: "Boutique", contact: "" });
      toast({ title: "Partner Synchronized", description: `${newPartner.name} authorized in creative network.` });
    }, 1200);
  };

  const handleAddVendor = () => {
    if (!vendorForm.name || !vendorForm.trade) return;
    setIsSubmitting(true);
    
    const newVendor: Collaborator = {
      id: `V-${Math.floor(Math.random() * 9000) + 1000}`,
      name: vendorForm.name,
      category: 'Vendor',
      specialty: vendorForm.trade,
      contact: vendorForm.contact,
      rating: 5.0,
      status: 'active',
      type: `${vendorForm.capacity} — ${vendorForm.location}`
    };

    setTimeout(() => {
      addCollaborator(newVendor);
      setIsSubmitting(false);
      setActiveDialog(null);
      setVendorForm({ name: "", trade: "Masonry", location: "", capacity: "Individual Artisan", contact: "" });
      toast({ title: "Trade Registered", description: `${newVendor.name} authorized in site trade registry.` });
    }, 1200);
  };

  const handleRemove = (id: string) => {
    removeCollaborator(id);
    toast({ title: "Profile Archived", description: "Identity moved to historical records." });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Resource Matrix</span>
          </div>
          <h1 className="text-5xl font-headline italic">Network <span className="not-italic">Ecosystem.</span></h1>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative mr-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search Partners..." 
              className="pl-11 pr-4 h-14 bg-white border border-accent/10 w-64 text-[12px] uppercase tracking-widest focus:outline-none focus:border-accent/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setActiveDialog("partner")}
            variant="outline" 
            className="rounded-none h-14 border-accent/20 uppercase tracking-widest text-[11px] font-bold flex gap-2 hover:bg-accent/5"
          >
            <Zap className="h-4 w-4" /> Register Partner
          </Button>
          <Button 
            onClick={() => setActiveDialog("vendor")}
            className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-[0.2em] text-[11px] font-bold flex gap-2 shadow-xl"
          >
            <Plus className="h-4 w-4" /> Add Trade
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {filteredCollaborators.map((col, index) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="rounded-none border-accent/5 shadow-xl bg-white dark:bg-zinc-900 overflow-hidden group hover:border-accent/20 transition-all">
              <div className="p-8 flex flex-col md:flex-row items-center gap-12">
                <div className={cn(
                  "h-28 w-28 rounded-none flex flex-col items-center justify-center shrink-0 border border-accent/5",
                  col.category === 'Collaborator' ? 'bg-accent text-white' : 'bg-secondary/30 dark:bg-zinc-800 text-accent/40'
                )}>
                   {col.category === 'Collaborator' ? <Compass className="h-10 w-10 mb-2" /> : <HardHat className="h-10 w-10 mb-2" />}
                   <span className="text-[10px] uppercase font-black tracking-[0.2em]">{col.category === 'Collaborator' ? 'Creative' : 'Trade'}</span>
                </div>
                
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-headline italic">{col.name}</h3>
                        <BadgeCheck className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-[12px] text-muted-foreground uppercase tracking-widest font-bold">
                          {col.specialty}
                        </p>
                        <div className="h-1 w-1 bg-accent/20 rounded-full" />
                        <p className="text-[11px] text-accent/40 uppercase tracking-widest font-bold">
                          {col.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Integrity Score</span>
                       <div className="flex items-center gap-2 justify-end">
                         <Star className="h-4 w-4 fill-accent text-accent" />
                         <span className="text-2xl font-headline italic">{col.rating.toFixed(1)}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-accent/5">
                    <div className="flex items-center gap-2 text-[12px] uppercase tracking-widest text-muted-foreground font-bold">
                      <Phone className="h-4 w-4 opacity-40" /> {col.contact}
                    </div>
                    <div className="flex items-center gap-2 text-[12px] uppercase tracking-widest text-muted-foreground font-bold">
                      <Mail className="h-4 w-4 opacity-40" /> {col.id.toLowerCase()}@studio.com
                    </div>
                    <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[10px] border-accent/10 font-bold px-3 py-1">
                      {col.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 min-w-[180px]">
                   <Button variant="outline" className="rounded-none border-accent/10 h-12 uppercase tracking-widest text-[11px] font-bold w-full hover:bg-accent hover:text-white transition-all flex gap-2">
                     <ShieldCheck className="h-4 w-4" /> View Dossier
                   </Button>
                   <Button 
                    variant="ghost" 
                    className="rounded-none text-destructive/40 hover:text-destructive hover:bg-destructive/5 h-12 uppercase tracking-widest text-[11px] font-bold w-full flex gap-2"
                    onClick={() => handleRemove(col.id)}
                   >
                    <Building2 className="h-4 w-4" /> Archive
                   </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {filteredCollaborators.length === 0 && (
          <div className="text-center py-24 border border-dashed border-accent/10">
            <p className="text-lg font-light italic text-muted-foreground uppercase tracking-[0.2em]">No network identities found in current registry</p>
          </div>
        )}
      </div>

      {/* CREATIVE PARTNER FORM */}
      <Dialog open={activeDialog === 'partner'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg p-0 overflow-hidden">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-accent" />
                <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Creative & Influence Network</span>
              </div>
              <DialogTitle className="text-4xl font-headline italic">Register Creative Partner</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base">
                Synchronize influencers, firms, or consulting architects into the studio creative matrix.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Professional Identity</Label>
                <Input 
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})}
                  placeholder="E.g., Studio Vibe Architecture"
                  className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Creative Focus</Label>
                  <Input 
                    value={partnerForm.specialty}
                    onChange={(e) => setPartnerForm({...partnerForm, specialty: e.target.value})}
                    placeholder="E.g., Interior Styling"
                    className="rounded-none border-accent/20 h-14 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Entity Classification</Label>
                  <Select value={partnerForm.entityType} onValueChange={(v) => setPartnerForm({...partnerForm, entityType: v})}>
                    <SelectTrigger className="rounded-none border-accent/20 h-14 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Individual Influencer">Individual Influencer</SelectItem>
                      <SelectItem value="Design Firm">Design Firm</SelectItem>
                      <SelectItem value="Creative Collective">Creative Collective</SelectItem>
                      <SelectItem value="Consulting Architect">Consulting Architect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Network Magnitude</Label>
                  <Select value={partnerForm.influence} onValueChange={(v) => setPartnerForm({...partnerForm, influence: v})}>
                    <SelectTrigger className="rounded-none border-accent/20 h-14 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Boutique">Boutique / Niche</SelectItem>
                      <SelectItem value="Mid-Scale">Mid-Scale Reach</SelectItem>
                      <SelectItem value="Macro">Macro Influence</SelectItem>
                      <SelectItem value="Global Firm">Global Authority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Direct Contact</Label>
                  <Input 
                    value={partnerForm.contact}
                    onChange={(e) => setPartnerForm({...partnerForm, contact: e.target.value})}
                    placeholder="Email or Social"
                    className="rounded-none border-accent/20 h-14 text-lg"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em]"
                onClick={handleAddPartner}
                disabled={isSubmitting || !partnerForm.name}
              >
                {isSubmitting ? "Authorizing Identity..." : "Authorize Creative Registration"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* TRADESPERSON FORM */}
      <Dialog open={activeDialog === 'vendor'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg p-0 overflow-hidden">
          <div className="bg-accent h-1.5 w-full" />
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <HardHat className="h-5 w-5 text-accent" />
                <span className="text-accent text-[12px] font-bold uppercase tracking-[0.4em]">Site & Implementation Trades</span>
              </div>
              <DialogTitle className="text-4xl font-headline italic">Add Trade Specialist</DialogTitle>
              <DialogDescription className="font-light italic text-muted-foreground text-base">
                Register technical implementation experts like masons, painters, or site contractors.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Workshop or Contractor Name</Label>
                <Input 
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                  placeholder="E.g., Nairobi Masonry Pros"
                  className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Technical Trade</Label>
                  <Select value={vendorForm.trade} onValueChange={(v) => setVendorForm({...vendorForm, trade: v})}>
                    <SelectTrigger className="rounded-none border-accent/20 h-14 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Masonry">Masonry & Structural</SelectItem>
                      <SelectItem value="Painting">Painting & Finishes</SelectItem>
                      <SelectItem value="Plumbing">Plumbing & HVAC</SelectItem>
                      <SelectItem value="Electrical">Electrical & Lighting</SelectItem>
                      <SelectItem value="Joinery">Carpentry & Joinery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Workforce Capacity</Label>
                  <Select value={vendorForm.capacity} onValueChange={(v) => setVendorForm({...vendorForm, capacity: v})}>
                    <SelectTrigger className="rounded-none border-accent/20 h-14 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Individual Artisan">Individual Artisan</SelectItem>
                      <SelectItem value="Small Team">Small Team (2-5)</SelectItem>
                      <SelectItem value="Industrial Contractor">Industrial Contractor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Mobilization Base</Label>
                  <Input 
                    value={vendorForm.location}
                    onChange={(e) => setVendorForm({...vendorForm, location: e.target.value})}
                    placeholder="E.g., Nairobi West"
                    className="rounded-none border-accent/20 h-14 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] font-bold uppercase tracking-widest opacity-60">Trade Contact</Label>
                  <Input 
                    value={vendorForm.contact}
                    onChange={(e) => setVendorForm({...vendorForm, contact: e.target.value})}
                    placeholder="+254 XXX XXX XXX"
                    className="rounded-none border-accent/20 h-14 text-lg"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                className="w-full bg-accent text-white h-16 rounded-none uppercase tracking-widest text-[12px] font-bold shadow-2xl transition-all hover:tracking-[0.2em]"
                onClick={handleAddVendor}
                disabled={isSubmitting || !vendorForm.name}
              >
                {isSubmitting ? "Registering Specialist..." : "Authorize Trade Registration"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
