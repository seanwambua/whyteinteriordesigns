
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileCheck, Landmark, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProjectClosingPage() {
  const pendingClosure = [
    { 
      id: "WP-0079", 
      client: "Gigiri Diplomatic Villa", 
      closedAt: "Oct 15", 
      status: "Final Audit",
      revenue: "Reconciled",
      satisfaction: 5.0
    },
    { 
      id: "WP-0080", 
      client: "Muthaiga North Residency", 
      closedAt: "Oct 22", 
      status: "Handover Complete",
      revenue: "Pending Final 20%",
      satisfaction: 4.8
    }
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
        <h1 className="text-5xl font-headline italic">Reconciliation & <span className="not-italic">Closing.</span></h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 mb-8">Pending Finalization</h2>
          {pendingClosure.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="rounded-none border-accent/10 shadow-lg bg-white group hover:shadow-2xl transition-all">
                <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">{project.id}</span>
                      <div className="h-1 w-1 bg-accent/20 rounded-full" />
                      <span className="text-[10px] font-bold text-accent uppercase tracking-widest italic">{project.status}</span>
                    </div>
                    <h3 className="text-3xl font-headline">{project.client}</h3>
                    <div className="flex gap-4 items-center">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => <Star key={i} className={`h-2.5 w-2.5 ${i <= project.satisfaction ? 'fill-accent text-accent' : 'text-accent/20'}`} />)}
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Client Satisfaction: {project.satisfaction}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right min-w-[200px]">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Financial Reconciliation</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${project.revenue.includes('Pending') ? 'text-orange-600' : 'text-green-600'}`}>
                        {project.revenue}
                      </span>
                    </div>
                    <Button variant="ghost" className="h-12 w-12 rounded-full border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all">
                      <FileCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <Card className="rounded-none border-accent/10 shadow-xl bg-accent p-10 text-white">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-8">Closing Protocols</h3>
            <ul className="space-y-8">
              <li className="flex gap-4">
                <ShieldCheck className="h-5 w-5 text-white/60 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">Post-Execution Audit</p>
                  <p className="text-[10px] text-white/40 font-light italic leading-relaxed">Structural integrity and architectural synchronization verified.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Landmark className="h-5 w-5 text-white/60 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">Installment Liquidation</p>
                  <p className="text-[10px] text-white/40 font-light italic leading-relaxed">All procurement invoices and artisanal fees settled.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 text-white/60 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">White-Glove Handover</p>
                  <p className="text-[10px] text-white/40 font-light italic leading-relaxed">Final styling curation and digital archive transmission.</p>
                </div>
              </li>
            </ul>
          </Card>

          <div className="p-8 border border-dashed border-accent/20 rounded-none bg-secondary/5">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 mb-4 italic text-center">Reconciliation Summary</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                <span className="text-muted-foreground">Projects Finalized (Q4)</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                <span className="text-muted-foreground">Avg. Reconciliation Cycle</span>
                <span className="font-bold">14 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
