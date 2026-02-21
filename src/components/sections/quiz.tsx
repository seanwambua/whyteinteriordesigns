
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { styleQuizRecommendation, type StyleQuizRecommendationOutput } from "@/ai/flows/style-quiz-recommendation";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export function StyleQuiz() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StyleQuizRecommendationOutput | null>(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    roomType: "Living Room",
    colorPalette: "Warm Neutrals",
    furnitureStyles: [] as string[],
    roomAmbiance: "Cozy and Inviting",
    budgetPreference: "Mid-range"
  });

  const furnitureOptions = ["Mid-century Modern", "Minimalist", "Bohemian", "Industrial", "Art Deco", "Scandi"];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recommendation = await styleQuizRecommendation(formData);
      setResult(recommendation);
    } catch (error) {
      console.error("Quiz failed", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFurniture = (style: string) => {
    setFormData(prev => ({
      ...prev,
      furnitureStyles: prev.furnitureStyles.includes(style)
        ? prev.furnitureStyles.filter(s => s !== style)
        : [...prev.furnitureStyles, style]
    }));
  };

  if (result) {
    return (
      <section id="quiz" className="py-24 bg-primary/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-none shadow-2xl overflow-hidden bg-white">
            <div className="bg-accent p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-headline font-bold">Your Style: {result.designStyleName}</h2>
                <p className="text-white/80">Tailored recommendation by Whyte Interiors AI</p>
              </div>
              <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent border-b pb-2">Style Overview</h3>
                <p className="text-muted-foreground leading-relaxed italic">"{result.summary}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent" /> Key Elements
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {result.keyElements.map((el, i) => <li key={i}>{el}</li>)}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent" /> Color Scheme
                  </h3>
                  <p className="text-muted-foreground">{result.colorScheme}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Recommended Furniture & Decor</h3>
                <div className="flex flex-wrap gap-2">
                  {result.furnitureSuggestions.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary text-accent rounded-full text-sm font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-accent/5 rounded-xl space-y-4">
                <h3 className="text-lg font-bold text-accent">Whyte Interiors Fit</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {result.whyteInteriorsServiceFit.map((service, i) => (
                    <div key={i} className="p-4 bg-white border border-accent/20 rounded-lg text-center font-medium shadow-sm">
                      {service}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-center text-muted-foreground pt-4">
                  Ready to transform your space? Use these results to get a custom quote.
                </p>
              </div>

              <div className="flex justify-center pt-6">
                <Button onClick={() => {setResult(null); setStep(1);}} variant="outline" className="mr-4">Retake Quiz</Button>
                <Button asChild className="bg-accent hover:bg-accent/90">
                  <a href="#contact">Get a Personalized Quote</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-4xl font-headline font-bold">Discover Your Interior Style</h2>
          <p className="text-muted-foreground">
            Take our quick interactive quiz to uncover your unique aesthetic and receive a tailored design proposal from our team.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto border-none shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Step {step} of 4</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1 w-8 rounded-full ${step >= i ? 'bg-accent' : 'bg-muted'}`} />
                ))}
              </div>
            </div>
            <CardTitle className="text-2xl">
              {step === 1 && "Which room are we designing?"}
              {step === 2 && "Pick your preferred mood & color"}
              {step === 3 && "Select furniture styles you love"}
              {step === 4 && "Final details"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Every space has a different energy. Tell us where to focus."}
              {step === 2 && "Color defines the personality of your home."}
              {step === 3 && "Choose at least one style that speaks to you."}
              {step === 4 && "Help us tailor the experience to your needs."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <RadioGroup value={formData.roomType} onValueChange={(v) => setFormData({...formData, roomType: v})} className="grid grid-cols-2 gap-4">
                  {["Living Room", "Bedroom", "Home Office", "Dining Room", "Commercial Space", "Other"].map(opt => (
                    <Label key={opt} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-primary/5 transition-colors ${formData.roomType === opt ? 'border-accent bg-accent/5 ring-1 ring-accent' : ''}`}>
                      <span>{opt}</span>
                      <RadioGroupItem value={opt} className="sr-only" />
                    </Label>
                  ))}
                </RadioGroup>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Preferred Color Palette</Label>
                    <RadioGroup value={formData.colorPalette} onValueChange={(v) => setFormData({...formData, colorPalette: v})} className="grid gap-3">
                      {["Warm Neutrals", "Bold and Vibrant", "Monochromatic Blues", "Deep Forest Greens", "Soft Pastels"].map(opt => (
                        <Label key={opt} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-primary/5 ${formData.colorPalette === opt ? 'border-accent bg-accent/5' : ''}`}>
                          <RadioGroupItem value={opt} />
                          <span>{opt}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-3">
                    <Label>Desired Ambiance</Label>
                    <RadioGroup value={formData.roomAmbiance} onValueChange={(v) => setFormData({...formData, roomAmbiance: v})} className="grid gap-3">
                      {["Cozy and Inviting", "Sleek and Professional", "Bright and Airy", "Dramatic and Moody"].map(opt => (
                        <Label key={opt} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-primary/5 ${formData.roomAmbiance === opt ? 'border-accent bg-accent/5' : ''}`}>
                          <RadioGroupItem value={opt} />
                          <span>{opt}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-4">
                  {furnitureOptions.map(style => (
                    <div key={style} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-primary/5 transition-colors ${formData.furnitureStyles.includes(style) ? 'border-accent bg-accent/5 ring-1 ring-accent' : ''}`} onClick={() => toggleFurniture(style)}>
                      <Checkbox checked={formData.furnitureStyles.includes(style)} className="data-[state=checked]:bg-accent" />
                      <span className="text-sm font-medium">{style}</span>
                    </div>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Budget Preference</Label>
                    <RadioGroup value={formData.budgetPreference} onValueChange={(v) => setFormData({...formData, budgetPreference: v})} className="flex flex-col gap-3">
                      {["Luxury", "Mid-range", "Budget-conscious"].map(opt => (
                        <Label key={opt} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-primary/5 ${formData.budgetPreference === opt ? 'border-accent bg-accent/5' : ''}`}>
                          <RadioGroupItem value={opt} />
                          <span>{opt}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="pt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-accent shrink-0" />
                    Our AI will now analyze your taste and match it with Whyte Interiors' signature design patterns.
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                {step > 1 ? (
                  <Button type="button" variant="ghost" onClick={handleBack}>Back</Button>
                ) : <div />}
                
                {step < 4 ? (
                  <Button type="button" onClick={handleNext} disabled={step === 3 && formData.furnitureStyles.length === 0} className="bg-accent hover:bg-accent/90">Next Step</Button>
                ) : (
                  <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90 min-w-[140px]">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : "Generate Result"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
