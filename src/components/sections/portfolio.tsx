import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export function Portfolio() {
  const projects = [
    {
      id: "portfolio-1",
      title: "The Lavender Suite",
      category: "Residential",
      location: "Upper East Side",
    },
    {
      id: "portfolio-2",
      title: "Executive Loft",
      category: "Commercial",
      location: "Financial District",
    },
    {
      id: "portfolio-3",
      title: "Marble Haven",
      category: "Residential",
      location: "Chelsea",
    },
    {
      id: "portfolio-4",
      title: "Vanguard Lobby",
      category: "Commercial",
      location: "Midtown",
    },
  ];

  return (
    <section id="portfolio" className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl space-y-4">
            <h2 className="text-4xl font-headline font-bold text-foreground">Featured Portfolio</h2>
            <div className="h-1 w-20 bg-accent" />
            <p className="text-muted-foreground text-lg">
              Explore our latest transformations. From high-end residences to modern commercial spaces, our work defines contemporary luxury.
            </p>
          </div>
          <div className="flex gap-4">
            <Badge variant="outline" className="text-accent border-accent px-4 py-1 text-sm cursor-pointer hover:bg-accent hover:text-white transition-colors">All Projects</Badge>
            <Badge variant="ghost" className="text-muted-foreground px-4 py-1 text-sm cursor-pointer hover:text-accent">Residential</Badge>
            <Badge variant="ghost" className="text-muted-foreground px-4 py-1 text-sm cursor-pointer hover:text-accent">Commercial</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const imageData = PlaceHolderImages.find(img => img.id === project.id)!;
            return (
              <div key={project.id} className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer">
                <Image
                  src={imageData.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  data-ai-hint={imageData.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                  <span className="text-sm font-medium text-primary mb-2 uppercase tracking-widest">{project.category}</span>
                  <h3 className="text-3xl font-headline font-bold mb-1">{project.title}</h3>
                  <p className="text-white/80">{project.location}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
