
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Phone, Calendar, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminInquiriesPage() {
  const inquiries = [
    {
      id: "INQ-9901",
      name: "Victoria W.",
      type: "new_business",
      service: "bundle",
      message: "Looking for a full architectural and decor transformation for a 6,000 sq ft villa in Karen. Interested in the Golden Tier.",
      date: "2 hours ago",
      status: "new"
    },
    {
      id: "INQ-8822",
      name: "David O.",
      type: "project_support",
      projectId: "WP-0082",
      message: "URGENT: Issues with the Galana stone installation in the main foyer. Please coordinate with the site manager.",
      date: "5 hours ago",
      status: "urgent"
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
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Pipeline Management</span>
          </div>
          <h1 className="text-5xl font-headline italic">Direct <span className="not-italic">Inquiries.</span></h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {inquiries.map((inq, index) => (
          <motion.div
            key={inq.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`rounded-none border-accent/10 shadow-lg bg-white overflow-hidden group ${inq.status === 'urgent' ? 'border-l-4 border-l-orange-600' : ''}`}>
              <div className="p-8 flex flex-col md:flex-row gap-8">
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-headline italic">{inq.name}</h3>
                        {inq.status === 'urgent' && <AlertTriangle className="h-4 w-4 text-orange-600 animate-pulse" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{inq.id} — {inq.date}</p>
                    </div>
                    <Badge variant="outline" className={`rounded-none uppercase tracking-widest text-[8px] ${
                      inq.type === 'new_business' ? 'border-accent text-accent' : 'border-blue-600 text-blue-600'
                    }`}>
                      {inq.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-light leading-relaxed text-accent/80 italic">
                    "{inq.message}"
                  </p>

                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Received Today
                    </div>
                    {inq.projectId && (
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent font-bold">
                        Linked Project: {inq.projectId}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-accent/5 pt-6 md:pt-0 md:pl-8">
                  <Button className="bg-accent text-white rounded-none h-12 px-8 uppercase tracking-widest text-[10px] flex gap-2">
                    <Mail className="h-4 w-4" /> Respond
                  </Button>
                  <Button variant="ghost" className="h-12 w-12 rounded-full border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all">
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
