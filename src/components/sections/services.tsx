
"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Sparkles, Hammer, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function Services() {
  const services = [
    {
      title: "Artistic Consultancy",
      description: "Defining the soul of your space through curated color palettes and avant-garde material selections.",
      icon: <MessageSquare className="h-5 w-5" />,
      image: PlaceHolderImages.find(img => img.id === "service-consultancy")!,
    },
    {
      title: "Architectural Build",
      description: "Master-level execution of structural transformations, from heritage restoration to modern minimal builds.",
      icon: <Hammer className="h-5 w-5" />,
      image: PlaceHolderImages.find(img => img.id === "service-build")!,
    },
    {
      title: "Curation & Styling",
      description: "Final-layer perfection. Sourcing rare antiques, custom furniture, and bespoke art installations.",
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
              We don't just design rooms; we choreograph experiences. Our holistic approach ensures that every sensory detail—from tactile textures to spatial acoustics—is considered.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-10 shadow-2xl">
                <Image
                  src={service.image.imageUrl}
                  alt={service.image.description}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                  data-ai-hint={service.image.imageHint}
                />
                <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="space-y-4 pr-6">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 flex items-center justify-center border border-accent/20 rounded-full text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    {service.icon}
                   </div>
                   <h3 className="text-2xl font-headline">{service.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
