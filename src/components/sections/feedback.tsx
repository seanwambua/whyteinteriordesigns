"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, Share2, Twitter, Facebook, Linkedin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Valid email required." }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, { message: "Please provide more detailed feedback." }),
});

export function Feedback() {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 5,
      comment: "",
    },
  });

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.origin + '/feedback';
  };

  const handleShare = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Direct link to the feedback page copied.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent("Just shared my experience with Whyte Interior Designs. Timeless sophistication in Nairobi.");
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Feedback submitted:", values);
    setSubmitted(true);
    toast({
      title: "Feedback Received",
      description: "Thank you for helping us refine the Whyte experience.",
    });
  }

  return (
    <div id="feedback" className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShare}
          className="group flex items-center gap-2 text-accent/70 hover:text-accent hover:bg-accent/5 px-6 py-2 transition-all duration-300 uppercase tracking-widest text-[10px] font-bold border border-transparent hover:border-accent/20 rounded-none h-12"
        >
          {copied ? <Check className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}
          {copied ? "Copied" : "Share Feedback Page"}
        </Button>
      </div>

      <div className="bg-white shadow-2xl border border-accent/5 relative">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-12"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest opacity-70 font-bold">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" className="rounded-none border-accent/20 h-12 focus:ring-accent bg-transparent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest opacity-70 font-bold">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="email@address.com" className="rounded-none border-accent/20 h-12 focus:ring-accent bg-transparent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest opacity-70 font-bold">Experience Rating</FormLabel>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setRating(s);
                                form.setValue("rating", s);
                              }}
                              className="transition-transform hover:scale-110 focus:outline-none"
                            >
                              <Star 
                                className={`h-6 w-6 ${s <= rating ? 'fill-accent text-accent' : 'text-accent/20'}`} 
                              />
                            </button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest opacity-70 font-bold">Your Experience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your thoughts on the collaboration, design process, or final delivery..." 
                            className="min-h-[150px] rounded-none border-accent/20 focus:ring-accent resize-none bg-transparent" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-white hover:bg-accent/90 rounded-none h-14 uppercase tracking-[0.2em] transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" /> Submit Feedback
                    </span>
                  </Button>
                </form>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-20 text-center"
            >
              <div className="h-20 w-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-3xl font-headline mb-4">A Sincere <span className="italic">Thank You.</span></h3>
              <p className="text-muted-foreground font-light mb-12 max-w-sm mx-auto leading-relaxed">
                Your insights help us maintain the uncompromising standards of Whyte Interior Designs.
              </p>
              
              <div className="space-y-6 pt-8 border-t border-accent/10">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">Share Your Experience</p>
                <div className="flex justify-center gap-6">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => shareToSocial('twitter')}
                    className="rounded-full h-12 w-12 border-accent/20 hover:bg-accent hover:text-white transition-all"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => shareToSocial('facebook')}
                    className="rounded-full h-12 w-12 border-accent/20 hover:bg-accent hover:text-white transition-all"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => shareToSocial('linkedin')}
                    className="rounded-full h-12 w-12 border-accent/20 hover:bg-accent hover:text-white transition-all"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
                className="mt-12 text-accent text-xs uppercase tracking-widest font-bold hover:bg-transparent hover:opacity-70"
              >
                Submit Another Review
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
