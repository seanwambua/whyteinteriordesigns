
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, Calendar, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProjectPlanningPage() {
  const activePlanning = [
    { id: "WP-0091", client: "Karen Residency", tier: "Golden", status: "Concept Review", lead: "Architect Sarah", date: "Oct 24" },
    { id: "WP-0092", client: "Runda Estate", tier: "Deluxe", status: "Mood Boarding", lead: "Designer Mike", date: "Oct 28" },
    { id: "WP-0093", client: "Westlands Penthouse", tier: "Premium", status: "Contract Signed", lead: "Architect Sarah", date: "Nov 02" },
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
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Project <span className="not-italic">Planning.</span></h1>
        </div>
        <Button className="bg-accent text-white rounded-none h-12 px-8 uppercase tracking-widest text-[10px] flex gap-2">
          <Plus className="h-4 w-4" /> Initialize New Journey
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {activePlanning.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/10 shadow-lg hover:border-accent/30 transition-all bg-white overflow-hidden group">
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="p-8 border-b md:border-b-0 md:border-r border-accent/5 flex flex-col justify-center min-w-[200px] bg-secondary/5">
                  <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.4em] mb-2">{project.id}</span>
                  <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[8px] w-fit">
                    {project.tier} Tier
                  </Badge>
                </div>
                <div className="flex-1 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline italic">{project.client}</h3>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="text-[10px] uppercase tracking-widest">{project.lead}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[10px] uppercase tracking-widest">Next Review: {project.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Current Milestone</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-accent">{project.status}</span>
                    </div>
                    <Button variant="ghost" className="h-12 w-12 rounded-full border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="rounded-none border-dashed border-accent/20 bg-accent/5 p-12 text-center">
        <h4 className="text-xl font-headline italic mb-4">Planning Archives</h4>
        <p className="text-xs text-accent/60 uppercase tracking-widest font-light">14 historical planning blueprints archived this quarter</p>
      </Card>
    </div>
  );
}
