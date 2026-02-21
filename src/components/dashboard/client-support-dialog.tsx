
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
  FormDescription as ShFormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, LifeBuoy, AlertTriangle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

const formSchema = z.object({
  type: z.enum(["project_support", "complaint", "termination_request"], {
    required_error: "Please select the nature of your request.",
  }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  acknowledgeTermination: z.boolean().optional(),
}).refine((data) => {
  if (data.type === "termination_request" && !data.acknowledgeTermination) {
    return false;
  }
  return true;
}, {
  message: "You must acknowledge the termination terms to proceed.",
  path: ["acknowledgeTermination"],
});

interface ClientSupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  defaultType?: "project_support" | "complaint" | "termination_request";
}

export function ClientSupportDialog({
  isOpen,
  onClose,
  projectId,
  defaultType = "project_support",
}: ClientSupportDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultType,
      subject: "",
      message: "",
      acknowledgeTermination: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        type: defaultType,
        subject: "",
        message: "",
        acknowledgeTermination: false,
      });
    }
  }, [isOpen, defaultType, form]);

  const requestType = form.watch("type");

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call to register inquiry/termination request
    setTimeout(() => {
      console.log("Client support request submitted:", { ...values, projectId });
      
      let title = "Request Transmitted";
      let description = "Your request has been logged in the project archives.";

      if (values.type === 'complaint') {
        description = "Our project managers have been alerted to your concern. We will respond within 4 hours.";
      } else if (values.type === 'termination_request') {
        title = "Termination Protocol Initiated";
        description = "Your request to terminate Project " + projectId + " has been received. A senior partner will contact you for a formal exit interview.";
      }

      toast({
        title,
        description,
        variant: values.type === 'termination_request' ? 'destructive' : 'default',
      });

      setIsSubmitting(false);
      form.reset();
      onClose();
    }, 1500);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-none border-accent/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            {requestType === 'termination_request' ? (
              <XCircle className="h-4 w-4 text-destructive" />
            ) : (
              <LifeBuoy className="h-4 w-4 text-accent/40" />
            )}
            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${requestType === 'termination_request' ? 'text-destructive' : 'text-accent'}`}>
              {requestType === 'termination_request' ? 'Contract Dissolution' : 'Studio Direct Line'}
            </span>
          </div>
          <DialogTitle className="text-3xl font-headline italic">
            {requestType === 'termination_request' ? 'Project Termination' : 'Project Support'}
          </DialogTitle>
          <DialogDescription className="font-light text-muted-foreground italic">
            Reference ID: {projectId} — All communications are logged for architectural auditing.
          </DialogDescription>
        </DialogHeader>

        {requestType === 'termination_request' && (
          <div className="p-4 bg-destructive/5 border border-destructive/20 mb-4">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-xs font-bold text-destructive uppercase tracking-widest">Notice of Impasse</p>
                <p className="text-[10px] text-destructive/80 leading-relaxed italic">
                  Termination requests signify an unresolvable impasse. Please note that initiated procurement, custom fabrication, and site mobilization costs are subject to the terms in Section 4.2 of your Whyte Interiors contract.
                </p>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest opacity-70">Nature of Request</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-accent/20 h-12 focus:ring-accent">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-accent/20">
                      <SelectItem value="project_support">General Studio Inquiry</SelectItem>
                      <SelectItem value="complaint">Site Issue / Urgent Concern</SelectItem>
                      <SelectItem value="termination_request" className="text-destructive focus:text-destructive">Project Termination Request</SelectItem>
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
                    <Input 
                      placeholder={requestType === 'termination_request' ? "Formal Request for Termination" : "E.g., Update on foyer lighting"} 
                      className="rounded-none border-accent/20 h-12 focus:ring-accent" 
                      {...field} 
                    />
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
                  <FormLabel className="text-xs uppercase tracking-widest opacity-70">
                    {requestType === 'termination_request' ? 'Reason for Termination' : 'Details'}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={requestType === 'termination_request' ? "Please state the reasons for contract dissolution..." : "Please provide specifics for the design team..."}
                      className="min-h-[120px] rounded-none border-accent/20 focus:ring-accent resize-none bg-transparent" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {requestType === 'termination_request' && (
              <FormField
                control={form.control}
                name="acknowledgeTermination"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-destructive/10 bg-destructive/5">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded-none border-destructive/20 data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-destructive">
                        Acknowledge Terms
                      </FormLabel>
                      <ShFormDescription className="text-[9px] italic text-destructive/60">
                        I acknowledge that this initiates a formal review of my design contract and that a senior partner will coordinate the exit audit.
                      </ShFormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full text-white rounded-none h-14 uppercase tracking-[0.2em] transition-all ${
                requestType === 'termination_request' 
                  ? 'bg-destructive hover:bg-destructive/90' 
                  : requestType === 'complaint' 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-accent hover:bg-accent/90'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transmitting...
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> 
                  {requestType === 'termination_request' ? 'Initiate Dissolution' : 'Send to Studio'}
                </span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
