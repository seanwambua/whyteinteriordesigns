"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, User, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
              className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-accent transition-colors"
            >
              {item.name}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-accent/20 mx-2" />
          
          {/* <Link href="/dashboard" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent hover:opacity-70 transition-opacity">
            <User className="h-3 w-3" />
            Client Portal
          </Link> */}

          <Button asChild variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-none h-10 px-6 uppercase tracking-widest text-[10px] font-bold">
            <Link href="/#contact">Book Consultation</Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          {isMounted ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-l border-accent/10 p-0">
                <SheetHeader className="p-8 border-b border-accent/5">
                  <SheetTitle className="text-left text-sm uppercase tracking-[0.3em] font-bold text-accent">Studio Menu</SheetTitle>
                  <SheetDescription className="text-left text-[10px] uppercase tracking-widest opacity-40">Access architectural modules</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-[13px] font-bold uppercase tracking-[0.3em] px-8 py-6 border-b border-accent/5 hover:bg-accent/5"
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="text-[13px] font-bold uppercase tracking-[0.3em] text-accent px-8 py-8 flex items-center gap-3 bg-secondary/30"
                  >
                    <User className="h-4 w-4" /> Client Portal
                  </Link>

                  <div className="p-8 mt-auto">
                    <Button asChild className="w-full rounded-none h-14 uppercase tracking-[0.2em] text-[11px] font-bold shadow-xl" onClick={() => setIsOpen(false)}>
                      <Link href="/#contact">Book Consultation</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
