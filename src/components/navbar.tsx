
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Investment", href: "/pricing" },
    { name: "Style Quiz", href: "/#quiz" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="group">
          <span className="text-lg font-headline font-bold tracking-[0.1em] text-accent uppercase">
            Whyte Interior Designs
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Button asChild variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-none h-10 px-6 uppercase tracking-widest text-[10px]">
            <Link href="/#contact">Book Consultation</Link>
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
                    className="text-lg font-medium uppercase tracking-widest"
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild className="mt-4 rounded-none uppercase tracking-widest text-xs" onClick={() => setIsOpen(false)}>
                  <Link href="/#contact">Book Consultation</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
