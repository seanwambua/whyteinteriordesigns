"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Palette, Globe, Layers, Compass } from "lucide-react";
import { useState } from "react";
import { ServiceInquiryDialog } from "@/components/service-inquiry-dialog";

export default function InteriorDecorPage() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const serviceImage = PlaceHolderImages.find(img => img.id === "service-refresh");

  const curationPillars = [
    {
      title: "The Kenyan Archive",
      description: "Bespoke materials including hand-carved Galana stone, sustainable Rift Valley hardwoods, and artisanal woven textiles.",
      icon: <Compass className="h-6 w-6" />,
      tag: "Local Artisanal"
    },
    {
      title: "Global Procurement",
      description: "White-glove importation of rare Italian marbles, Parisian lighting, and bespoke European furniture archives.",
      icon: <Globe className="h-6 w-6" />,
      tag: "International Sourcing"
    },
    {
      title: "Textile Mastery",
      description: "Layering premium linens and local silks to create depth, warmth, and a sensory connection to the space.",
      icon: <Layers className="h-6 w-6" />,
      tag: "Texture"
    },
    {
      title: "Artistic Direction",
      description: "Developing a cohesive color story and mood that reflects your unique status and personality.",
      icon: <Palette className="h-6 w-6" />,
      tag: "Identity"
    }
  ];

  const curatedProducts = [
    {
      name: "The Savannah Lounge",
      origin: "Nairobi Studio",
      material: "Hand-Stitched Leather & Mahogany",
      image: "portfolio-1"
    },
    {
      name: "Galana Stone Console",
      origin: "Coast Region",
      material: "Honed Kenyan Stone",
      image: "portfolio-2"
    },
    {
      name: "Murano Glass Pendant",
      origin: "Venice, Italy",
      material: "Hand-Blown Glass",
      image: "portfolio-3"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[75vh] flex items-center overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            <Image
              src={serviceImage?.imageUrl || ""}
              alt="Interior Decor"
              fill
              className="object-cover brightness-[0.4]"
              priority
            />
          </motion.div>
          <div className="container relative z-10 mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-accent" />
                <span className="text-accent text-sm font-bold uppercase tracking-[0.3em]">Artisanal Curation</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-headline text-white mb-6 leading-tight">
                Interior <span className="italic">Decor.</span>
              </h1>
              <p className="text-xl text-white/70 font-light leading-relaxed max-w-xl">
                Manifesting your visual identity through a curated dialogue between local craftsmanship and global excellence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-headline leading-tight">
                    The Soul of the <br /> <span className="italic">Sanctuary.</span>
                  </h2>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed">
                    Interior Decor at Whyte is the final, most personal layer of design. We source the extraordinary—pieces that tell a story and textiles that invite touch. Our philosophy celebrates the "Best of Both Worlds": the raw, artisanal beauty of Kenyan materials and the precision of international masterworks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {curationPillars.map((pillar, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-8 border border-border hover:border-accent/40 transition-colors group"
                    >
                      <div className="text-accent mb-6 group-hover:scale-110 transition-transform duration-500">
                        {pillar.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/60 mb-2 block">{pillar.tag}</span>
                      <h3 className="text-lg font-bold mb-3 uppercase tracking-widest text-sm">{pillar.title}</h3>
                      <p className="text-muted-foreground text-sm font-light leading-relaxed">{pillar.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] relative overflow-hidden shadow-2xl">
                  <Image
                    src={PlaceHolderImages.find(img => img.id === "portfolio-1")?.imageUrl || ""}
                    alt="Aesthetic Curation"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-accent/10 -z-10 hidden lg:block" />
              </div>
            </div>
          </div>
        </section>

        {/* Curated Collection Showcase */}
        <section className="py-32 bg-secondary/10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-accent text-xs font-bold uppercase tracking-[0.4em] mb-4 block">The Showcase</span>
              <h2 className="text-4xl font-headline mb-6 text-foreground">A Curated <span className="italic">Selection.</span></h2>
              <p className="text-muted-foreground font-light italic leading-relaxed">
                Exclusive products designed and manufactured by Whyte Interiors in collaboration with Nairobi's finest workshops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {curatedProducts.map((product, index) => {
                const img = PlaceHolderImages.find(i => i.id === product.image);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden mb-6 bg-white shadow-xl">
                      <Image
                        src={img?.imageUrl || ""}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-headline">{product.name}</h3>
                        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">{product.origin}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-light">{product.material}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-4xl font-headline italic">Ready to curate your vision?</h3>
              <p className="text-muted-foreground max-w-xl mx-auto font-light text-lg">
                Whether you desire a locally crafted sanctuary or a globally sourced masterwork, we are your partners in excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  onClick={() => setIsInquiryOpen(true)}
                  className="bg-accent text-white hover:bg-accent/90 rounded-none h-14 px-12 uppercase tracking-[0.2em] transition-all"
                >
                  Request Decor Quote
                </Button>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/5 rounded-none h-14 px-12 uppercase tracking-[0.2em]">
                  <a href="/#quiz">Take Style Quiz</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <ServiceInquiryDialog 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        defaultService="decor" 
      />
    </div>
  );
}
