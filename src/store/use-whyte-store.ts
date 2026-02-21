
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
  description?: string;
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
  
  addFeedback: (feedback: Feedback) => void;
  approveFeedback: (id: string) => void;
  removeFeedback: (id: string) => void;
  
  addCollaborator: (collaborator: Collaborator) => void;
  
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
    milestones: [
      { label: "Concept Approval", date: "Jan 12", isCompleted: true, description: "Bespoke mood boards finalized." },
      { label: "Technical Drawings", date: "Feb 05", isCompleted: true, description: "Architectural blueprints signed off." },
      { label: "Site Installation", date: "Ongoing", isCompleted: false, description: "Current phase of architectural layering." }
    ],
    installments: [
      { label: "Initial Deposit (70%)", percentage: 70, amount: 10500000, status: 'Paid' },
      { label: "Final Reconciliation (30%)", percentage: 30, amount: 4500000, status: 'Pending' }
    ]
  }
];

export const useWhyteStore = create<WhyteState>()(
  persist(
    (set) => ({
      projects: initialProjects,
      clientProjects: initialClientProjects,
      inquiries: [],
      feedback: [],
      collaborators: [],
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

      addFeedback: (fb) => set((state) => ({ feedback: [fb, ...state.feedback] })),
      approveFeedback: (id) => set((state) => ({
        feedback: state.feedback.map(fb => fb.id === id ? { ...fb, isApproved: true } : fb)
      })),
      removeFeedback: (id) => set((state) => ({ feedback: state.feedback.filter(fb => fb.id !== id) })),

      addCollaborator: (col) => set((state) => ({ collaborators: [...state.collaborators, col] })),

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
