
# Whyte Interior Designs — Studio ERP & Digital Showroom

A luxury interior design management platform built for high-end residential and commercial consultancy. This application serves as both a public-facing digital portfolio and a private **Administrative Terminal** for managing the full lifecycle of bespoke architectural commissions.

## 🏛 Architecture & Design Principles

The platform is engineered with a focus on **Operational Integrity** and **Timeless Sophistication**, mirroring the studio's commitment to excellence.

### Core Tech Stack
- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) for optimized performance.
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/) for editorial-grade layout and [ShadCN UI](https://ui.shadcn.com/) for authoritative components.
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) with LocalStorage persistence for seamless session synchronization.
- **Motion Design:** [Framer Motion](https://www.framer.com/motion/) for cinematic spatial transitions.
- **Typography:** **EB Garamond** — Defining the platform's sophisticated editorial character.

## ✨ Technical & Operational Features

### 1. Administrative Master Terminal
A command center for senior partners to oversee the studio's creative and financial health.
- **Project Terminal:** Deep management of specific dossiers, featuring a **Tactical Kanban Board** for site protocol tracking.
- **Lifecycle Guardrails:** Commissions are strictly filtered through Planning, Execution, and Completion phases.
- **Network Ecosystem:** A centralized registry for Creative Partners and Site Trades (Vendors).

### 2. Stewardship & Financial Protocol
- **Audited Reconciliation:** Projects in the "Completion" phase are gated behind a financial audit performed by an assigned Studio Steward.
- **Immutable Records:** Once a project is "Verified," the dossier transitions to a **Read-Only** state, preserving the integrity of the historical and financial log.
- **Tiered Commissions:** Automated installment logic based on Premium, Deluxe, or Golden commission tiers.

### 3. Client Portal & Transparency
- **Private Workspace:** Clients can track "Implementation Velocity" and site progress in real-time.
- **Transparency Dossier:** A dedicated portal for clients to review audited financial reconciliations and site protocol outcomes.
- **Interactive Style Quiz:** A rule-based analysis engine that pinpoints a client's unique "Visual Language."

## 🎨 Styling Philosophy
- **Typographic Scale:** Technical metadata is calibrated to a **12px-13px** range for professional legibility, while headlines utilize large-scale serif italics for high-impact hierarchy.
- **Luxury Minimalist Palette:** A sophisticated base of pure white and deep charcoals, punctuated by the signature Whyte "Accent" purple (`hsl(300 24% 20%)`).
- **Whitespace:** Generous padding and margins allow complex architectural data to "breathe," reflecting the firm's spatial design methodology.

## 🛠 Developer Guide

### Directory Structure
- `src/app/admin`: Administrative modules (Registry, Operations, HR).
- `src/app/dashboard`: Client-facing portal and onboarding.
- `src/store`: Centralized Zustand store for cross-session persistence.
- `src/components/sections`: High-fidelity landing page modules.

### Operational Logic
The application uses a "Strict Lifecycle" model. A project must be **Activated** via an initial deposit verification before site implementation tasks (Kanban) can be managed. Final reconciliation is only available after all site protocols are documented as complete.

---

*Authored by the Senior Developer Panel — Whyte Interior Designs. All rights reserved.*
