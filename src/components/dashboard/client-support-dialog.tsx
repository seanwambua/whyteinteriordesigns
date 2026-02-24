
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
import { Send, Loader2, LifeBuoy, AlertTriangle, XCircle, RefreshCcw } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useWhyteStore, Inquiry } from "@/store/use-whyte-store";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  projectId: z.string().min(1, { message: "Please select a dossier." }),
  type: z.enum(["project_support", "complaint", "termination_request", "financial_reorganization"], {
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
  defaultType?: "project_support" | "complaint" | "termination_request" | "financial_reorganization";
}

export function ClientSupportDialog({
  isOpen,
  onClose,
  projectId,
  defaultType = "project_support",
}: ClientSupportDialogProps) {
  const { toast } = useToast();
  const { addInquiry, clientProjects, updateClientProject } = useWhyteStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find all projects for this user identity to allow multi-project inquiry
  const userProjects = useMemo(() => {
    const active = clientProjects.find(p => p.id === projectId);
    if (!active) return [];
    return clientProjects.filter(p => p.email.toLowerCase() === active.email.toLowerCase() && !p.isArchived);
  }, [clientProjects, projectId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: projectId,
      type: defaultType,
      subject: "",
      message: "",
      acknowledgeTermination: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        projectId: projectId,
        type: defaultType,
        subject: "",
        message: "",
        acknowledgeTermination: false,
      });
    }
  }, [isOpen, defaultType, projectId, form]);

  const requestType = form.watch("type");

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const selectedProject = clientProjects.find(p => p.id === values.projectId);
    
    const newInquiry: Inquiry = {
      id: `INQ-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name: selectedProject?.name || "Client Portal User",
      email: selectedProject?.email || "portal@client.com",
      type: values.type as any,
      serviceType: 'bundle',
      message: `[${values.subject}] ${values.message}`,
      status: 'new',
      urgency: values.type === 'termination_request' || values.type === 'financial_reorganization' ? 'critical' : values.type === 'complaint' ? 'high' : 'normal',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      projectId: values.projectId
    };

    setTimeout(() => {
      addInquiry(newInquiry);
      
      let title = "Request Transmitted";
      let description = "Your request has been logged in the project archives.";

      if (values.type === 'complaint') {
        description = "Our project managers have been alerted to your concern. High-urgency response protocols initiated.";
      } else if (values.type === 'termination_request') {
        title = "Termination Protocol Initiated";
        description = "Your request to terminate Project " + values.projectId + " has been received. A senior partner will contact you.";
      } else if (values.type === 'financial_reorganization') {
        title = "Reorganization Requested";
        description = "Your formal request for financing review has been transmitted.";
        
        if (selectedProject) {
          updateClientProject(selectedProject.id, {
            reorganization: {
              status: 'Requested',
              requestedBy: 'Client',
              terms: values.message,
              proposedInstallments: [],
              clientAgreed: false,
              stewardWitnessed: false
            }
          });
        }
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
            ) : requestType === 'financial_reorganization' ? (
              <RefreshCcw className="h-4 w-4 text-orange-600" />
            ) : (
              <LifeBuoy className="h-4 w-4 text-accent/40" />
            )}
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.3em]",
              requestType === 'termination_request' ? 'text-destructive' : 
              requestType === 'financial_reorganization' ? 'text-orange-600' : 
              'text-accent'
            )}>
              {requestType === 'termination_request' ? 'Contract Dissolution' : 
               requestType === 'financial_reorganization' ? 'Financing Review' : 
               'Studio Direct Line'}
            </span>
          </div>
          <DialogTitle className="text-3xl font-headline italic">
            {requestType === 'termination_request' ? 'Project Termination' : 
             requestType === 'financial_reorganization' ? 'Financing Re-organization' : 
             'Project Support'}
          </DialogTitle>
          <DialogDescription className="font-light text-muted-foreground italic">
            Portfolio Synchronization Mode — Nairobi Studio HQ
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest opacity-70 font-bold">Target Dossier</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none border-accent/20 h-12 focus:ring-accent">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none">
                        {userProjects.map(p => (
                          <SelectItem key={p.id} value={p.id} className="text-xs uppercase tracking-widest font-bold">
                            {p.id} — {p.project}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest opacity-70 font-bold">Nature of Request</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none border-accent/20 h-12 focus:ring-accent">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none">
                        <SelectItem value="project_support">General Studio Inquiry</SelectItem>
                        <SelectItem value="complaint">Site Issue / Urgent Concern</SelectItem>
                        <SelectItem value="financial_reorganization">Financing Re-organization</SelectItem>
                        <SelectItem value="termination_request" className="text-destructive">Project Termination</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest opacity-70 font-bold">Subject</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-accent/20 h-12 focus:ring-accent" {...field} />
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
                  <FormLabel className="text-xs uppercase tracking-widest opacity-70 font-bold">Details & Rationale</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px] rounded-none border-accent/20 focus:ring-accent resize-none bg-transparent" {...field} />
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="rounded-none border-destructive/20 data-[state=checked]:bg-destructive" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-destructive">Acknowledge Dissolution Terms</FormLabel>
                      <ShFormDescription className="text-[9px] italic text-destructive/60">This initiates a formal review of my design contract.</ShFormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={cn(
                "w-full text-white rounded-none h-14 uppercase tracking-[0.2em] transition-all",
                requestType === 'termination_request' ? 'bg-destructive' : 
                requestType === 'financial_reorganization' ? 'bg-orange-600' : 
                'bg-accent'
              )}
            >
              {isSubmitting ? "Transmitting..." : "Send to Studio"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
