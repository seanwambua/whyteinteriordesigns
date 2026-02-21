
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MessageSquare, Star, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Active Client Journeys", value: "8", icon: Briefcase, color: "text-accent" },
    { title: "New Inquiries", value: "14", icon: MessageSquare, color: "text-accent" },
    { title: "Client Satisfaction", value: "4.9", icon: Star, color: "text-amber-500" },
    { title: "Project Velocity", value: "+12%", icon: TrendingUp, color: "text-green-500" },
  ];

  const recentInquiries = [
    { id: 1, client: "Muthaiga Estate", service: "Interior Design", time: "2h ago", status: "New" },
    { id: 2, client: "Karen Residency", service: "Bespoke Decor", time: "5h ago", status: "Contacted" },
    { id: 3, client: "Westlands HQ", service: "Full Bundle", time: "1d ago", status: "New" },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Studio Intelligence</span>
        </div>
        <h1 className="text-5xl font-headline italic">Command Center.</h1>
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
            <CardTitle className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Active Pipeline</CardTitle>
            <Link href="/admin/inquiries" className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent flex items-center gap-2 transition-colors">
              View All Pipeline <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-6 border border-accent/5 hover:border-accent/10 transition-all bg-secondary/10 group cursor-pointer">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] group-hover:text-accent transition-colors">{inquiry.client}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-light italic">
                      {inquiry.time} — {inquiry.service}
                    </p>
                  </div>
                  <div className={`text-[9px] font-bold border px-4 py-1.5 uppercase tracking-widest ${
                    inquiry.status === 'New' ? 'text-accent border-accent/20 bg-accent/5' : 'text-muted-foreground border-border'
                  }`}>
                    {inquiry.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="rounded-none border-accent/10 shadow-xl bg-white p-8">
            <CardTitle className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-8">Client Sentiment</CardTitle>
            <div className="space-y-8">
              <div className="p-6 bg-accent/5 border-l-2 border-accent italic">
                <p className="text-xs font-light text-accent/80 leading-relaxed mb-4">
                  "The attention to detail on the Muthaiga project is unparalleled. The Italian marble shipment was handled with such care."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Jane D.</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-2.5 w-2.5 fill-accent text-accent" />)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-none border-accent/10 shadow-xl bg-secondary/10 p-8 border-dashed">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent/40 mb-4">System Log</h4>
            <ul className="space-y-3">
              <li className="text-[9px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="h-1 w-1 bg-green-500 rounded-full" /> Project "Nairobi HQ" milestone updated
              </li>
              <li className="text-[9px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="h-1 w-1 bg-accent rounded-full" /> New feedback from Karen Residency
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
