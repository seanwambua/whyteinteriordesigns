"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="group">
              <span className="text-lg font-headline font-bold tracking-tight text-white uppercase">
                Whyte Interior Designs
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Redefining luxury through thoughtful, personalized design for high-end residential and commercial spaces.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">The Firm</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/#services" className="hover:text-primary transition-colors">Our Method</Link></li>
              <li><Link href="/#portfolio" className="hover:text-primary transition-colors">The Collection</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Investment</Link></li>
              <li><Link href="/feedback" className="hover:text-primary transition-colors">Client Voice</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Services</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/services/interior-design" className="hover:text-primary transition-colors">Interior Design</Link></li>
              <li><Link href="/services/interior-decor" className="hover:text-primary transition-colors">Interior Decor</Link></li>
              <li>Bespoke Curation</li>
              <li>Commercial Projects</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Connect</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/#contact" className="hover:text-primary transition-colors">Book Consultation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Instagram</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pinterest</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/40 uppercase tracking-widest font-medium">
          <p>© {new Date().getFullYear()} Whyte Interior Designs. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
