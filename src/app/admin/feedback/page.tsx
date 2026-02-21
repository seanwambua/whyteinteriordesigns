
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminFeedbackPage() {
  const mockFeedback = [
    {
      id: "FB-001",
      name: "Edward K.",
      email: "edward@example.com",
      rating: 5,
      comment: "The architectural depth in the Westlands Penthouse project is exactly what we were looking for. The transition between the Galana stone foyer and the hardwood main hall is seamless.",
      isApproved: false,
      date: "Oct 24, 2023"
    },
    {
      id: "FB-002",
      name: "Sarah M.",
      email: "sarah@runda.com",
      rating: 4,
      comment: "Incredible attention to detail. The Italian marble procurement took slightly longer than expected, but the final result justifies the wait.",
      isApproved: true,
      date: "Oct 20, 2023"
    }
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-body">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-accent" />
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Testimonial Management</span>
        </div>
        <h1 className="text-5xl font-headline italic">Client <span className="not-italic">Voices.</span></h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {mockFeedback.map((fb, index) => (
          <motion.div
            key={fb.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="rounded-none border-accent/10 shadow-lg bg-white overflow-hidden group">
              <div className="p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-headline italic">{fb.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{fb.email}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`h-3 w-3 ${i <= fb.rating ? 'fill-accent text-accent' : 'text-accent/10'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-light italic text-accent/80 leading-relaxed border-l-2 border-accent/10 pl-6 py-2">
                    "{fb.comment}"
                  </p>
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>{fb.id}</span>
                    <div className="h-1 w-1 bg-accent/20 rounded-full" />
                    <span>Submitted: {fb.date}</span>
                  </div>
                </div>
                
                <div className="flex md:flex-col justify-end gap-3 min-w-[150px]">
                  {fb.isApproved ? (
                    <Badge className="bg-green-600 text-white rounded-none uppercase tracking-widest text-[9px] py-1.5 justify-center">Approved</Badge>
                  ) : (
                    <Button variant="outline" className="rounded-none border-green-600/20 text-green-600 hover:bg-green-600 hover:text-white h-12 uppercase tracking-widest text-[10px] flex gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </Button>
                  )}
                  <Button variant="outline" className="rounded-none border-accent/20 text-accent hover:bg-accent hover:text-white h-12 uppercase tracking-widest text-[10px] flex gap-2">
                    <Trash2 className="h-4 w-4" /> Archive
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
