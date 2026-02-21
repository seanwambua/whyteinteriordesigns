
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, ShieldCheck, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useWhyteStore, ClientProject } from "@/store/use-whyte-store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddClientPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { addClientProject } = useWhyteStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    tier: "Premium" as ClientProject['tier'],
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const id = `WP-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const newProject: ClientProject = {
      id,
      name: formData.name,
      email: formData.email,
      project: formData.project,
      tier: formData.tier,
      status: "Consultation",
      progress: 0,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      lastActivity: "Journey Initialized",
      financialReportStatus: 'Pending'
    };

    // Simulated synchronization
    setTimeout(() => {
      addClientProject(newProject);
      setLoading(false);
      toast({
        title: "Client Journey Initialized",
        description: `Project Reference ID: ${id} has been synchronized to the studio archives.`,
      });
      router.push("/admin/clients");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Button asChild variant="ghost" className="text-accent/40 hover:text-accent p-0 font-bold uppercase tracking-widest text-[9px] h-auto flex items-center gap-2 mb-4">
          <Link href="/admin/clients"><ArrowLeft className="h-3 w-3" /> Back to Directory</Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Client Lifecycle</span>
        </div>
        <h1 className="text-5xl font-headline italic">Initialize <span className="not-italic">Journey.</span></h1>
      </motion.div>

      <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
        <div className="bg-accent h-1.5 w-full" />
        <CardContent className="p-12 md:p-16">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Client Full Name</Label>
                <Input 
                  placeholder="E.g., Jonathan Muthaiga" 
                  className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent bg-transparent" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email Address</Label>
                <Input 
                  type="email" 
                  placeholder="client@example.com" 
                  className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent bg-transparent" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Full Commission Tier</Label>
                <Select 
                  onValueChange={(v: ClientProject['tier']) => setFormData({...formData, tier: v})} 
                  defaultValue={formData.tier}
                >
                  <SelectTrigger className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent bg-transparent">
                    <SelectValue placeholder="Select Commission Tier" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-accent/20 font-body">
                    <SelectItem value="Premium" className="py-3">Premium (50/30/20 installments)</SelectItem>
                    <SelectItem value="Deluxe" className="py-3">Deluxe (60/20/20 installments)</SelectItem>
                    <SelectItem value="Golden" className="py-3">Golden (70/30 installments)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Reference Title</Label>
                <Input 
                  placeholder="E.g., Runda Residence Phase II" 
                  className="rounded-none border-accent/20 h-14 text-lg focus:ring-accent bg-transparent" 
                  required 
                  value={formData.project}
                  onChange={(e) => setFormData({...formData, project: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Architectural Brief (Initial Notes)</Label>
              <Textarea 
                placeholder="Describe the primary spatial goals, structural constraints, and aesthetic DNA..." 
                className="min-h-[160px] rounded-none border-accent/20 focus:ring-accent resize-none bg-transparent text-lg p-6" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="pt-10 flex flex-col items-center gap-8 border-t border-accent/5">
              <div className="flex items-center gap-3 text-accent/40 bg-secondary/30 px-6 py-3 border border-accent/5">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Encrypted Studio Portal Provisioning Active</span>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-accent text-white rounded-none h-20 px-20 uppercase tracking-[0.4em] text-[10px] font-bold flex gap-4 hover:bg-accent/90 transition-all shadow-2xl disabled:opacity-50"
              >
                {loading ? "Synchronizing Digital Vault..." : <><UserPlus className="h-5 w-5" /> Activate Client Journey</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="p-10 border border-dashed border-accent/20 text-center bg-secondary/5">
        <p className="text-[10px] uppercase tracking-[0.5em] text-accent/40 font-bold italic leading-relaxed max-w-2xl mx-auto">
          Initializing a journey will generate a unique Digital Vault key. The client will receive an automated invitation to sync their Nairobi residency data once initialization completes.
        </p>
      </div>
    </div>
  );
}
