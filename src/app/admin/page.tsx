
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MessageSquare, Star, TrendingUp, ArrowUpRight, RefreshCcw, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useWhyteStore } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const { clientProjects, inquiries, feedback, clearAllData } = useWhyteStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const stats = [
    { title: "Active Client Journeys", value: clientProjects.length.toString(), icon: Briefcase, color: "text-accent" },
    { title: "Open Inquiries", value: inquiries.filter(i => i.status === 'new').length.toString(), icon: MessageSquare, color: "text-accent" },
    { title: "Client Feedback", value: feedback.length.toString(), icon: Star, color: "text-amber-500" },
    { title: "Project Velocity", value: "+12%", icon: TrendingUp, color: "text-green-500" },
  ];

  const handleReset = () => {
    clearAllData();
    toast({
      title: "Digital Vault Purged",
      description: "All studio local state has been synchronized to empty.",
    });
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Studio Intelligence</span>
          </div>
          <h1 className="text-5xl font-headline italic">Command Center.</h1>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="rounded-none border-destructive/20 text-destructive hover:bg-destructive hover:text-white h-12 uppercase tracking-widest text-[9px] flex gap-2">
              <RefreshCcw className="h-3.5 w-3.5" /> Purge System Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-none border-accent/20 font-body">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-4 w-4 text-destructive" />
                <span className="text-destructive text-[10px] font-bold uppercase tracking-[0.3em]">Critical Protocol</span>
              </div>
              <AlertDialogTitle className="text-2xl font-headline italic">Confirm Digital Purge?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground font-light leading-relaxed">
                This will permanently remove all locally persisted studio data, including active journeys and inquiries. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-6">
              <AlertDialogCancel className="rounded-none uppercase tracking-widest text-[10px] font-bold h-12">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleReset}
                className="bg-destructive text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-12 hover:bg-destructive/90"
              >
                Confirm Purge
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/10 shadow-xl hover:border-accent/30 transition-all group bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-headline italic">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <Card className="lg:col-span-2 rounded-none border-accent/10 shadow-2xl bg-white overflow-hidden">
          <div className="bg-accent h-1 w-full" />
          <CardHeader className="flex flex-row items-center justify-between p-8">
            <CardTitle className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Recent Activity</CardTitle>
            <Link href="/admin/inquiries" className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent flex items-center gap-2 transition-colors">
              View All Pipeline <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-4">
              {inquiries.slice(0, 3).map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-6 border border-accent/5 hover:border-accent/10 transition-all bg-secondary/10 group cursor-pointer">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{inquiry.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-light italic">
                      {inquiry.date} — {inquiry.serviceType}
                    </p>
                  </div>
                  <div className={`text-[9px] font-bold border px-4 py-1.5 uppercase tracking-widest ${
                    inquiry.status === 'new' ? 'text-accent border-accent/20 bg-accent/5' : 'text-muted-foreground border-border'
                  }`}>
                    {inquiry.status}
                  </div>
                </div>
              ))}
              {inquiries.length === 0 && (
                <div className="text-center py-12 text-[10px] uppercase tracking-widest text-muted-foreground italic">
                  No active pipeline entries
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="rounded-none border-accent/10 shadow-xl bg-white p-8">
            <CardTitle className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-8">Client Sentiment</CardTitle>
            <div className="space-y-8">
              {feedback.filter(fb => fb.isApproved).slice(0, 1).map(fb => (
                <div key={fb.id} className="p-6 bg-accent/5 border-l-2 border-accent italic">
                  <p className="text-xs font-light text-accent/80 leading-relaxed mb-4">
                    "{fb.comment}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{fb.name}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className={`h-2.5 w-2.5 ${i <= fb.rating ? 'fill-accent text-accent' : 'text-accent/10'}`} />)}
                    </div>
                  </div>
                </div>
              ))}
              {feedback.filter(fb => fb.isApproved).length === 0 && (
                <div className="text-center py-6 text-[10px] uppercase tracking-widest text-muted-foreground italic">
                  No approved testimonials
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-none border-accent/10 shadow-xl bg-secondary/10 p-8 border-dashed">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 mb-4">System Log</h4>
            <ul className="space-y-3">
              <li className="text-[9px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="h-1 w-1 bg-green-500 rounded-full" /> {clientProjects.length} projects active
              </li>
              <li className="text-[9px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="h-1 w-1 bg-accent rounded-full" /> {inquiries.length} inquiries logged
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
