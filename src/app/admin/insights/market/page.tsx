"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

export default function MarketPresencePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <Card className="rounded-none border-accent/5 shadow-xl bg-white p-10 space-y-10">
        <div className="space-y-1">
          <h3 className="text-xl font-headline italic">Brand Sentiment</h3>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">Verified Client Perspective</p>
        </div>
        <div className="flex items-center justify-center h-48 relative">
          <div className="h-40 w-40 rounded-full border-[12px] border-accent/5 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-headline italic text-accent">4.9</p>
              <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">NPS Rating</p>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-40 w-40 rounded-full border-[12px] border-accent border-t-transparent animate-[spin_8s_linear_infinity] opacity-20" />
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent/40 text-center">Top Sentiment Vectors</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Sophisticated', 'Precise', 'Timeless', 'Artisanal', 'Reliable'].map(tag => (
              <Badge key={tag} variant="secondary" className="rounded-none bg-accent/5 text-accent text-[9px] uppercase tracking-widest py-1">{tag}</Badge>
            ))}
          </div>
        </div>
      </Card>

      <Card className="rounded-none border-accent/5 shadow-xl bg-black text-white p-10 lg:col-span-2 flex flex-col justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Globe className="h-64 w-64" /></div>
        <div className="space-y-1 relative z-10">
          <h3 className="text-2xl font-headline italic">Market Authority</h3>
          <p className="text-[11px] uppercase tracking-widest text-white/40 font-bold">Brand Visibility & Engagement Reach</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 pt-12">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Portfolio Reach</p>
            <p className="text-3xl font-headline italic">12.4K</p>
            <p className="text-[9px] text-green-400 uppercase font-bold tracking-widest">+12% Monthly</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Direct Referrals</p>
            <p className="text-3xl font-headline italic">68%</p>
            <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Primary Growth Driver</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Consultation Volume</p>
            <p className="text-3xl font-headline italic">24</p>
            <p className="text-[9px] text-orange-400 uppercase font-bold tracking-widest">Capacity Alert</p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 mt-12 relative z-10">
          <p className="text-[11px] italic font-light text-white/60 leading-relaxed">
            "Market presence is dominated by high-end residential inquiries in Nairobi's prime districts. Marketing strategy should remain focused on referral-based 'Inner Circle' expansion."
          </p>
        </div>
      </Card>
    </div>
  );
}
