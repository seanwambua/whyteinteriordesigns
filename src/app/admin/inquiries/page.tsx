
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Mail, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Briefcase,
  ShieldAlert
} from "lucide-react";
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
      status: "new",
      urgency: "normal"
    },
    {
      id: "INQ-9905",
      name: "Samuel K.",
      type: "termination_request",
      projectId: "WP-0072",
      message: "FORMAL NOTICE: We wish to initiate the termination protocol due to extended delays in international marble procurement.",
      date: "1 hour ago",
      status: "new",
      urgency: "critical"
    },
    {
      id: "INQ-8822",
      name: "David O.",
      type: "complaint",
      projectId: "WP-0082",
      message: "URGENT: Issues with the Galana stone installation in the main foyer. The vein alignment does not match the approved renders.",
      date: "5 hours ago",
      status: "pending",
      urgency: "high"
    },
    {
      id: "INQ-7710",
      name: "Elena M.",
      type: "project_support",
      projectId: "WP-0091",
      message: "Requesting an updated 3D walkthrough for the living room mezzanine after last week's spatial adjustments.",
      date: "1 day ago",
      status: "contacted",
      urgency: "normal"
    }
  ];

  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'termination_request': return "border-destructive text-destructive bg-destructive/5";
      case 'complaint': return "border-orange-500 text-orange-600 bg-orange-50";
      case 'new_business': return "border-accent text-accent bg-accent/5";
      default: return "border-blue-500 text-blue-600 bg-blue-50";
    }
  };

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
          <h1 className="text-5xl font-headline italic">Direct <span className="not-italic">Communications.</span></h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {inquiries.map((inq, index) => (
          <motion.div
            key={inq.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`rounded-none border-accent/10 shadow-lg bg-white overflow-hidden group transition-all hover:shadow-2xl ${
              inq.urgency === 'critical' ? 'border-l-4 border-l-destructive' : 
              inq.urgency === 'high' ? 'border-l-4 border-l-orange-500' : ''
            }`}>
              <div className="p-10 flex flex-col md:flex-row gap-10">
                <div className="space-y-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-headline italic">{inq.name}</h3>
                        {inq.urgency === 'critical' && <ShieldAlert className="h-5 w-5 text-destructive animate-pulse" />}
                        {inq.urgency === 'high' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        <span>{inq.id}</span>
                        <div className="h-1 w-1 bg-accent/20 rounded-full" />
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {inq.date}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`rounded-none uppercase tracking-widest text-[9px] py-1.5 px-4 font-bold h-fit ${getTypeStyles(inq.type)}`}>
                      {inq.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="relative">
                    <p className="text-base font-light leading-relaxed text-accent/80 italic border-l-2 border-accent/10 pl-8 py-2">
                      "{inq.message}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-8 items-center border-t border-accent/5 pt-6">
                    {inq.projectId && (
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent font-black">
                        <Briefcase className="h-3.5 w-3.5" /> Linked Project: {inq.projectId}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      <Calendar className="h-3.5 w-3.5" /> Response Window: {inq.urgency === 'critical' ? '2 Hours' : '24 Hours'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-end gap-4 md:border-l border-accent/5 md:pl-10 min-w-[200px]">
                  <Button className="flex-1 md:w-full bg-accent text-white rounded-none h-14 uppercase tracking-widest text-[10px] font-bold flex gap-3 hover:bg-accent/90">
                    <Mail className="h-4 w-4" /> Respond
                  </Button>
                  <Button variant="outline" className="h-14 w-14 rounded-none border-accent/10 hover:bg-accent hover:text-white transition-all group/btn">
                    <CheckCircle2 className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
                  </Button>
                  {inq.urgency === 'critical' && (
                    <Button variant="outline" className="h-14 w-14 rounded-none border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all">
                      <XCircle className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="p-10 border border-dashed border-accent/20 text-center bg-secondary/5">
        <p className="text-[10px] uppercase tracking-[0.5em] text-accent/40 font-bold italic">
          High-urgency inquiries (Complaints & Terminations) are automatically escalated to Senior Partners.
        </p>
      </div>
    </div>
  );
}
