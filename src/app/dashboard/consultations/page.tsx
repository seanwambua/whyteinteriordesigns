
"use client";

import { motion } from "framer-motion";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, Send, ShieldAlert, LifeBuoy } from "lucide-react";
import { ClientSupportDialog } from "@/components/dashboard/client-support-dialog";

export default function ClientConsultationsPage() {
  const { inquiries } = useWhyteStore();
  const [verifiedProjectId, setVerifiedProjectId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setVerifiedProjectId(localStorage.getItem("whyte_verified_project_id"));
  }, []);

  if (!isMounted) return null;

  // Filter inquiries for this specific client project
  const myInquiries = inquiries.filter(inq => inq.projectId === verifiedProjectId);

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'critical': return "text-destructive border-destructive/20 bg-destructive/5";
      case 'high': return "text-orange-600 border-orange-500/20 bg-orange-50";
      default: return "text-accent border-accent/20 bg-accent/5";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Communications Deck</span>
          </div>
          <h1 className="text-5xl font-headline italic">Direct <span className="not-italic">Consultations.</span></h1>
        </div>
        <Button 
          onClick={() => setIsSupportOpen(true)}
          className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[10px] font-bold flex gap-2"
        >
          <Send className="h-4 w-4" /> New Studio Request
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {myInquiries.map((inq, index) => (
          <motion.div
            key={inq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/5 shadow-lg bg-white overflow-hidden group">
              <div className="p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">{inq.id}</span>
                      <Badge variant="outline" className={`rounded-none uppercase tracking-widest text-[8px] font-bold px-3 py-1 ${getUrgencyStyles(inq.urgency)}`}>
                        {inq.urgency} Priority
                      </Badge>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Clock className="h-3 w-3" /> {inq.date}
                    </span>
                  </div>
                  <p className="text-lg font-light italic text-accent/80 leading-relaxed border-l-2 border-accent/10 pl-6">
                    {inq.message}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge className={`rounded-none uppercase tracking-widest text-[8px] ${inq.status === 'new' ? 'bg-accent' : 'bg-secondary text-muted-foreground'}`}>
                      Status: {inq.status}
                    </Badge>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground italic">
                      Type: {inq.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {myInquiries.length === 0 && (
          <div className="text-center py-24 border border-dashed border-accent/10 bg-secondary/5 space-y-6">
            <div className="h-12 w-12 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
              <LifeBuoy className="h-6 w-6 text-accent/20" />
            </div>
            <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No communication history found in the digital vault</p>
          </div>
        )}
      </div>

      <div className="p-10 border border-accent/5 bg-accent text-white/80 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 p-4 opacity-5">
          <MessageSquare className="h-20 w-20" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold italic relative z-10">
          Studio consultants prioritize portal inquiries with a guaranteed 24-hour verification window.
        </p>
      </div>

      <ClientSupportDialog 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
        projectId={verifiedProjectId || "GEN-CONSULT"} 
      />
    </div>
  );
}
