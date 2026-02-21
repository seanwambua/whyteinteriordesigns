"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Palette, Gem, LayoutGrid, ArrowRight } from "lucide-react";

export default function InteriorDecorPage() {
  const serviceImage = PlaceHolderImages.find(img => img.id === "service-refresh");

  const features = [
    {
      title: "Bespoke Curation",
      description: "Sourcing rare furniture pieces and artisanal artifacts from global archives.",
      icon: <Gem className="h-6 w-6" />
    },
    {
      title: "Textile Mastery",
      description: "Layering premium fabrics and textures to create depth and warmth.",
      icon: <LayoutGrid className="h-6 w-6" />
    },
    {
      title: "Artistic Direction",
      description: "Developing a cohesive color story and mood that reflects your unique personality.",
      icon: <Palette className="h-6 w-6" />
    },
    {
      title: "Final Styling",
      description: "The 'White Glove' touch—arranging every detail to photographic perfection.",
      icon: <Sparkles className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center overflow-hidden">
          <Image
            src={serviceImage?.imageUrl || ""}
            alt="Interior Decor"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
          <div className="container relative z-10 mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Artisanal Curation</span>
              <h1 className="text-6xl md:text-8xl font-headline text-white mb-6 leading-tight">
                Interior <span className="italic">Decor.</span>
              </h1>
              <p className="text-xl text-white/70 font-light leading-relaxed max-w-xl">
                Manifesting your visual identity. We focus on the textures, colors, and curated pieces that breathe life into a space.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Detailed Offerings */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
              <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                <Image
                  src={PlaceHolderImages.find(img => img.id === "portfolio-1")?.imageUrl || ""}
                  alt="Aesthetic Curation"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-4xl font-headline">The Soul of <br /> the Sanctuary.</h2>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed">
                    Interior Decor is the final, most personal layer of design. We source the extraordinary—pieces that tell a story and textiles that invite touch—ensuring every corner of your home feels intentional and soulful.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-12">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-6 group"
                    >
                      <div className="h-14 w-14 shrink-0 border border-accent/20 flex items-center justify-center rounded-full text-accent group-hover:bg-accent group-hover:text-white transition-all">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 uppercase tracking-widest text-sm">{feature.title}</h3>
                        <p className="text-muted-foreground font-light">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 p-16 bg-accent text-white text-center space-y-8"
            >
              <h3 className="text-4xl font-headline italic">Define your visual language.</h3>
              <p className="text-white/70 max-w-xl mx-auto font-light text-lg">
                Let us curate an environment that reflects your status and aesthetic DNA.
              </p>
              <Button asChild size="lg" className="bg-white text-accent hover:bg-white/90 rounded-none h-14 px-12 uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em]">
                <Link href="/#quiz">Take Style Quiz</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
