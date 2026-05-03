
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import Image from "next/image";
import { useWhyteStore } from "@/store/use-whyte-store";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPortfolioPage() {
  const { projects, removeProject } = useWhyteStore();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleDelete = (id: string) => {
    removeProject(id);
    toast({
      title: "Portfolio Updated",
      description: "Project has been removed from the public exhibition deck.",
    });
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
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Exhibition Deck</span>
          </div>
          <h1 className="text-5xl font-headline italic">The <span className="not-italic">Collection.</span></h1>
        </div>
        <Button className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-[0.2em] text-[10px] flex gap-2">
          <Plus className="h-4 w-4" /> New Exhibition Project
        </Button>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden group">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
                <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                   <Button variant="secondary" className="rounded-full h-12 w-12 p-0"><Edit2 className="h-4 w-4" /></Button>
                   <Button 
                    variant="destructive" 
                    className="rounded-full h-12 w-12 p-0"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">{project.category}</span>
                    <h3 className="text-3xl font-headline italic">{project.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[10px] uppercase tracking-widest">{project.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {projects.length === 0 && (
          <div className="lg:col-span-2 text-center py-32 border border-dashed border-accent/10">
            <p className="text-sm font-light italic text-muted-foreground uppercase tracking-[0.3em]">No projects currently showcased in the digital collection</p>
          </div>
        )}
      </div>
    </div>
  );
}
