'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Project {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial';
  location: string;
  imageUrl: string;
  size: 'small' | 'large';
}

export interface Milestone {
  id: string;
  label: string;
  date: string;
  isCompleted: boolean;
  description: string;
}

export interface Installment {
  label: string;
  percentage: number;
  amount: number;
  status: 'Pending' | 'Paid';
  transactionCode?: string;
  date?: string;
}

export interface VendorAllocation {
  id: string;
  vendorName: string;
  role: string;
  category: 'Collaborator' | 'Vendor';
  costType: 'Daily' | 'Percentage' | 'Fixed';
  costValue: number;
  timelineDays: number;
  materials: string[];
}

export interface SiteReport {
  id: string;
  date: string;
  type: 'Progress' | 'Issue' | 'Log';
  content: string;
  urgency: 'Normal' | 'High' | 'Critical';
}

export interface StewardLog {
  id: string;
  date: string;
  type: 'Fiscal Review' | 'Compliance Audit' | 'Procurement Sync' | 'Governance Note';
  content: string;
  urgency: 'Routine' | 'Attention' | 'Flagged';
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assignedVendor?: string;
  subtasks?: SubTask[];
}

export interface AuditAllocation {
  id: string;
  category: string;
  amount: number;
  description: string;
  isVerified?: boolean;
  amendment?: string;
}

export interface AuditIncoming {
  id: string;
  label: string;
  amount: number;
  reference: string;
  date: string;
  isVerified?: boolean;
  amendment?: string;
}

export interface FinancialAudit {
  totalReceived: number;
  incomingFunds?: AuditIncoming[];
  allocations: AuditAllocation[];
  refundAmount: number;
  stewardComments: string;
  isVerified: boolean;
  submissionDate?: string;
}

export interface TerminationDetails {
  reason: string;
  requestedBy: 'Client' | 'Studio';
  requestedDate: string;
  financialSummary: string;
  projectSummary: string;
  resolutionTerms?: string;
  clientAgreed?: boolean;
  studioAgreed?: boolean;
  finalizedDate?: string;
  audit?: FinancialAudit;
}

export interface ReimbursementClaim {
  type: 'Overpayment Return' | 'Site Damage Adjustment' | 'Operational Credit';
  amount: number;
  rationale: string;
}

export interface StudioClaim {
  type: 'Material Procurement' | 'Project Expense' | 'Service Scope Adjustment';
  amount: number;
  rationale: string;
}

export interface ReorganizationDetails {
  status: 'Requested' | 'Pending_Agreement' | 'Authorized' | 'Inactive';
  requestedBy: 'Client' | 'Admin' | 'Designer';
  terms: string;
  proposedInstallments: Installment[];
  clientAgreed: boolean;
  stewardWitnessed: boolean;
  finalizedDate?: string;
  reimbursement?: ReimbursementClaim;
  studioClaim?: StudioClaim;
}

export interface Designer {
  id: string;
  name: string;
  email: string;
  specialty: string;
  role: string;
  experienceLevel: 'Beginner' | 'Professional' | 'Expert';
  accessToken: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinedDate: string;
}

export interface Steward {
  id: string;
  name: string;
  contact: string;
  email: string;
  accessToken: string;
  status: 'Active' | 'Inactive';
  authorizedDate: string;
  totalAudits: number;
}

export interface StudioAccount {
  id: string;
  name: string;
  provider: string;
  type: 'Bank' | 'Mobile Money' | 'Escrow' | 'Treasury';
  balance: number;
  currency: string;
  status: 'Active' | 'Under Audit' | 'Locked';
}

