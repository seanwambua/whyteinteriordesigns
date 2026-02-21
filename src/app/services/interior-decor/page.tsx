"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Palette, Gem, LayoutGrid, Globe, Compass } from "lucide-react";

export default function InteriorDecorPage() {
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
      icon: <LayoutGrid className="h-6 w-6" />,
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
                {/* Accent Blueprint Decoration */}
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

        {/* Made in Kenya Feature */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="bg-accent text-white p-12 lg:p-24 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="space-y-8">
                  <h3 className="text-4xl md:text-5xl font-headline leading-tight">
                    Bespoke <br /> <span className="italic text-white/80">Made in Kenya.</span>
                  </h3>
                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    We take immense pride in our local heritage. By utilizing regional materials like sustainable bamboo, volcanic stone, and hand-loomed textiles, we create spaces that resonate with a global luxury standard while remaining deeply rooted in the Kenyan landscape.
                  </p>
                  <ul className="space-y-4 text-white/80 font-light italic">
                    <li className="flex items-center gap-3">
                      <div className="h-1 w-4 bg-white/40" /> Hand-finished Nairobi Hardwoods
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-1 w-4 bg-white/40" /> Regional Stone Craftsmanship
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-1 w-4 bg-white/40" /> Artisanal Metalwork Archives
                    </li>
                  </ul>
                  <Button asChild className="bg-white text-accent hover:bg-white/90 rounded-none h-14 px-12 uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em]">
                    <Link href="/#contact">Discuss Custom Sourcing</Link>
                  </Button>
                </div>
                <div className="relative aspect-video lg:aspect-square overflow-hidden border border-white/20">
                  <Image
                    src={PlaceHolderImages.find(img => img.id === "service-refresh")?.imageUrl || ""}
                    alt="Kenya Bespoke"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Decorative graphic background pattern */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white/[0.03] -skew-x-12 transform translate-x-1/4" />
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
                <Button asChild size="lg" className="bg-accent text-white hover:bg-accent/90 rounded-none h-14 px-12 uppercase tracking-[0.2em] transition-all">
                  <Link href="/#contact">Book Consultation</Link>
                </Button>
                <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/5 rounded-none h-14 px-12 uppercase tracking-[0.2em]">
                  <Link href="/#quiz">Take Style Quiz</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
