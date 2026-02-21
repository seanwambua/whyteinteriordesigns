
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Hammer, Globe, BadgeCheck, Phone, Mail, Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminHRPage() {
  const collaborators = [
    {
      id: "COL-001",
      name: "Architectural Stone Specialists",
      specialty: "Galana Stone Masonry",
      contact: "+254 700 000000",
      rating: 4.9,
      status: "active",
      type: "Trade Partner"
    },
    {
      id: "COL-002",
      name: "Venetian Fine Arts",
      specialty: "Italian Marble Sourcing",
      contact: "logistics@venetian.it",
      rating: 5.0,
      status: "active",
      type: "Global Vendor"
    },
    {
      id: "COL-003",
      name: "Rift Valley Woodworks",
      specialty: "Bespoke Mahogany Fabrication",
      contact: "+254 711 111111",
      rating: 4.7,
      status: "on_hold",
      type: "Trade Partner"
    }
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
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
          <Button className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-[0.2em] text-[10px] flex gap-2">
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
                   <Button variant="outline" className="rounded-none border-accent/20 h-10 uppercase tracking-widest text-[9px] w-full">Edit Profile</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
