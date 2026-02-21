
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  FileCheck, 
  Landmark, 
  ShieldCheck, 
  Star, 
  Settings2, 
  Wallet, 
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProjectClosingPage() {
  const { toast } = useToast();
  const [financialProvider, setFinancialProvider] = useState("Imani Financial Services (IFS-KE)");
  const [isSyncing, setIsSyncing] = useState(false);

  const pendingClosure = [
    { 
      id: "WP-0079", 
      client: "Gigiri Diplomatic Villa", 
      closedAt: "Oct 15", 
      status: "Final Audit",
      revenue: "Reconciled",
      financialReport: "Verified",
      satisfaction: 5.0
    },
    { 
      id: "WP-0080", 
      client: "Muthaiga North Residency", 
      closedAt: "Oct 22", 
      status: "Handover Complete",
      revenue: "Pending Final 20%",
      financialReport: "Awaiting IFS-KE",
      satisfaction: 4.8
    }
  ];

  const handleProviderChange = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Financial Sync Updated",
        description: `Stewardship protocol switched to manual reconciliation.`,
      });
      setFinancialProvider("Manual Internal Reconciliation");
    }, 1500);
  };

  const handleVerifyReport = (projectId: string) => {
    toast({
      title: "Report Synchronized",
      description: `Financial report for ${projectId} has been cross-referenced with ${financialProvider}.`,
    });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
          </div>
          <h1 className="text-5xl font-headline italic">Reconciliation & <span className="not-italic">Closing.</span></h1>
        </div>
        
        <div className="p-4 border border-accent/10 bg-white shadow-sm flex items-center gap-6">
          <div className="space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-widest text-accent/40">Financial Steward</p>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{financialProvider}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 hover:bg-accent/5 text-accent/40 hover:text-accent"
            onClick={handleProviderChange}
            disabled={isSyncing}
          >
            <Settings2 className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
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
                    <div className="flex flex-wrap gap-6 items-center">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => <Star key={i} className={`h-2.5 w-2.5 ${i <= project.satisfaction ? 'fill-accent text-accent' : 'text-accent/20'}`} />)}
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest italic">Aesthetic Quality: {project.satisfaction}</span>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-3 w-3 text-accent/40" />
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${project.financialReport === 'Verified' ? 'text-green-600' : 'text-orange-600 animate-pulse'}`}>
                          Report: {project.financialReport}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right min-w-[200px]">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/40 block mb-1">Commission Status</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${project.revenue.includes('Pending') ? 'text-orange-600' : 'text-green-600'}`}>
                        {project.revenue}
                      </span>
                    </div>
                    <Button 
                      onClick={() => handleVerifyReport(project.id)}
                      variant="ghost" 
                      className="h-12 w-12 rounded-full border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all p-0"
                    >
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
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-8">Reconciliation Protocol</h3>
            <ul className="space-y-8">
              <li className="flex gap-4">
                <ShieldCheck className="h-5 w-5 text-white/60 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">Architectural Audit</p>
                  <p className="text-[10px] text-white/40 font-light italic leading-relaxed">Verification of design fidelity and technical execution.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Landmark className="h-5 w-5 text-white/60 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">3rd Party Financial Sync</p>
                  <p className="text-[10px] text-white/40 font-light italic leading-relaxed">Integration with {financialProvider} for liquidity reporting.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 text-white/60 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest">White-Glove Handover</p>
                  <p className="text-[10px] text-white/40 font-light italic leading-relaxed">Final digital archive and physical styling completion.</p>
                </div>
              </li>
            </ul>
          </Card>

          <div className="p-8 border border-dashed border-accent/20 rounded-none bg-white space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 italic text-center">External Stewardship</h4>
            <div className="p-4 bg-secondary/30 border border-accent/5 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-accent/40" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Audit Compliance</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                Closing a project requires a verified financial report from the assigned steward. Current active partner: <span className="text-accent font-bold">{financialProvider}</span>.
              </p>
              <Button variant="link" className="h-auto p-0 text-[9px] uppercase tracking-widest text-accent flex items-center gap-1.5 hover:no-underline opacity-60 hover:opacity-100">
                Contact Partner Support <ExternalLink className="h-2.5 w-2.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
