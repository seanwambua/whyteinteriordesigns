
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Sparkles, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AddClientPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Client Journey Initialized",
        description: "Project Reference ID: WP-XXXX has been synchronized.",
      });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Client Lifecycle</span>
        </div>
        <h1 className="text-5xl font-headline italic">Initialize <span className="not-italic">Journey.</span></h1>
      </motion.div>

      <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
        <div className="bg-accent h-1.5 w-full" />
        <CardContent className="p-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Client Full Name</Label>
                <Input placeholder="E.g., Jonathan Muthaiga" className="rounded-none border-accent/20 h-12 focus:ring-accent" required />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email Address</Label>
                <Input type="email" placeholder="client@example.com" className="rounded-none border-accent/20 h-12 focus:ring-accent" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Full Commission Tier</Label>
                <Select required>
                  <SelectTrigger className="rounded-none border-accent/20 h-12 focus:ring-accent">
                    <SelectValue placeholder="Select Commission Tier" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-accent/20 font-body">
                    <SelectItem value="Premium">Premium Tier (50/30/20)</SelectItem>
                    <SelectItem value="Deluxe">Deluxe Tier (60/20/20)</SelectItem>
                    <SelectItem value="Golden">Golden Tier (70/30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Project Title</Label>
                <Input placeholder="E.g., Runda Residence Phase II" className="rounded-none border-accent/20 h-12 focus:ring-accent" required />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Architectural Brief (Initial Notes)</Label>
              <Textarea 
                placeholder="Describe the primary spatial goals and structural constraints..." 
                className="min-h-[120px] rounded-none border-accent/20 focus:ring-accent resize-none bg-transparent" 
              />
            </div>

            <div className="pt-8 flex flex-col items-center gap-6 border-t border-accent/5">
              <div className="flex items-center gap-3 text-accent/40">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Automatic Auth Provisioning Enabled</span>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-accent text-white rounded-none h-16 px-16 uppercase tracking-[0.3em] text-[10px] flex gap-3 hover:bg-accent/90"
              >
                {loading ? "Synchronizing Digital Vault..." : <><UserPlus className="h-4 w-4" /> Activate Project Journey</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="p-8 border border-dashed border-accent/20 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-accent/40 font-bold italic">
          New clients will receive an automated invitation to the Studio Portal once initialized.
        </p>
      </div>
    </div>
  );
}
