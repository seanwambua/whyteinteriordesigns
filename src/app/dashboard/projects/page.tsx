
"use client";

import { motion } from "framer-motion";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Activity, Briefcase, Archive } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClientProjectsPage() {
  const { clientProjects } = useWhyteStore();
  const [verifiedProjectId, setVerifiedProjectId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setVerifiedProjectId(localStorage.getItem("whyte_verified_project_id"));
  }, []);

  if (!isMounted) return null;

  // Filter projects by verified ID
  const myProjects = clientProjects.filter(p => p.id === verifiedProjectId || (verifiedProjectId === null && p.isActivated));
  const activeProjects = myProjects.filter(p => !p.isArchived);
  const archivedProjects = myProjects.filter(p => p.isArchived);

  const ProjectCard = ({ project }: { project: any }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className={`rounded-none border-accent/10 shadow-xl bg-white group overflow-hidden ${project.isArchived ? 'opacity-80' : ''}`}>
        <div className="flex flex-col md:flex-row min-h-[250px]">
          <div className={`w-2 shrink-0 transition-opacity ${project.isArchived ? 'bg-black' : 'bg-accent opacity-20 group-hover:opacity-100'}`} />
          <CardContent className="p-10 flex-1 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">{project.id}</span>
                  <Badge className={`${project.isArchived ? 'bg-black' : 'bg-accent'} text-white rounded-none uppercase tracking-widest text-[8px] py-1`}>
                    {project.tier} Commission
                  </Badge>
                  {project.isArchived && (
                    <Badge variant="outline" className="rounded-none uppercase tracking-widest text-[8px] border-black text-black">
                      Retired Dossier
                    </Badge>
                  )}
                </div>
                <h3 className="text-4xl font-headline italic">{project.project}</h3>
                <div className="flex flex-wrap gap-8 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> {project.isArchived ? "Completed" : "Started"}: {project.isArchived ? project.endDate : project.startDate}</span>
                  <span className="flex items-center gap-2"><Activity className="h-3 w-3" /> Implementation Velocity: {project.progress}%</span>
                </div>
              </div>
              <Button asChild className={`${project.isArchived ? 'bg-black' : 'bg-accent'} text-white rounded-none h-14 px-10 uppercase tracking-widest text-[10px] font-bold group`}>
                <Link href="/dashboard" className="flex items-center gap-2" onClick={() => localStorage.setItem("whyte_verified_project_id", project.id)}>
                  {project.isArchived ? "View Archives" : "Enter Workspace"} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex justify-between text-[9px] uppercase tracking-[0.4em] font-bold text-accent/60">
                <span>{project.isArchived ? "Finalized Progress" : "Live Site Progress"}</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1 bg-secondary rounded-none" />
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 font-body">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Commission Archives</span>
        </div>
        <h1 className="text-5xl font-headline italic">Your <span className="not-italic">Portfolio.</span></h1>
      </motion.div>

      <Tabs defaultValue="active" className="space-y-8">
        <TabsList className="bg-transparent border-b border-accent/5 w-full justify-start rounded-none h-auto p-0 gap-12">
          <TabsTrigger value="active" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0">Active Journeys ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="archived" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent uppercase tracking-[0.3em] text-[10px] font-bold pb-4 px-0 flex gap-2">
            <Archive className="h-3 w-3" /> Master Archives ({archivedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-8">
          {activeProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {activeProjects.length === 0 && (
            <div className="text-center py-32 border border-dashed border-accent/10 space-y-8">
              <div className="h-16 w-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-8 w-8 text-accent/20" />
              </div>
              <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No active project commissions currently linked</p>
              <Button asChild variant="outline" className="rounded-none uppercase tracking-widest text-[10px]">
                <Link href="/dashboard/onboarding">Initiate Verification</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-8">
          {archivedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {archivedProjects.length === 0 && (
            <div className="text-center py-32 border border-dashed border-accent/10">
              <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">The digital archives for your identity are currently empty</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