export interface ClientProject {
  id: string;
  name: string;
  email: string;
  project: string;
  tier: 'Premium' | 'Deluxe' | 'Golden';
  status: 'Planning' | 'Execution' | 'Completion' | 'Termination' | 'Terminated';
  progress: number;
  startDate: string;
  endDate: string;
  isExtended?: boolean;
  isArchived?: boolean;
  lastActivity: string;
  financialReportStatus?: 'Verified' | 'Pending' | 'Awaiting Steward' | 'Awaiting Admin';
  isActivated: boolean;
  initialDepositPaid: boolean;
  depositCode?: string;
  totalBudget: number;
  milestones: Milestone[];
  installments: Installment[];
  siteReports?: SiteReport[];
  stewardLogs?: StewardLog[];
  tasks?: ProjectTask[];
  description?: string;
  roomsCount?: number;
  workScope?: string;
  operationalBudget?: number;
  vendorAllocations?: VendorAllocation[];
  termination?: TerminationDetails;
  auditDetails?: FinancialAudit;
  initializedBy?: 'Admin' | 'Designer';
  assignedDesignerId?: string;
  assignedStewardId?: string;
  handoverStatus?: 'Pending' | 'Failed' | 'Passed' | null;
  handoverNotes?: string;
  reorganization?: ReorganizationDetails;
  reorganizationCount?: number;
  pendingActivationData?: {
    amount: number;
    reference: string;
    timestamp: string;
  };
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  type: 'new_business' | 'project_support' | 'complaint' | 'termination_request' | 'financial_reorganization';
  serviceType: 'design' | 'decor' | 'bundle';
  message: string;
  status: 'new' | 'contacted' | 'closed';
  urgency: 'normal' | 'high' | 'critical';
  date: string;
  projectId?: string;
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  date: string;
}

export interface Collaborator {
  id: string;
  name: string;
  category: 'Collaborator' | 'Vendor';
  species?: string;
  specialty: string;
  contact: string;
  email: string;
  rating: number;
  status: 'active' | 'on_hold' | 'blacklisted';
  type: string;
}

export interface BusinessTargets {
  monthlyRevenueGoal: number;
  projectVolumeGoal: number;
  efficiencyTarget: number;
}

export type StyleResult = {
  designStyleName: string;
  summary: string;
  keyElements: string[];
  colorScheme: string;
  furnitureSuggestions: string[];
};

interface WhyteState {
  projects: Project[];
  clientProjects: ClientProject[];
  designers: Designer[];
  stewards: Steward[];
  accounts: StudioAccount[];
  inquiries: Inquiry[];
  feedback: Feedback[];
  collaborators: Collaborator[];
  financialSteward: string;
  businessTargets: BusinessTargets;
  currentQuizResult: StyleResult | null;
  
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  
  addClientProject: (clientProject: ClientProject) => void;
  updateClientProject: (id: string, updates: Partial<ClientProject>) => void;
  removeClientProject: (id: string) => void;

  addDesigner: (designer: Designer) => void;
  updateDesigner: (id: string, updates: Partial<Designer>) => void;
  removeDesigner: (id: string) => void;

  addSteward: (steward: Steward) => void;
  updateSteward: (id: string, updates: Partial<Steward>) => void;
  removeSteward: (id: string) => void;

  addAccount: (account: StudioAccount) => void;
  updateAccount: (id: string, updates: Partial<StudioAccount>) => void;
  removeAccount: (id: string) => void;
  
  addInquiry: (inquiry: Inquiry) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  removeInquiry: (id: string) => void;
  
  addFeedback: (feedback: Feedback) => void;
  approveFeedback: (id: string) => void;
  removeFeedback: (id: string) => void;
  
  addCollaborator: (collaborator: Collaborator) => void;
  removeCollaborator: (id: string) => void;
  
  setFinancialSteward: (steward: string) => void;
  updateBusinessTargets: (targets: Partial<BusinessTargets>) => void;
  setQuizResult: (result: StyleResult | null) => void;
  
  clearAllData: () => void;
}

const initialProjects: Project[] = [
  {
    id: "portfolio-1",
    title: "Serene Sanctuary",
    category: "Residential",
    location: "Upper East Side",
    size: "large",
    imageUrl: "https://picsum.photos/seed/whyte2/800/600",
  },
  {
    id: "portfolio-2",
    title: "The Obsidian Loft",
    category: "Commercial",
    location: "Financial District",
    size: "small",
    imageUrl: "https://picsum.photos/seed/whyte3/800/600",
  }
];

