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
import { Star, Send } from "lucide-react";
import { motion } from "framer-motion";
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
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 5,
      comment: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate feedback submission
    console.log("Feedback submitted:", values);
    toast({
      title: "Feedback Received",
      description: "Thank you for helping us refine the Whyte experience.",
    });
    form.reset();
    setRating(5);
  }

  return (
    <section id="feedback" className="py-32 bg-secondary/10">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent text-sm font-bold uppercase tracking-[0.3em]">Client Voice</span>
              <div className="h-px w-12 bg-accent" />
            </motion.div>
            <h2 className="text-5xl font-headline mb-6">Refining <span className="italic">Excellence.</span></h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Your experience is the cornerstone of our evolution. We invite you to share your thoughts on our journey together.
            </p>
          </div>

          <div className="bg-white p-12 shadow-2xl border border-accent/5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest opacity-70">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" className="rounded-none border-accent/20 h-12 focus:ring-accent" {...field} />
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
                        <FormLabel className="text-xs uppercase tracking-widest opacity-70">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="email@address.com" className="rounded-none border-accent/20 h-12 focus:ring-accent" {...field} />
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
                      <FormLabel className="text-xs uppercase tracking-widest opacity-70">Experience Rating</FormLabel>
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
                      <FormLabel className="text-xs uppercase tracking-widest opacity-70">Your Experience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your thoughts on the collaboration, design process, or final delivery..." 
                          className="min-h-[150px] rounded-none border-accent/20 focus:ring-accent resize-none" 
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
          </div>
        </div>
      </div>
    </section>
  );
}
