"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Hammer, Ruler, Box, PencilRuler } from "lucide-react";
import { useState } from "react";
import { ServiceInquiryDialog } from "@/components/service-inquiry-dialog";

export default function InteriorDesignPage() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const serviceImage = PlaceHolderImages.find(img => img.id === "service-build");

  const features = [
    {
      title: "Spatial Planning",
      description: "Optimizing flow and functionality through meticulous architectural assessment.",
      icon: <Box className="h-6 w-6" />
    },
    {
      title: "Technical Blueprints",
      description: "Detailed construction documents ensuring precision in every structural change.",
      icon: <PencilRuler className="h-6 w-6" />
    },
    {
      title: "3D Visualization",
      description: "Photorealistic renders that allow you to walk through your vision before it's built.",
      icon: <Ruler className="h-6 w-6" />
    },
    {
      title: "Project Management",
      description: "On-site supervision and coordination with contractors for seamless execution.",
      icon: <Hammer className="h-6 w-6" />
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
            alt="Interior Design"
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
              <span className="text-accent text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Architectural Excellence</span>
              <h1 className="text-6xl md:text-8xl font-headline text-white mb-6 leading-tight">
                Interior <span className="italic">Design.</span>
              </h1>
              <p className="text-xl text-white/70 font-light leading-relaxed max-w-xl">
                Redefining the bones of your space. We focus on the structural integrity, spatial flow, and architectural DNA of luxury environments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Detailed Offerings */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-4xl font-headline">The Blueprint for <br /> Timeless Living.</h2>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed">
                    Our interior design service is for those seeking a complete transformation. From raw concrete to a masterfully planned residence, we handle the complexities of architectural planning and structural modifications.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-12">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
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

              <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                <Image
                  src={PlaceHolderImages.find(img => img.id === "portfolio-4")?.imageUrl || ""}
                  alt="Architectural Planning"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 p-16 bg-accent text-white text-center space-y-8"
            >
              <h3 className="text-4xl font-headline italic">Ready to redefine your space?</h3>
              <p className="text-white/70 max-w-xl mx-auto font-light text-lg">
                Schedule a consultation to discuss the structural potential of your home or commercial environment.
              </p>
              <Button 
                onClick={() => setIsInquiryOpen(true)}
                className="bg-white text-accent hover:bg-white/90 rounded-none h-14 px-12 uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em]"
              >
                Request Design Quote
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <ServiceInquiryDialog 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        defaultService="design" 
      />
    </div>
  );
}
