"use client";

import { motion } from "framer-motion";
import { useWhyteStore } from "@/store/use-whyte-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  RefreshCcw, 
  User, 
  PencilRuler, 
  Building2, 
  History,
  Activity,
  Lock,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LogEntry = {
  timestamp: string;
  action: string;
  entity: string;
  status: 'Success' | 'Warning' | 'Critical';
};

export default function OnboardingControlPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [onboardingStatus, setOnboardingStatus] = useState({
    client: false,
    designer: false,
    steward: false
  });

  useEffect(() => {
    setIsMounted(true);
    refreshStatus();
  }, []);

  const refreshStatus = () => {
    if (typeof window === 'undefined') return;
    setOnboardingStatus({
      client: localStorage.getItem("whyte_onboarded") === "true",
      designer: localStorage.getItem("whyte_designer_onboarded") === "true",
      steward: localStorage.getItem("whyte_steward_onboarded") === "true"
    });
  };

  const addLog = (action: string, entity: string, status: LogEntry['status']) => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      action,
      entity,
      status
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleReset = (key: 'client' | 'designer' | 'steward') => {
    if (typeof window === 'undefined') return;
    
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const storageKey = key === 'client' ? "whyte_onboarded" : 
                      key === 'designer' ? "whyte_designer_onboarded" : 
                      "whyte_steward_onboarded";
    
    localStorage.removeItem(storageKey);
    if (key === 'client') {
      localStorage.removeItem("whyte_verified_project_id");
    }
    
    refreshStatus();
    addLog(`Protocol Reset: ${label} Onboarding`, 'System Admin', 'Warning');
    toast({ 
      title: `${label} Protocol Initialized`, 
      description: "Onboarding flag cleared. Registry synchronization required on next access." 
    });
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-[13px] font-bold uppercase tracking-[0.4em]">Operations Hub</span>
        </div>
        <h1 className="text-5xl font-headline italic">Onboarding <span className="not-italic">Terminal.</span></h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          { id: 'client', label: 'Client Portal', icon: User, status: onboardingStatus.client },
          { id: 'designer', label: 'Designer Workbench', icon: PencilRuler, status: onboardingStatus.designer },
          { id: 'steward', label: 'Stewardship Terminal', icon: Building2, status: onboardingStatus.steward },
        ].map((item) => (
          <Card key={item.id} className="rounded-none border-accent/10 shadow-xl bg-white overflow-hidden group">
            <div className={cn("h-1.5 w-full", item.status ? "bg-green-500" : "bg-orange-400")} />
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 bg-accent/5 flex items-center justify-center text-accent">
                  <item.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className={cn(
                  "rounded-none uppercase tracking-widest text-[9px] font-bold py-1 px-3",
                  item.status ? "bg-green-50 text-green-600 border-green-200" : "bg-orange-50 text-orange-600 border-orange-200"
                )}>
                  {item.status ? "Authorized" : "Sync Required"}
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-headline italic">{item.label}</h3>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Authentication Protocol</p>
              </div>
              <Button 
                onClick={() => handleReset(item.id as any)}
                variant="outline" 
                className="w-full rounded-none h-12 border-accent/10 text-accent uppercase tracking-widest text-[10px] font-bold flex gap-3 hover:bg-accent hover:text-white transition-all shadow-sm"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Force Onboarding
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-4">
            <Activity className="h-5 w-5 text-accent/40" />
            <h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent">Protocol Log Registry</h2>
          </div>
          <Card className="rounded-none border-accent/10 bg-white shadow-2xl overflow-hidden min-h-[400px]">
            <div className="bg-accent/5 p-4 border-b border-accent/10 flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-accent/40 px-8">
              <span>Timestamp</span>
              <span>Authorization Event</span>
              <span>Security Entity</span>
            </div>
            <div className="divide-y divide-accent/5">
              {logs.map((log, i) => (
                <div key={i} className="p-6 px-8 flex items-center justify-between group hover:bg-accent/[0.01] transition-colors">
                  <div className="flex items-center gap-12">
                    <span className="text-[11px] font-mono text-muted-foreground">{log.timestamp}</span>
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-widest text-accent">{log.action}</p>
                      <p className="text-[10px] text-muted-foreground font-light italic uppercase tracking-widest">{log.entity}</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "rounded-none text-[8px] uppercase tracking-widest px-2 py-0.5 font-bold",
                    log.status === 'Success' ? 'bg-green-600 text-white' : 
                    log.status === 'Warning' ? 'bg-orange-500 text-white' : 
                    'bg-red-600 text-white'
                  )}>
                    {log.status}
                  </Badge>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="py-32 text-center space-y-4">
                  <History className="h-12 w-12 text-accent/10 mx-auto" />
                  <p className="text-[12px] font-light italic text-muted-foreground uppercase tracking-[0.3em]">No protocol interruptions logged in current session</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-none border-accent/20 bg-accent p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert className="h-32 w-32" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/40 relative z-10">Global Override</h3>
            <div className="space-y-8 relative z-10">
              <p className="text-lg font-light italic leading-relaxed text-white/80 border-l-2 border-white/20 pl-6">
                "Initializing a global reset will liquidate all technical dossiers and localized authorizations across the studio registry."
              </p>
              <Button 
                onClick={() => {
                  if(confirm("Confirm critical protocol liquidation? This will purge the entire studio registry and reset all portal sessions.")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full h-16 bg-white text-accent hover:bg-white/90 rounded-none uppercase tracking-widest text-[11px] font-bold shadow-xl transition-all hover:tracking-[0.2em]"
              >
                Critical System Purge
              </Button>
            </div>
          </Card>

          <div className="p-10 border border-dashed border-accent/20 bg-secondary/5 text-center space-y-6">
            <div className="flex justify-center"><ShieldCheck className="h-8 w-8 text-accent/20" /></div>
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-accent/40 italic leading-relaxed">
              Manual onboarding triggers are logged via Studio Protocol. Unauthorized session termination is flagged for audit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
