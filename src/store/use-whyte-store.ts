
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

export interface ClientProject {
  id: string;
  name: string;
  email: string;
  project: string;
  tier: 'Premium' | 'Deluxe' | 'Golden';
  status: 'Consultation' | 'Planning' | 'Procurement' | 'Execution' | 'Styling' | 'Completed' | 'Termination Pending' | 'Terminated';
  progress: number;
  startDate: string;
  lastActivity: string;
  financialReportStatus?: 'Verified' | 'Pending' | 'Awaiting Steward';
  isActivated: boolean;
  initialDepositPaid: boolean;
  depositCode?: string;
  totalBudget: number;
  milestones: Milestone[];
  installments: Installment[];
  siteReports?: SiteReport[];
  tasks?: ProjectTask[];
  description?: string;
  // Planning Fields
  roomsCount?: number;
  workScope?: string;
  operationalBudget?: number;
  vendorAllocations?: VendorAllocation[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  type: 'new_business' | 'project_support' | 'complaint' | 'termination_request';
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
  specialty: string;
  contact: string;
  rating: number;
  status: 'active' | 'on_hold' | 'blacklisted';
  type: string;
}

interface WhyteState {
  projects: Project[];
  clientProjects: ClientProject[];
  inquiries: Inquiry[];
  feedback: Feedback[];
  collaborators: Collaborator[];
  financialSteward: string;
  
  // Actions
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  
  addClientProject: (clientProject: ClientProject) => void;
  updateClientProject: (id: string, updates: Partial<ClientProject>) => void;
  
  addInquiry: (inquiry: Inquiry) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  removeInquiry: (id: string) => void;
  
  addFeedback: (feedback: Feedback) => void;
  approveFeedback: (id: string) => void;
  removeFeedback: (id: string) => void;
  
  addCollaborator: (collaborator: Collaborator) => void;
  removeCollaborator: (id: string) => void;
  
  setFinancialSteward: (steward: string) => void;
  
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
    lastActivity: "2 hours ago",
    financialReportStatus: 'Pending',
    isActivated: true,
    initialDepositPaid: true,
    depositCode: "AUTH-8821",
    totalBudget: 15000000,
    roomsCount: 8,
    workScope: "Full architectural renovation of primary and secondary wings including sustainable material integration.",
    operationalBudget: 2500000,
    milestones: [
      { label: "Concept Approval", date: "Jan 12", isCompleted: true, description: "Bespoke mood boards finalized." },
      { label: "Technical Drawings", date: "Feb 05", isCompleted: true, description: "Architectural blueprints signed off." },
      { label: "Site Installation", date: "Ongoing", isCompleted: false, description: "Current phase of architectural layering." }
    ],
    installments: [
      { label: "Initial Deposit (70%)", percentage: 70, amount: 10500000, status: 'Paid' },
      { label: "Final Reconciliation (30%)", percentage: 30, amount: 4500000, status: 'Pending' }
    ],
    siteReports: [
      { id: "LOG-1", date: "Feb 10", type: "Progress", content: "Italian marble installation complete.", urgency: "Normal" }
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
    ]
  }
];

const initialCollaborators: Collaborator[] = [
  { id: "C-1", name: "Artisanal Woodworks KE", category: 'Vendor', specialty: "Joinery & Custom Fabrication", contact: "+254 700 000 000", rating: 4.8, status: 'active', type: 'Local Specialist' },
  { id: "C-2", name: "Nairobi Marble & Tile", category: 'Vendor', specialty: "Stone Masonry", contact: "+254 711 111 111", rating: 4.9, status: 'active', type: 'Materials Partner' },
  { id: "C-3", name: "Sarah Studio", category: 'Collaborator', specialty: "Interior Styling", contact: "+254 722 000 000", rating: 5.0, status: 'active', type: 'Consulting Architect' }
];

export const useWhyteStore = create<WhyteState>()(
  persist(
    (set) => ({
      projects: initialProjects,
      clientProjects: initialClientProjects,
      inquiries: [],
      feedback: [],
      collaborators: initialCollaborators,
      financialSteward: "Imani Financial Services (IFS-KE)",

      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      removeProject: (id) => set((state) => ({ projects: state.projects.filter(p => p.id !== id) })),

      addClientProject: (clientProject) => set((state) => ({ clientProjects: [...state.clientProjects, clientProject] })),
      updateClientProject: (id, updates) => set((state) => ({
        clientProjects: state.clientProjects.map(cp => cp.id === id ? { ...cp, ...updates } : cp)
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

      clearAllData: () => set({
        projects: [],
        clientProjects: [],
        inquiries: [],
        feedback: [],
        collaborators: [],
        financialSteward: "Imani Financial Services (IFS-KE)"
      }),
    }),
    {
      name: 'whyte-studio-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
