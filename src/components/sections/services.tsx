
"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Sparkles, Hammer, ArrowRight, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { ServiceInquiryDialog } from "@/components/service-inquiry-dialog";

export function Services() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<"design" | "decor" | "bundle">("design");

  const handleInquiry = (type: "design" | "decor" | "bundle") => {
    setSelectedService(type);
    setIsInquiryOpen(true);
  };

  const services = [
    {
      id: "design" as const,
      title: "Interior Design",
      href: "/services/interior-design",
      description: "Comprehensive spatial planning and architectural structural changes to redefine the functionality and flow of your luxury environment.",
      icon: <Hammer className="h-5 w-5" />,
      image: PlaceHolderImages.find(img => img.id === "service-build")!,
    },
    {
      id: "decor" as const,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto mb-24">
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
                  className="object-cover transition-all duration-700 scale-110 group-hover:scale-100"
                  data-ai-hint={service.image.imageHint}
                  fill={true}
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
                <div className="flex flex-wrap gap-4">
                  <Button asChild variant="outline" className="rounded-none border-accent text-accent hover:bg-accent hover:text-white h-12 px-8 uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 group">
                    <Link href={service.href}>
                      Explore <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto border border-accent/20 p-12 bg-white flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Layers className="h-6 w-6 text-accent" />
              <h3 className="text-3xl font-headline">The Comprehensive <span className="italic">Bundle.</span></h3>
            </div>
            <p className="text-muted-foreground font-light max-w-xl italic">
              Experience the ultimate transformation by combining architectural structural planning with our high-end decor curation service.
            </p>
          </div>
          <Button 
            onClick={() => handleInquiry("bundle")}
            className="bg-accent text-white hover:bg-accent/90 rounded-none h-14 px-12 uppercase tracking-[0.2em] shrink-0"
          >
            Inquire for Both
          </Button>
        </motion.div>
      </div>
      <ServiceInquiryDialog 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        defaultService={selectedService} 
      />
    </section>
  );
}
