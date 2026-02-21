"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Sparkles, Hammer, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Services() {
  const services = [
    {
      title: "Interior Design",
      href: "/services/interior-design",
      description: "Comprehensive spatial planning and architectural structural changes to redefine the functionality and flow of your luxury environment.",
      icon: <Hammer className="h-5 w-5" />,
      image: PlaceHolderImages.find(img => img.id === "service-build")!,
    },
    {
      title: "Interior Decor",
      href: "/services/interior-decor",
      description: "Masterful curation of high-end furniture, bespoke textiles, and artistic accents to manifest your unique visual identity.",
      icon: <Sparkles className="h-5 w-5" />,
      image: PlaceHolderImages.find(img => img.id === "service-refresh")!,
    },
  ];

  return (
    <section id="services" className="py-32 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center mb-32">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent text-sm font-bold uppercase tracking-[0.3em]">Our Method</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-headline"
            >
              The Pillars of <br /><span className="italic">Bespoke Design.</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              We focus on two distinct yet harmonious disciplines to create spaces that are as functional as they are beautiful. From structural integrity to the final artistic layer.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="relative aspect-[16/10] md:aspect-[16/12] overflow-hidden mb-10 shadow-2xl">
                <Image
                  src={service.image.imageUrl}
                  alt={service.image.description}
                  fill
                  className="object-cover transition-all duration-700 scale-110 group-hover:scale-100"
                  data-ai-hint={service.image.imageHint}
                />
                <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="space-y-6 pr-6">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 flex items-center justify-center border border-accent/20 rounded-full text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    {service.icon}
                   </div>
                   <h3 className="text-3xl font-headline">{service.title}</h3>
                </div>
                <p className="text-xl text-muted-foreground leading-relaxed font-light">
                  {service.description}
                </p>
                <Button asChild variant="outline" className="rounded-none border-accent text-accent hover:bg-accent hover:text-white h-12 px-8 uppercase tracking-widest text-xs transition-all flex items-center gap-2 group">
                  <Link href={service.href}>
                    Explore Service <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
