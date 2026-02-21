
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MessageSquare, Star, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Active Projects", value: "12", icon: Briefcase, color: "text-blue-500" },
    { title: "New Inquiries", value: "5", icon: MessageSquare, color: "text-accent" },
    { title: "Pending Reviews", value: "3", icon: Star, color: "text-amber-500" },
    { title: "Growth Rate", value: "+18%", icon: TrendingUp, color: "text-green-500" },
  ];

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Operational Overview</span>
        </div>
        <h1 className="text-4xl font-headline italic">Command Center.</h1>
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
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-headline italic">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-none border-accent/10 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-accent">Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-accent/5 hover:border-accent/10 transition-all bg-secondary/5">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider">Project Launch In Nairobi</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Received 2 hours ago — Interior Decor</p>
                  </div>
                  <div className="text-[10px] font-bold text-accent border border-accent/20 px-3 py-1 uppercase tracking-widest">
                    New
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-accent/10 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-accent">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span>Database Health</span>
                <span className="text-green-500">Optimum</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[94%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span>Asset Delivery</span>
                <span className="text-accent">92ms</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[88%]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
