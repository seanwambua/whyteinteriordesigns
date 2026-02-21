"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function Portfolio() {
  const projects = [
    {
      id: "portfolio-1",
      title: "Serene Sanctuary",
      category: "Residential",
      location: "Upper East Side",
      size: "large",
    },
    {
      id: "portfolio-2",
      title: "The Obsidian Loft",
      category: "Commercial",
      location: "Financial District",
      size: "small",
    },
    {
      id: "portfolio-3",
      title: "Marble & Light",
      category: "Residential",
      location: "Chelsea",
      size: "small",
    },
    {
      id: "portfolio-4",
      title: "Aether Lobby",
      category: "Commercial",
      location: "Midtown",
      size: "large",
    },
  ];

  return (
    <section id="portfolio" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent text-sm font-bold uppercase tracking-[0.3em]">The Collection</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-headline mb-8 leading-tight"
          >
            Transformations <br /> that define <span className="italic">Luxury.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light"
          >
            A curated selection of our most ambitious projects. Each space is a testament to our commitment to excellence and high-end aesthetics.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {projects.map((project, index) => {
            const imageData = PlaceHolderImages.find(img => img.id === project.id)!;
            const isLarge = project.size === "large";
            
            return (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`${isLarge ? 'md:col-span-7' : 'md:col-span-5'} relative group overflow-hidden`}
              >
                <div className="aspect-[16/10] md:aspect-auto md:h-[600px] overflow-hidden">
                  <Image
                    src={imageData.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    data-ai-hint={imageData.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                </div>
                
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">{project.category} — {project.location}</span>
                      <h3 className="text-3xl font-headline font-medium group-hover:italic transition-all">{project.title}</h3>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="h-12 w-12 border border-border flex items-center justify-center rounded-full group-hover:bg-accent group-hover:text-white transition-all cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