const initialClientProjects: ClientProject[] = [
  {
    id: "WP-0082",
    name: "Jonathan Muthaiga",
    email: "jonathan@muthaiga.com",
    project: "Muthaiga Residence",
    tier: "Golden",
    status: "Execution",
    progress: 78,
    startDate: "Jan 15, 2024",
    endDate: "Jun 30, 2024",
    lastActivity: "Architectural synchronization established.",
    financialReportStatus: 'Awaiting Steward',
    isActivated: true,
    initialDepositPaid: true,
    depositCode: "AUTH-8821",
    totalBudget: 15000000,
    roomsCount: 8,
    workScope: "Full architectural renovation of primary and secondary wings including sustainable material integration.",
    operationalBudget: 2500000,
    milestones: [
      { id: "M-1", label: "Structural Completion", date: "Apr 15, 2024", isCompleted: true, description: "Foundation and framing verified." }
    ],
    installments: [
      { label: "Initial Deposit (70%)", percentage: 70, amount: 10500000, status: 'Paid', transactionCode: "AUTH-8821", date: "Jan 15, 2024" },
      { label: "Final Reconciliation (30%)", percentage: 30, amount: 4500000, status: 'Pending' }
    ],
    tasks: [
      { 
        id: "T-1", 
        title: "Marble Sourcing", 
        status: "Done", 
        priority: "High",
        subtasks: [
          { id: "S-1", title: "Vendor Selection", isCompleted: true },
          { id: "S-2", title: "Quality Inspection", isCompleted: true }
        ]
      },
      { id: "T-2", title: "Site Leveling", status: "Done", priority: "High" },
      { 
        id: "T-3", 
        title: "Joinery Fabrication", 
        status: "In Progress", 
        priority: "Medium",
        subtasks: [
          { id: "S-3", title: "Material Cutting", isCompleted: true },
          { id: "S-4", title: "Initial Assembly", isCompleted: false }
        ]
      },
      { id: "T-4", title: "Lighting Installation", status: "Todo", priority: "Low" }
    ],
    vendorAllocations: [
      {
        id: "V-001",
        vendorName: "Artisanal Woodworks KE",
        category: "Vendor",
        role: "Primary Joinery",
        costType: "Percentage",
        costValue: 12,
        timelineDays: 14,
        materials: ["Sustainably Sourced Teak", "Brass Inlays"]
      }
    ],
    initializedBy: 'Admin',
    assignedDesignerId: 'DES-01',
    assignedStewardId: 'STW-01',
    reorganizationCount: 0
  }
];

const initialDesigners: Designer[] = [
  {
    id: 'DES-01',
    name: 'Elena Vibe',
    email: 'elena@whyte.design',
    specialty: 'Architectural Interior Design',
    role: 'Lead Architect',
    experienceLevel: 'Expert',
    accessToken: 'WHYTE-LEAD-01',
    status: 'Active',
    joinedDate: 'Jan 01, 2023'
  }
];

const initialStewards: Steward[] = [
  {
    id: 'STW-01',
    name: 'Imani Financial Services (IFS-KE)',
    contact: '+254 700 999 888',
    email: 'compliance@imani.co.ke',
    accessToken: 'WHYTE-STEWARD-ALPHA',
    status: 'Active',
    authorizedDate: 'Jan 10, 2024',
    totalAudits: 12
  }
];

const initialAccounts: StudioAccount[] = [
  { id: 'ACC-01', name: 'Primary Operational Account', provider: 'NCBA Bank', type: 'Bank', balance: 42500000, currency: 'KES', status: 'Active' },
  { id: 'ACC-02', name: 'Client Escrow Reserve', provider: 'Standard Chartered', type: 'Escrow', balance: 128000000, currency: 'KES', status: 'Under Audit' },
  { id: 'ACC-03', name: 'Artisanal Procurement Pool', provider: 'M-Pesa Business', type: 'Mobile Money', balance: 4200000, currency: 'KES', status: 'Active' }
];

const initialCollaborators: Collaborator[] = [
  { id: "C-1", name: "Artisanal Woodworks KE", category: 'Vendor', specialty: "Joinery & Custom Fabrication", contact: "+254 700 000 000", email: "info@artisanalwoodworks.co.ke", rating: 4.8, status: 'active', type: 'Local Specialist' },
  { id: "C-2", name: "Nairobi Marble & Tile", category: 'Vendor', specialty: "Stone Masonry", contact: "+254 711 111 111", email: "sales@nairobitile.com", rating: 4.9, status: 'active', type: 'Materials Partner' },
  { id: "C-3", name: "Sarah Studio", category: 'Collaborator', specialty: "Interior Styling", contact: "+254 722 000 000", email: "sarah@sarahstudio.design", rating: 5.0, status: 'active', type: 'Consulting Architect' }
];

