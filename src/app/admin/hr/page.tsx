
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
  ExternalLink
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
  const { collaborators, addCollaborator, removeCollaborator } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [activeDialog, setActiveDialog] = useState<"partner" | "vendor" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [partnerForm, setPartnerPartnerForm] = useState({
    name: "",
    specialty: "",
    studioType: "Boutique Studio",
    reach: "Local",
    contact: "",
  });

  const [vendorForm, setVendorForm] = useState({
    name: "",
    trade: "",
    location: "",
    capacity: "Individual Artisan",
    contact: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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
      type: `${partnerForm.studioType} — ${partnerForm.reach}`
    };

    setTimeout(() => {
      addCollaborator(newPartner);
      setIsSubmitting(false);
      setActiveDialog(null);
      setPartnerPartnerForm({ name: "", specialty: "", studioType: "Boutique Studio", reach: "Local", contact: "" });
      toast({ title: "Partner Synchronized", description: `${newPartner.name} authorized in design network.` });
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
      setVendorForm({ name: "", trade: "", location: "", capacity: "Individual Artisan", contact: "" });
      toast({ title: "Vendor Synchronized", description: `${newVendor.name} authorized in trade registry.` });
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
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Resource Matrix</span>
          </div>
          <h1 className="text-5xl font-headline italic">Network <span className="not-italic">Ecosystem.</span></h1>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => setActiveDialog("partner")}
            variant="outline" 
            className="rounded-none h-14 border-accent/20 uppercase tracking-widest text-[9px] flex gap-2 hover:bg-accent/5"
          >
            <Compass className="h-3.5 w-3.5" /> Register Design Partner
          </Button>
          <Button 
            onClick={() => setActiveDialog("vendor")}
            className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-[0.2em] text-[10px] flex gap-2"
          >
            <Plus className="h-4 w-4" /> Add Trade Vendor
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {collaborators.map((col, index) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="rounded-none border-accent/10 shadow-xl bg-white overflow-hidden group hover:border-accent/30 transition-all">
              <div className="p-8 flex flex-col md:flex-row items-center gap-12">
                <div className={`h-24 w-24 rounded-none flex flex-col items-center justify-center shrink-0 border border-accent/5 ${
                  col.category === 'Collaborator' ? 'bg-accent text-white' : 'bg-secondary/30 text-accent/40'
                }`}>
                   {col.category === 'Collaborator' ? <Compass className="h-8 w-8 mb-1" /> : <HardHat className="h-8 w-8 mb-1" />}
                   <span className="text-[7px] uppercase font-black tracking-widest">{col.category}</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-headline italic">{col.name}</h3>
                        <BadgeCheck className="h-4 w-4 text-accent" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        {col.specialty} <span className="opacity-20 px-2">|</span> {col.type}
                      </p>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Integrity Score</span>
                       <div className="flex items-center gap-2 justify-end">
                         <Star className="h-3 w-3 fill-accent text-accent" />
                         <span className="text-lg font-headline italic">{col.rating.toFixed(1)}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-8 pt-2 border-t border-accent/5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      <Phone className="h-3 w-3 opacity-40" /> {col.contact}
                    </div>
                    <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[8px] border-accent/10">
                      {col.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 min-w-[160px]">
                   <Button variant="outline" className="rounded-none border-accent/10 h-10 uppercase tracking-widest text-[9px] w-full hover:bg-accent hover:text-white transition-all">View Dossier</Button>
                   <Button 
                    variant="ghost" 
                    className="rounded-none text-destructive/40 hover:text-destructive hover:bg-destructive/5 h-10 uppercase tracking-widest text-[9px] w-full"
                    onClick={() => handleRemove(col.id)}
                   >
                    Archive
                   </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* DESIGN PARTNER DIALOG */}
      <Dialog open={activeDialog === 'partner'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <Compass className="h-4 w-4 text-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Architecture & Design Network</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">New Design Partner</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Register a consulting architect, interior stylist, or creative partner.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Professional Identity</Label>
              <Input 
                value={partnerForm.name}
                onChange={(e) => setPartnerPartnerForm({...partnerForm, name: e.target.value})}
                placeholder="Partner or Studio Name"
                className="rounded-none border-accent/20 h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Design specialty</Label>
                <Input 
                  value={partnerForm.specialty}
                  onChange={(e) => setPartnerPartnerForm({...partnerForm, specialty: e.target.value})}
                  placeholder="E.g., Minimalism"
                  className="rounded-none border-accent/20 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Studio Type</Label>
                <Select value={partnerForm.studioType} onValueChange={(v) => setPartnerPartnerForm({...partnerForm, studioType: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Individual Architect">Individual Architect</SelectItem>
                    <SelectItem value="Boutique Studio">Boutique Studio</SelectItem>
                    <SelectItem value="Design Collective">Design Collective</SelectItem>
                    <SelectItem value="Global Firm">Global Firm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Operational Reach</Label>
                <Select value={partnerForm.reach} onValueChange={(v) => setPartnerPartnerForm({...partnerForm, reach: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Local (Kenya)">Local (Kenya)</SelectItem>
                    <SelectItem value="Regional (East Africa)">Regional (East Africa)</SelectItem>
                    <SelectItem value="Global">Global Reach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Direct Contact</Label>
                <Input 
                  value={partnerForm.contact}
                  onChange={(e) => setPartnerPartnerForm({...partnerForm, contact: e.target.value})}
                  placeholder="Email or Phone"
                  className="rounded-none border-accent/20 h-12"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[10px] font-bold shadow-2xl"
              onClick={handleAddPartner}
              disabled={isSubmitting || !partnerForm.name}
            >
              {isSubmitting ? "Authorizing Identity..." : "Authorize Partner Registration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TRADE VENDOR DIALOG */}
      <Dialog open={activeDialog === 'vendor'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="rounded-none border-accent/20 font-body sm:max-w-lg">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <HardHat className="h-4 w-4 text-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Site & Material Registry</span>
            </div>
            <DialogTitle className="text-3xl font-headline italic">Add Trade Vendor</DialogTitle>
            <DialogDescription className="font-light italic text-muted-foreground">
              Register a specialist trade, material workshop, or site contractor.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Workshop/Company Identity</Label>
              <Input 
                value={vendorForm.name}
                onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                placeholder="Business Name"
                className="rounded-none border-accent/20 h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Technical Trade</Label>
                <Input 
                  value={vendorForm.trade}
                  onChange={(e) => setVendorForm({...vendorForm, trade: e.target.value})}
                  placeholder="E.g., Fine Joinery"
                  className="rounded-none border-accent/20 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Workforce Capacity</Label>
                <Select value={vendorForm.capacity} onValueChange={(v) => setVendorForm({...vendorForm, capacity: v})}>
                  <SelectTrigger className="rounded-none border-accent/20 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="Individual Artisan">Individual Artisan</SelectItem>
                    <SelectItem value="Small Workshop">Small Workshop (2-5)</SelectItem>
                    <SelectItem value="Medium Contractor">Medium Contractor (5-20)</SelectItem>
                    <SelectItem value="Industrial Partner">Industrial Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Primary Location</Label>
                <Input 
                  value={vendorForm.location}
                  onChange={(e) => setVendorForm({...vendorForm, location: e.target.value})}
                  placeholder="E.g., Nairobi Industrial Area"
                  className="rounded-none border-accent/20 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Trade Contact</Label>
                <Input 
                  value={vendorForm.contact}
                  onChange={(e) => setVendorForm({...vendorForm, contact: e.target.value})}
                  placeholder="+254 XXX XXX XXX"
                  className="rounded-none border-accent/20 h-12"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              className="w-full bg-accent text-white h-14 rounded-none uppercase tracking-widest text-[10px] font-bold shadow-2xl"
              onClick={handleAddVendor}
              disabled={isSubmitting || !vendorForm.name}
            >
              {isSubmitting ? "Registering Trade..." : "Authorize Trade Registration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
