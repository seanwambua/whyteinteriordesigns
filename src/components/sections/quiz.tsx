
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type StyleResult = {
  designStyleName: string;
  summary: string;
  keyElements: string[];
  colorScheme: string;
  furnitureSuggestions: string[];
};

export function StyleQuiz() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StyleResult | null>(null);
  const [step, setStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({
    roomType: "Living Room",
    colorPalette: "Warm Neutrals",
    furnitureStyles: [] as string[],
    roomAmbiance: "Cozy and Inviting",
    budgetPreference: "Mid-range"
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const furnitureOptions = ["Mid-century Modern", "Minimalist", "Bohemian", "Industrial", "Art Deco", "Scandi"];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const styles: Record<string, StyleResult> = {
        "Mid-century Modern": {
          designStyleName: "Refined Modernist",
          summary: "A seamless blend of organic forms and geometric precision.",
          keyElements: ["Tapered legs", "Teak accents", "Functional aesthetics"],
          colorScheme: "Mustard yellow, olive green, and warm walnut.",
          furnitureSuggestions: ["Eames Lounge Chair", "Sleek Sideboard", "Sunburst Clock"]
        },
        "Minimalist": {
          designStyleName: "Pure Essentialism",
          summary: "Elegance through subtraction and intentionality.",
          keyElements: ["Negative space", "Monochromatic textures", "Hidden storage"],
          colorScheme: "Alabaster, charcoal, and soft greige.",
          furnitureSuggestions: ["Low-profile Sofa", "Stone Coffee Table", "Floating Shelves"]
        },
        "Default": {
          designStyleName: "Contemporary Bespoke",
          summary: "A curated harmony of timeless comfort and modern luxury.",
          keyElements: ["Layered textiles", "Ambient lighting", "Artisanal finishes"],
          colorScheme: "Champagne, slate, and brushed gold.",
          furnitureSuggestions: ["Velvet Armchair", "Modular Sectional", "Brass Floor Lamp"]
        }
      };

      const matchedStyle = formData.furnitureStyles.includes("Minimalist") 
        ? styles["Minimalist"] 
        : formData.furnitureStyles.includes("Mid-century Modern") 
        ? styles["Mid-century Modern"] 
        : styles["Default"];

      setResult(matchedStyle);
      setLoading(false);
    }, 1500);
  };

  const toggleFurniture = (style: string) => {
    setFormData(prev => ({
      ...prev,
      furnitureStyles: prev.furnitureStyles.includes(style)
        ? prev.furnitureStyles.filter(s => s !== style)
        : [...prev.furnitureStyles, style]
    }));
  };

  if (!isMounted) return null;

  if (result) {
    return (
      <section id="quiz" className="py-32 bg-secondary/10 font-body">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden border border-accent/5"
          >
            <div className="grid md:grid-cols-12">
              <div className="md:col-span-5 bg-accent p-12 text-white flex flex-col justify-between min-h-[500px]">
                <div className="space-y-8">
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/40">Visual Identity Decrypted</span>
                  <h2 className="text-5xl font-headline leading-tight italic">{result.designStyleName}</h2>
                  <p className="text-white/70 font-light text-xl italic leading-relaxed border-l border-white/20 pl-8">
                    "{result.summary}"
                  </p>
                </div>
                <div className="pt-12">
                  <Sparkles className="h-12 w-12 text-white/20" />
                </div>
              </div>
              <div className="md:col-span-7 p-12 space-y-12">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Technical Pillars</h3>
                    <ul className="space-y-3 text-accent/80 font-light italic">
                      {result.keyElements.map((el, i) => <li key={i} className="flex items-center gap-3"><div className="h-1 w-1 bg-accent/20 rounded-full" />{el}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Palette Protocol</h3>
                    <p className="text-base text-accent/80 font-light leading-relaxed italic">{result.colorScheme}</p>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-accent/5">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent/40">Curated Curation</h3>
                  <div className="flex flex-wrap gap-3">
                    {result.furnitureSuggestions.map((item, i) => (
                      <span key={i} className="px-6 py-2 border border-accent/10 text-accent text-[13px] font-light italic bg-secondary/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-12 flex flex-col sm:flex-row gap-6">
                  <Button asChild className="bg-accent text-white rounded-none h-14 px-10 uppercase tracking-widest text-[11px] font-bold flex-1 shadow-xl">
                    <a href="#contact">Request Design Dossier</a>
                  </Button>
                  <Button onClick={() => {setResult(null); setStep(1);}} variant="outline" className="rounded-none h-14 px-10 border-accent/10 text-accent uppercase tracking-widest text-[11px] font-bold">
                    Re-initialize Engine
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="py-32 bg-white font-body">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-24 items-start">
          <div className="md:w-1/3 sticky top-32 space-y-10">
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-4">
                <div className="h-px w-12 bg-accent" />
                <span className="text-accent text-[11px] font-bold uppercase tracking-[0.4em]">Design Intelligence</span>
              </motion.div>
              <h2 className="text-6xl font-headline leading-tight italic">Discover Your <span className="not-italic">Visual DNA.</span></h2>
              <p className="text-xl text-muted-foreground font-light leading-relaxed italic">
                Our analysis engine cross-references your spatial preferences with architectural movements to pinpoint your unique design language.
              </p>
            </div>
            
            <div className="space-y-8 pt-10 border-t border-accent/5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-6">
                  <div className={cn("h-2.5 w-2.5 rounded-full transition-all", step >= i ? 'bg-accent shadow-[0_0_10px_rgba(var(--accent),0.4)]' : 'bg-accent/10')} />
                  <span className={cn("text-[11px] font-bold uppercase tracking-[0.3em]", step === i ? 'text-accent' : 'text-accent/20')}>
                    {i === 1 && "Phase I: The Canvas"}
                    {i === 2 && "Phase II: The Palette"}
                    {i === 3 && "Phase III: The Form"}
                    {i === 4 && "Phase IV: The Ambition"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="min-h-[600px] flex flex-col justify-between"
              >
                <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between flex-1">
                  <div className="space-y-12">
                    <h3 className="text-4xl font-headline italic text-accent leading-tight">
                      {step === 1 && "Which spatial environment are we curating?"}
                      {step === 2 && "Define your atmospheric palette."}
                      {step === 3 && "Select your preferred architectural movements."}
                      {step === 4 && "Define your ultimate spatial objectives."}
                    </h3>

                    {step === 1 && (
                      <RadioGroup value={formData.roomType} onValueChange={(v) => setFormData({...formData, roomType: v})} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {["Living Room", "Primary Bedroom", "Executive Office", "Dining Suite", "Commercial Space", "Bespoke Other"].map(opt => (
                          <Label key={opt} className={cn(
                            "group flex items-center justify-between p-10 border transition-all cursor-pointer rounded-none h-32",
                            formData.roomType === opt ? 'border-accent bg-accent/[0.02] shadow-xl' : 'border-accent/5 hover:border-accent/20 bg-white'
                          )}>
                            <span className={cn("text-[13px] font-bold uppercase tracking-[0.2em]", formData.roomType === opt ? 'text-accent' : 'text-accent/40')}>{opt}</span>
                            <RadioGroupItem value={opt} className="sr-only" />
                            <div className={cn("h-5 w-5 border flex items-center justify-center transition-all", formData.roomType === opt ? 'bg-accent border-accent' : 'border-accent/10')}>
                              {formData.roomType === opt && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    )}

                    {step === 2 && (
                      <div className="space-y-8">
                        <Label className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40 block mb-6">Mood & Color Protocol</Label>
                        <RadioGroup value={formData.colorPalette} onValueChange={(v) => setFormData({...formData, colorPalette: v})} className="grid grid-cols-1 gap-4">
                          {["Warm Curation (Neutrals & Wood)", "Bold Authority (Vibrant & Contrast)", "Atmospheric Calm (Monochrome)", "Organic Depth (Forest & Earth)", "Soft Sophistication (Pastels)"].map(opt => (
                            <Label key={opt} className={cn(
                              "flex items-center gap-8 p-8 border transition-all cursor-pointer h-24",
                              formData.colorPalette === opt ? 'border-accent bg-accent/[0.02] shadow-xl' : 'border-accent/5 hover:border-accent/20'
                            )}>
                              <RadioGroupItem value={opt} className="sr-only" />
                              <div className={cn("h-5 w-5 border flex items-center justify-center transition-all", formData.colorPalette === opt ? 'bg-accent border-accent' : 'border-accent/10')}>
                                {formData.colorPalette === opt && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className={cn("text-lg font-light italic", formData.colorPalette === opt ? 'text-accent' : 'text-accent/60')}>{opt}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {furnitureOptions.map(style => (
                          <div 
                            key={style} 
                            className={cn(
                              "flex items-center justify-between p-10 border cursor-pointer h-32",
                              formData.furnitureStyles.includes(style) ? 'border-accent bg-accent/[0.02] shadow-xl' : 'border-accent/5 hover:border-accent/20'
                            )}
                            onClick={() => toggleFurniture(style)}
                          >
                            <span className={cn("text-[13px] font-bold uppercase tracking-[0.2em]", formData.furnitureStyles.includes(style) ? 'text-accent' : 'text-accent/40')}>{style}</span>
                            <div className={cn("h-5 w-5 border flex items-center justify-center transition-all", formData.furnitureStyles.includes(style) ? 'bg-accent border-accent' : 'border-accent/10')}>
                              {formData.furnitureStyles.includes(style) && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-8">
                        <Label className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40 block mb-6">Investment Intent</Label>
                        <RadioGroup value={formData.budgetPreference} onValueChange={(v) => setFormData({...formData, budgetPreference: v})} className="flex flex-col gap-4">
                          {["Luxury (Unrestricted Curation)", "Mid-range (Refined Selection)", "Agile (Budget-aware Essentials)"].map(opt => (
                            <Label key={opt} className={cn(
                              "flex items-center gap-8 p-8 border transition-all cursor-pointer h-24",
                              formData.budgetPreference === opt ? 'border-accent bg-accent/[0.02] shadow-xl' : 'border-accent/5 hover:border-accent/20'
                            )}>
                              <RadioGroupItem value={opt} className="sr-only" />
                              <div className={cn("h-5 w-5 border flex items-center justify-center transition-all", formData.budgetPreference === opt ? 'bg-accent border-accent' : 'border-accent/10')}>
                                {formData.budgetPreference === opt && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className={cn("text-lg font-light italic", formData.budgetPreference === opt ? 'text-accent' : 'text-accent/60')}>{opt}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-12 border-t border-accent/5 mt-12">
                    {step > 1 ? (
                      <Button type="button" variant="ghost" onClick={handleBack} className="text-accent/40 hover:text-accent font-bold uppercase tracking-widest text-[11px] px-0">Abort Phase</Button>
                    ) : <div />}
                    
                    {step < 4 ? (
                      <Button type="button" onClick={handleNext} disabled={step === 3 && formData.furnitureStyles.length === 0} className="bg-accent text-white rounded-none px-12 h-16 uppercase tracking-widest text-[11px] font-bold shadow-2xl flex gap-3">
                        Initialize Next Phase <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={loading} className="bg-accent text-white rounded-none px-16 h-16 min-w-[240px] uppercase tracking-widest text-[11px] font-bold shadow-2xl">
                        {loading ? (
                          <span className="flex items-center gap-3">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Calibrating DNA...
                          </span>
                        ) : "Decrypt Aesthetic DNA"}
                      </Button>
                    )}
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
