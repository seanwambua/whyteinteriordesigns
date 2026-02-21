import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-bg")!;

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover brightness-[0.7]"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm text-accent text-xs font-semibold tracking-widest uppercase">
            Luxury Interior Design
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tight text-foreground">
            Elegance Defined, <br />
            <span className="text-accent">Spaces Transformed</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            Whyte Interiors crafts bespoke residential and commercial environments that reflect your unique story through sophisticated design and unparalleled craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8">
              <Link href="#portfolio">View Our Portfolio</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 text-lg px-8">
              <Link href="#quiz" className="flex items-center gap-2">
                Discover Your Style <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
