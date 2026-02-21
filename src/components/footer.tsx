
import Link from "next/link";
import { Palette } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Palette className="h-6 w-6 text-primary" />
              <span className="text-xl font-headline font-bold tracking-tighter text-white">
                WHYTE <span className="font-light text-primary/80">INTERIORS</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Redefining luxury through thoughtful, personalized design for high-end residential and commercial spaces.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="#services" className="hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link href="#portfolio" className="hover:text-primary transition-colors">Design Portfolio</Link></li>
              <li><Link href="#quiz" className="hover:text-primary transition-colors">Style Quiz</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Get a Quote</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Services</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Consultancy</li>
              <li>Design & Build</li>
              <li>Refresh & Styling</li>
              <li>Commercial Projects</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Legal</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/40 uppercase tracking-widest font-medium">
          <p>© {new Date().getFullYear()} Whyte Interiors. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-primary transition-colors">Pinterest</Link>
            <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