export const useWhyteStore = create<WhyteState>()(
  persist(
    (set) => ({
      projects: initialProjects,
      clientProjects: initialClientProjects,
      designers: initialDesigners,
      stewards: initialStewards,
      accounts: initialAccounts,
      inquiries: [],
      feedback: [],
      collaborators: initialCollaborators,
      financialSteward: "Imani Financial Services (IFS-KE)",
      currentQuizResult: null,
      businessTargets: {
        monthlyRevenueGoal: 50000000,
        projectVolumeGoal: 10,
        efficiencyTarget: 95
      },

      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      removeProject: (id) => set((state) => ({ projects: state.projects.filter(p => p.id !== id) })),

      addClientProject: (clientProject) => set((state) => ({ clientProjects: [...state.clientProjects, clientProject] })),
      updateClientProject: (id, updates) => set((state) => ({
        clientProjects: state.clientProjects.map(cp => cp.id === id ? { ...cp, ...updates } : cp)
      })),
      removeClientProject: (id) => set((state) => ({
        clientProjects: state.clientProjects.filter(p => p.id !== id)
      })),

      addDesigner: (designer) => set((state) => ({ designers: [...state.designers, designer] })),
      updateDesigner: (id, updates) => set((state) => ({
        designers: state.designers.map(d => d.id === id ? { ...d, ...updates } : d)
      })),
      removeDesigner: (id) => set((state) => ({
        designers: state.designers.filter(d => d.id !== id)
      })),

      addSteward: (steward) => set((state) => ({ stewards: [...state.stewards, steward] })),
      updateSteward: (id, updates) => set((state) => ({
        stewards: state.stewards.map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      removeSteward: (id) => set((state) => ({
        stewards: state.stewards.filter(s => s.id !== id)
      })),

      addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] })),
      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map(acc => acc.id === id ? { ...acc, ...updates } : acc)
      })),
      removeAccount: (id) => set((state) => ({
        accounts: state.accounts.filter(acc => acc.id !== id)
      })),

      addInquiry: (inquiry) => set((state) => ({ inquiries: [inquiry, ...state.inquiries] })),
      updateInquiryStatus: (id, status) => set((state) => ({
        inquiries: state.inquiries.map(inq => inq.id === id ? { ...inq, status } : inq)
      })),
      removeInquiry: (id) => set((state) => ({
        inquiries: state.inquiries.filter(inq => inq.id !== id)
      })),

      addFeedback: (fb) => set((state) => ({ feedback: [fb, ...state.feedback] })),
      approveFeedback: (id) => set((state) => ({
        feedback: state.feedback.map(fb => fb.id === id ? { ...fb, isApproved: true } : fb)
      })),
      removeFeedback: (id) => set((state) => ({ feedback: state.feedback.filter(fb => fb.id !== id) })),

      addCollaborator: (col) => set((state) => ({ collaborators: [...state.collaborators, col] })),
      removeCollaborator: (id) => set((state) => ({ collaborators: state.collaborators.filter(c => c.id !== id) })),

      setFinancialSteward: (steward) => set({ financialSteward: steward }),
      updateBusinessTargets: (updates) => set((state) => ({
        businessTargets: { ...state.businessTargets, ...updates }
      })),
      setQuizResult: (result) => set({ currentQuizResult: result }),

      clearAllData: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("whyte_onboarded");
          localStorage.removeItem("whyte_verified_project_id");
          localStorage.removeItem("whyte_designer_onboarded");
          localStorage.removeItem("whyte_steward_onboarded");
        }

        set({
          projects: [],
          clientProjects: [],
          designers: [],
          stewards: [],
          accounts: [],
          inquiries: [],
          feedback: [],
          collaborators: [],
          financialSteward: "Imani Financial Services (IFS-KE)",
          currentQuizResult: null,
          businessTargets: {
            monthlyRevenueGoal: 50000000,
            projectVolumeGoal: 10,
            efficiencyTarget: 95
          }
        });
      },
    }),
    {
      name: 'whyte-studio-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
