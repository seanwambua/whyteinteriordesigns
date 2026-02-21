
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, Truck, HardHat, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProjectImplementationPage() {
  const liveProjects = [
    { 
      id: "WP-0082", 
      client: "Muthaiga Residence", 
      phase: "Execution & Installation", 
      progress: 78, 
      log: "Italian marble installation complete. Master suite textiles pending delivery.",
      urgency: "Normal"
    },
    { 
      id: "WP-0085", 
      client: "Westlands HQ", 
      phase: "Procurement", 
      progress: 42, 
      log: "Custom European furniture shipment cleared customs at Mombasa.",
      urgency: "Urgent"
    },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
        </div>
        <h1 className="text-5xl font-headline italic">Live <span className="not-italic">Implementation.</span></h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {liveProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden relative">
              {project.urgency === 'Urgent' && <div className="absolute top-0 right-0 p-4"><AlertCircle className="h-4 w-4 text-orange-600 animate-pulse" /></div>}
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.4em] block mb-2">{project.id}</span>
                    <h3 className="text-3xl font-headline italic">{project.client}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent px-4 py-1.5 bg-accent/5 border border-accent/10">
                      {project.phase}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] font-bold text-accent/60">
                    <span>Implementation Velocity</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1 bg-secondary rounded-none" />
                </div>

                <div className="p-6 bg-secondary/30 border-l-2 border-accent italic">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 flex items-center gap-2 mb-3">
                    <Clock className="h-3 w-3" /> Latest Site Entry
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-accent/80">
                    "{project.log}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button variant="outline" className="rounded-none h-12 uppercase tracking-widest text-[9px] border-accent/20 flex gap-2">
                    <Truck className="h-3.5 w-3.5" /> Logistics Update
                  </Button>
                  <Button variant="outline" className="rounded-none h-12 uppercase tracking-widest text-[9px] border-accent/20 flex gap-2">
                    <HardHat className="h-3.5 w-3.5" /> Site Report
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="rounded-none border-accent/10 p-10 bg-secondary/10 overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-2">
            <h4 className="text-2xl font-headline italic">Resource Allocation</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-light">4 technical architects & 12 specialist contractors currently deployed across Nairobi.</p>
          </div>
          <Button variant="ghost" className="text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-transparent hover:opacity-70">
            View Deployments
          </Button>
        </div>
      </Card>
    </div>
  );
}
