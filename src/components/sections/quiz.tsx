"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <section id="quiz" className="py-32 bg-secondary/10">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="grid md:grid-cols-12">
              <div className="md:col-span-5 bg-accent p-12 text-white flex flex-col justify-between min-h-[500px]">
                <div className="space-y-6">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">Your Aesthetic DNA</span>
                  <h2 className="text-5xl font-headline leading-tight">{result.designStyleName}</h2>
                  <p className="text-white/70 font-light text-lg italic leading-relaxed">
                    "{result.summary}"
                  </p>
                </div>
                <div className="pt-12">
                  <Sparkles className="h-12 w-12 text-white/20" />
                </div>
              </div>
              <div className="md:col-span-7 p-12 space-y-12">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Key Elements</h3>
                    <ul className="space-y-2 text-muted-foreground font-light">
                      {result.keyElements.map((el, i) => <li key={i} className="flex items-start gap-2"><div className="h-1.5 w-1.5 bg-accent/30 rounded-full mt-2" />{el}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Palette</h3>
                    <p className="text-muted-foreground font-light leading-relaxed">{result.colorScheme}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Curated Selection</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.furnitureSuggestions.map((item, i) => (
                      <span key={i} className="px-4 py-1.5 border border-border text-accent text-sm font-light italic">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-accent text-white hover:bg-accent/90 rounded-none px-8 h-12 flex-1">
                    <a href="#contact">Request Design Proposal</a>
                  </Button>
                  <Button onClick={() => {setResult(null); setStep(1);}} variant="outline" className="rounded-none px-8 h-12 border-accent text-accent">
                    Retake Quiz
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
    <section id="quiz" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-24 items-start">
          <div className="md:w-1/3 sticky top-32">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent text-sm font-bold uppercase tracking-[0.3em]">Design Consultant</span>
            </motion.div>
            <h2 className="text-5xl font-headline mb-8 leading-tight">Discover Your <span className="italic">Visual Language.</span></h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-12">
              Our analysis engine cross-references your preferences with classic design movements to pinpoint your unique interior DNA.
            </p>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`h-2 w-2 rounded-full ${step >= i ? 'bg-accent' : 'bg-border'}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${step === i ? 'text-accent' : 'text-muted-foreground'}`}>
                    {i === 1 && "The Canvas"}
                    {i === 2 && "The Palette"}
                    {i === 3 && "The Form"}
                    {i === 4 && "The Ambition"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-[500px]"
              >
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-headline italic">
                      {step === 1 && "Which room are we curating?"}
                      {step === 2 && "Define your color & mood."}
                      {step === 3 && "Select preferred movements."}
                      {step === 4 && "Final spatial goals."}
                    </h3>
                  </div>

                  {step === 1 && (
                    <RadioGroup value={formData.roomType} onValueChange={(v) => setFormData({...formData, roomType: v})} className="grid grid-cols-2 gap-8">
                      {["Living Room", "Bedroom", "Home Office", "Dining Room", "Commercial Space", "Other"].map(opt => (
                        <Label key={opt} className={`group flex items-center justify-between p-10 border transition-all cursor-pointer ${formData.roomType === opt ? 'border-accent bg-accent/[0.02]' : 'hover:border-accent/40'}`}>
                          <span className="text-lg font-light uppercase tracking-widest">{opt}</span>
                          <RadioGroupItem value={opt} className="sr-only" />
                          <div className={`h-4 w-4 border rounded-full flex items-center justify-center ${formData.roomType === opt ? 'border-accent' : 'border-border group-hover:border-accent/40'}`}>
                            {formData.roomType === opt && <div className="h-2 w-2 bg-accent rounded-full" />}
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}

                  {step === 2 && (
                    <div className="space-y-12">
                      <div className="space-y-6">
                        <Label className="text-xs font-bold uppercase tracking-widest opacity-50">Color Palette</Label>
                        <RadioGroup value={formData.colorPalette} onValueChange={(v) => setFormData({...formData, colorPalette: v})} className="grid grid-cols-1 gap-4">
                          {["Warm Neutrals", "Bold and Vibrant", "Monochromatic Blues", "Deep Forest Greens", "Soft Pastels"].map(opt => (
                            <Label key={opt} className={`flex items-center gap-6 p-6 border transition-all cursor-pointer ${formData.colorPalette === opt ? 'border-accent' : 'hover:border-accent/40'}`}>
                              <RadioGroupItem value={opt} className="h-4 w-4 border-accent text-accent" />
                              <span className="text-lg font-light">{opt}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="grid grid-cols-2 gap-8">
                      {furnitureOptions.map(style => (
                        <div 
                          key={style} 
                          className={`flex items-center justify-between p-10 border transition-all cursor-pointer ${formData.furnitureStyles.includes(style) ? 'border-accent bg-accent/[0.02]' : 'hover:border-accent/40'}`} 
                          onClick={() => toggleFurniture(style)}
                        >
                          <span className="text-lg font-light uppercase tracking-widest">{style}</span>
                          <Checkbox checked={formData.furnitureStyles.includes(style)} className="data-[state=checked]:bg-accent border-accent" />
                        </div>
                      ))}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-12">
                      <div className="space-y-6">
                        <Label className="text-xs font-bold uppercase tracking-widest opacity-50">Investment Range</Label>
                        <RadioGroup value={formData.budgetPreference} onValueChange={(v) => setFormData({...formData, budgetPreference: v})} className="flex flex-col gap-4">
                          {["Luxury", "Mid-range", "Budget-conscious"].map(opt => (
                            <Label key={opt} className={`flex items-center gap-6 p-8 border transition-all cursor-pointer ${formData.budgetPreference === opt ? 'border-accent' : 'hover:border-accent/40'}`}>
                              <RadioGroupItem value={opt} className="h-4 w-4 border-accent text-accent" />
                              <span className="text-lg font-light tracking-wide">{opt}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-12 border-t">
                    {step > 1 ? (
                      <Button type="button" variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-accent font-light uppercase tracking-widest px-0">Back</Button>
                    ) : <div />}
                    
                    {step < 4 ? (
                      <Button type="button" onClick={handleNext} disabled={step === 3 && formData.furnitureStyles.length === 0} className="bg-accent text-white hover:bg-accent/90 rounded-none px-12 h-14 uppercase tracking-widest transition-all hover:tracking-[0.2em] flex gap-2">
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={loading} className="bg-accent text-white hover:bg-accent/90 rounded-none px-12 h-14 min-w-[200px] uppercase tracking-widest">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Curating...
                          </>
                        ) : "Reveal Aesthetic"}
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
