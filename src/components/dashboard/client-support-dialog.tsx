
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
import { Send, Loader2, LifeBuoy } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  type: z.enum(["project_support", "complaint"], {
    required_error: "Please select the nature of your request.",
  }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

interface ClientSupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function ClientSupportDialog({
  isOpen,
  onClose,
  projectId,
}: ClientSupportDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "project_support",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call to register inquiry
    setTimeout(() => {
      console.log("Client support request submitted:", { ...values, projectId });
      toast({
        title: "Request Transmitted",
        description: values.type === 'complaint' 
          ? "Our project managers have been alerted to your concern. We will respond within 4 hours." 
          : "Your design inquiry has been logged in the project archives.",
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
            <LifeBuoy className="h-4 w-4 text-accent/40" />
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Studio Direct Line</span>
          </div>
          <DialogTitle className="text-3xl font-headline italic">Project Support</DialogTitle>
          <DialogDescription className="font-light text-muted-foreground italic">
            Reference ID: {projectId} — All communications are logged in the project archives for architectural auditing.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest opacity-70">Nature of Request</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-accent/20 h-12 focus:ring-accent">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-accent/20">
                      <SelectItem value="project_support">General Studio Inquiry</SelectItem>
                      <SelectItem value="complaint">Site Issue / Urgent Concern</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest opacity-70">Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Update on foyer lighting" className="rounded-none border-accent/20 h-12 focus:ring-accent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest opacity-70">Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide specifics for the design team..." 
                      className="min-h-[120px] rounded-none border-accent/20 focus:ring-accent resize-none bg-transparent" 
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
              className={`w-full text-white rounded-none h-14 uppercase tracking-[0.2em] transition-all ${
                form.watch('type') === 'complaint' ? 'bg-destructive hover:bg-destructive/90' : 'bg-accent hover:bg-accent/90'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transmitting...
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send to Studio
                </span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
