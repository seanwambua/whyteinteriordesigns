"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useWhyteStore } from "@/store/use-whyte-store";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  serviceType: z.enum(["design", "decor", "bundle"], {
    required_error: "Please select a service type.",
  }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

interface ServiceInquiryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: "design" | "decor" | "bundle";
}

export function ServiceInquiryDialog({
  isOpen,
  onClose,
  defaultService = "design",
}: ServiceInquiryDialogProps) {
  const { toast } = useToast();
  const { currentQuizResult } = useWhyteStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      serviceType: defaultService,
      message: "",
    },
  });

  // Update default value when dialog opens or defaultService changes
  useEffect(() => {
    if (isOpen) {
      const initialValues: Partial<z.infer<typeof formSchema>> = {
        serviceType: defaultService,
      };

      if (currentQuizResult) {
        initialValues.message = `[DECRYPTED AESTHETIC DNA]
Style Profile: ${currentQuizResult.designStyleName}
Summary: ${currentQuizResult.summary}
Technical Pillars: ${currentQuizResult.keyElements.join(', ')}
Palette Protocol: ${currentQuizResult.colorScheme}

[CLIENT OBJECTIVES]: 
`;
        initialValues.serviceType = 'bundle'; // DNA-led projects usually imply a full transformation
      }

      form.reset({
        ...form.getValues(),
        ...initialValues,
      });
    }
  }, [isOpen, defaultService, form, currentQuizResult]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Inquiry submitted:", values);
      toast({
        title: "Inquiry Received",
        description: "A design consultant will contact you within 24 hours to discuss your project.",
      });
      setIsSubmitting(false);
      form.reset();
      onClose();
    }, 1500);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-none border-accent/20">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-accent" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Direct Engagement</span>
          </div>
          <DialogTitle className="text-3xl font-headline italic">Service Inquiry</DialogTitle>
          <DialogDescription className="font-light text-muted-foreground">
            Please provide details regarding your vision. We prioritize bespoke architectural transformations.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest opacity-70">Project Scope</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-accent/20 h-12 focus:ring-accent">
                        <SelectValue placeholder="Select service category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-accent/20">
                      <SelectItem value="design">Interior Design (Structural)</SelectItem>
                      <SelectItem value="decor">Interior Decor (Curation)</SelectItem>
                      <SelectItem value="bundle">The Full Bundle (Design & Decor)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest opacity-70">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Name" className="rounded-none border-accent/20 h-12 focus:ring-accent" {...field} />
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
                    <FormLabel className="text-xs uppercase tracking-widest opacity-70">Email</FormLabel>
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest opacity-70">Project Vision</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your space and requirements..." 
                      className="min-h-[120px] rounded-none border-accent/20 focus:ring-accent resize-none shadow-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-accent text-white hover:bg-accent/90 rounded-none h-14 uppercase tracking-[0.2em] transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> Submit Request
                </span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
