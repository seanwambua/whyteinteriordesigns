"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-bg")!;

  return (
    <section className="relative w-full h-[95vh] flex items-center overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover brightness-[0.65]"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="h-px w-8 bg-white/60" />
            <span className="text-white/80 text-xs font-semibold tracking-[0.3em] uppercase">
              Bespoke Luxury Interiors
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-6xl md:text-8xl lg:text-9xl font-headline text-white mb-8 leading-[1.1]"
          >
            Timeless <br />
            <span className="italic">Sophistication.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-xl mb-12 font-light"
          >
            Elevating living through meticulous design and rare craftsmanship. Your vision, masterfully realized by Whyte Interiors.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 text-lg px-10 h-14 rounded-none transition-all hover:tracking-wider">
              <Link href="#portfolio">Explore Works</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-10 h-14 rounded-none transition-all">
              <Link href="#quiz" className="flex items-center gap-2">
                Curate Your Style <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/60"
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.8, 2.5],
              opacity: [0.4, 0.2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-10 w-10 border border-white/50 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1.8],
              opacity: [0.3, 0.1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute h-10 w-10 border border-white/40 rounded-full"
          />
          <span className="text-[10px] uppercase tracking-[0.5em] relative z-10 font-bold">Scroll</span>
        </div>
        <div className="h-16 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
}
