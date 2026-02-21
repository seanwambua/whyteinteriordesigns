
"use client";

import { motion } from "framer-motion";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Activity, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ClientProjectsPage() {
  const { clientProjects } = useWhyteStore();
  const [verifiedProjectId, setVerifiedProjectId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setVerifiedProjectId(localStorage.getItem("whyte_verified_project_id"));
  }, []);

  if (!isMounted) return null;

  // Filter projects by verified ID (or all if we want to show history linked by email, but for MVP we use the verification)
  const myProjects = clientProjects.filter(p => p.id === verifiedProjectId || (verifiedProjectId === null && p.isActivated));

  return (
    <div className="max-w-6xl mx-auto space-y-12 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Commission Archives</span>
        </div>
        <h1 className="text-5xl font-headline italic">Your <span className="not-italic">Portfolio.</span></h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {myProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/10 shadow-xl bg-white group overflow-hidden">
              <div className="flex flex-col md:flex-row min-h-[250px]">
                <div className="w-2 shrink-0 bg-accent opacity-20 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-10 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">{project.id}</span>
                        <Badge className="bg-accent text-white rounded-none uppercase tracking-widest text-[8px] py-1">
                          {project.tier} Commission
                        </Badge>
                        <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[8px] border-accent/20 text-accent/60">
                          {project.status}
                        </Badge>
                      </div>
                      <h3 className="text-4xl font-headline italic">{project.project}</h3>
                      <div className="flex flex-wrap gap-8 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Started: {project.startDate}</span>
                        <span className="flex items-center gap-2"><Activity className="h-3 w-3" /> Implementation Velocity: {project.progress}%</span>
                      </div>
                    </div>
                    <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[10px] font-bold group">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        Enter Workspace <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-10 space-y-4">
                    <div className="flex justify-between text-[9px] uppercase tracking-[0.4em] font-bold text-accent/60">
                      <span>Live Site Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1 bg-secondary rounded-none" />
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}

        {myProjects.length === 0 && (
          <div className="text-center py-32 border border-dashed border-accent/10 space-y-8">
            <div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="h-8 w-8 text-accent/20" />
            </div>
            <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No project commissions currently linked to this identity</p>
            <Button asChild variant="outline" className="rounded-none uppercase tracking-widest text-[10px]">
              <Link href="/dashboard/onboarding">Initiate Verification</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
