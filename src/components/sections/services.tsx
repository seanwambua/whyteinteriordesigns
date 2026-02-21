import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Sparkles, Hammer, MessageSquare } from "lucide-react";

export function Services() {
  const services = [
    {
      title: "Design Consultancy",
      description: "Expert guidance on layouts, color palettes, and material selection to bring your vision to life with professional precision.",
      icon: <MessageSquare className="h-6 w-6 text-accent" />,
      image: PlaceHolderImages.find(img => img.id === "service-consultancy")!,
    },
    {
      title: "Design & Build",
      description: "A comprehensive turnkey solution from conceptual sketches to the final brushstroke, ensuring a seamless transformation.",
      icon: <Hammer className="h-6 w-6 text-accent" />,
      image: PlaceHolderImages.find(img => img.id === "service-build")!,
    },
    {
      title: "Refresh Services",
      description: "Elevate your existing space with curated decor, strategic lighting, and art selection for an instant luxury update.",
      icon: <Sparkles className="h-6 w-6 text-accent" />,
      image: PlaceHolderImages.find(img => img.id === "service-refresh")!,
    },
  ];

  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl font-headline font-bold text-foreground">Our Expertise</h2>
          <div className="h-1 w-20 bg-accent mx-auto" />
          <p className="text-muted-foreground text-lg">
            Whether it's a private sanctuary or a dynamic commercial hub, we provide tailored services to meet the highest standards of interior excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image.imageUrl}
                  alt={service.image.description}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint={service.image.imageHint}
                />
              </div>
              <CardHeader className="pt-6">
                <div className="p-3 bg-primary/20 w-fit rounded-lg mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl font-headline mb-2">{service.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
