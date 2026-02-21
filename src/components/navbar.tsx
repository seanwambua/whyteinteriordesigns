
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Palette, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Style Quiz", href: "#quiz" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Palette className="h-8 w-8 text-accent transition-transform group-hover:rotate-12" />
          <span className="text-2xl font-headline font-bold tracking-tighter text-accent">
            WHYTE <span className="font-light text-muted-foreground">INTERIORS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Button asChild variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#contact">Book Consultation</Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-12">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild className="mt-4" onClick={() => setIsOpen(false)}>
                  <Link href="#contact">Book Consultation</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
