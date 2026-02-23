
"use client";

import { use, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWhyteStore, ClientProject, AuditAllocation, FinancialAudit } from "@/store/use-whyte-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Loader2, 
  Scale, 
  Banknote, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Info,
  ExternalLink,
  Lock,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function StewardAuditWorkbench({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clientProjects, updateClientProject, financialSteward } = useWhyteStore();
  const { toast } = useToast();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const project = clientProjects.find(p => p.id === id);

  const [allocations, setAllocations] = useState<AuditAllocation[]>([]);
  const [stewardComments, setStewardComments] = useState("");
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    if (project) {
      // Initialize with existing audit if available
      const existing = project.auditDetails || project.termination?.audit;
      if (existing) {
        setAllocations(existing.allocations || []);
        setStewardComments(existing.stewardComments || "");
        setRefundAmount(existing.refundAmount || 0);
      }
    }
  }, [project]);

  const totalPaidByClient = useMemo(() => {
    if (!project) return 0;
    return project.installments.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  }, [project]);

  const totalAllocated = useMemo(() => {
    return allocations.reduce((sum, a) => sum + a.amount, 0);
  }, [allocations]);

  const remainingBalance = totalPaidByClient - totalAllocated - refundAmount;

  if (!isMounted || !project) return null;

  const isVerified = project.financialReportStatus === 'Verified';

  const handleAddAllocation = () => {
    if (isVerified) return;
    const newAlloc: AuditAllocation = {
      id: `AL-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      category: "",
      amount: 0,
      description: ""
    };
    setAllocations([...allocations, newAlloc]);
  };

  const updateAllocation = (id: string, field: keyof AuditAllocation, value: any) => {
    if (isVerified) return;
    setAllocations(allocations.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAllocation = (id: string) => {
    if (isVerified) return;
    setAllocations(allocations.filter(a => a.id !== id));
  };

  const handleAuthorizeAudit = () => {
    if (isVerified) return;
    setIsSubmitting(true);
    
    const finalAudit: FinancialAudit = {
      totalReceived: totalPaidByClient,
      allocations,
      refundAmount,
      stewardComments,
      isVerified: true,
      submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setTimeout(() => {
      updateClientProject(project.id, {
        financialReportStatus: 'Verified',
        auditDetails: finalAudit,
        lastActivity: `Financial Audit Verified by ${financialSteward}`
      });
      setIsSubmitting(false);
      toast({ title: "Audit Synchronized", description: "Dossier has been locked and authorized." });
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <Link href="/steward" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Back to Terminal Registry</span>
        </Link>

        {isVerified && (
          <div className="p-6 bg-green-50 border border-green-200 flex items-center gap-4">
            <Lock className="h-5 w-5 text-green-600" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-green-600">Audit Verified — Read-Only Mode</p>
              <p className="text-[12px] text-green-600/70 italic font-light">This dossier has been Reconciliation-Locked by Stewardship Protocol.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Scale className="h-5 w-5 text-slate-900" />
              <span className="text-slate-900 text-[12px] font-bold uppercase tracking-[0.4em]">Stewardship Workbench</span>
            </div>
            <h1 className="text-5xl font-headline italic">{project.project}</h1>
            <div className="flex items-center gap-6 text-[12px] text-slate-400 uppercase tracking-widest font-bold">
              <span>Ref: {project.id}</span>
              <div className="h-1 w-1 bg-slate-200 rounded-full" />
              <span>Client: {project.name}</span>
            </div>
          </div>
          <Badge className={cn(
            "rounded-none uppercase tracking-[0.3em] text-[11px] font-bold py-2 px-6",
            isVerified ? "bg-green-600 text-white" : "bg-slate-900 text-white"
          )}>
            {isVerified ? "PROTOCOL VERIFIED" : "PENDING AUTHORIZATION"}
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Audit Section */}
        <div className="lg:col-span-2 space-y-12">
          {/* Capital Summary */}
          <Card className="rounded-none border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="bg-slate-50 px-10 py-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                <Banknote className="h-4 w-4" /> Capital Summary
              </h3>
              <Badge variant="outline" className="rounded-none text-[10px] uppercase border-slate-200">Verified Payments</Badge>
            </div>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Commitment</p>
                  <p className="text-3xl font-headline italic text-slate-900">KES {project.totalBudget.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Funds Received (To Date)</p>
                  <p className="text-3xl font-headline italic text-green-600">KES {totalPaidByClient.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <span>Liquidation Progress</span>
                  <span>{Math.round((totalPaidByClient / project.totalBudget) * 100)}%</span>
                </div>
                <Progress value={(totalPaidByClient / project.totalBudget) * 100} className="h-1 bg-slate-100" />
              </div>
            </CardContent>
          </Card>

          {/* Allocation Breakdown */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
                <h2 className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-900">Site Cost Allocations</h2>
              </div>
              {!isVerified && (
                <Button onClick={handleAddAllocation} variant="outline" size="sm" className="rounded-none border-slate-200 uppercase tracking-widest text-[10px] font-bold gap-2">
                  <Plus className="h-3.5 w-3.5" /> Log Allocation
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {allocations.map((alloc, idx) => (
                <motion.div key={alloc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="rounded-none border-slate-200 bg-white group relative">
                    {!isVerified && (
                      <Button 
                        onClick={() => removeAllocation(alloc.id)}
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 h-8 w-8 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Classification</Label>
                          <Input 
                            value={alloc.category} 
                            onChange={(e) => updateAllocation(alloc.id, 'category', e.target.value)}
                            readOnly={isVerified}
                            placeholder="E.g., Structural Materials" 
                            className="rounded-none h-12 text-sm font-bold uppercase tracking-widest border-slate-100"
                          />
                        </div>
                        <div className="md:col-span-5 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Professional Breakdown</Label>
                          <Input 
                            value={alloc.description} 
                            onChange={(e) => updateAllocation(alloc.id, 'description', e.target.value)}
                            readOnly={isVerified}
                            placeholder="Specific site protocol description" 
                            className="rounded-none h-12 text-sm italic border-slate-100"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">Verified Amount (KES)</Label>
                          <Input 
                            type="number"
                            value={alloc.amount} 
                            onChange={(e) => updateAllocation(alloc.id, 'amount', Number(e.target.value))}
                            readOnly={isVerified}
                            className="rounded-none h-12 text-sm font-bold border-slate-100"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {allocations.length === 0 && (
                <div className="py-20 text-center border border-dashed border-slate-200 bg-slate-50">
                  <p className="text-[11px] uppercase tracking-widest text-slate-400 italic">No site cost allocations currently synchronized</p>
                </div>
              )}
            </div>
          </div>

          {/* Steward Comments */}
          <div className="space-y-4">
            <Label className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900">Stewardship findings & resolution</Label>
            <Textarea 
              value={stewardComments} 
              onChange={(e) => setStewardComments(e.target.value)}
              readOnly={isVerified}
              placeholder="Provide a professional summary of the financial audit and any capital reconciliation findings..." 
              className="min-h-[180px] rounded-none border-slate-200 p-8 font-light italic text-lg leading-relaxed focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Sidebar Summary & Action */}
        <div className="space-y-8">
          <Card className="rounded-none border-slate-900 bg-slate-900 text-white p-10 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Scale className="h-40 w-40" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 relative z-10">Reconciliation Logic</h3>
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Cumulative Funds</p>
                <p className="text-3xl font-headline italic text-green-400">KES {totalPaidByClient.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Verified Site Costs</p>
                <p className="text-3xl font-headline italic text-orange-400">KES {totalAllocated.toLocaleString()}</p>
              </div>
              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Authorized Refund</p>
                  <Input 
                    type="number" 
                    value={refundAmount} 
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    readOnly={isVerified}
                    className="bg-white/5 border-white/10 text-2xl font-headline italic text-white rounded-none h-14"
                  />
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">Escrow Balance</span>
                  <span className={cn(
                    "text-xl font-headline italic",
                    remainingBalance < 0 ? "text-red-400" : "text-white"
                  )}>KES {remainingBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {!isVerified && (
              <Button 
                onClick={handleAuthorizeAudit}
                disabled={isSubmitting || totalPaidByClient === 0}
                className="w-full h-16 bg-white text-slate-900 hover:bg-slate-100 rounded-none uppercase tracking-widest text-[11px] font-bold shadow-xl transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3"><Loader2 className="h-4 w-4 animate-spin" /> Authorizing...</span>
                ) : (
                  <><ShieldCheck className="h-4 w-4" /> Authorize Final Audit</>
                )}
              </Button>
            )}
          </Card>

          <div className="p-8 border border-dashed border-slate-200 bg-slate-50 text-center space-y-6">
            <div className="flex justify-center"><AlertCircle className="h-6 w-6 text-slate-300" /></div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 leading-relaxed italic">
              Verification locks this dossier. All allocations must be supported by site protocol documentation within the studio registry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
