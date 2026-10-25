# CivicFix — AI-Powered Civic Complaint & Accountability Platform

> **“Report It. Track It. Get It Resolved.”**

CivicFix is a modern, responsive, citizen-facing civic tech web application designed to eliminate bureaucratic bottlenecks in municipal grievance redressal. Citizens can snap a photograph of a civic problem (potholes, garbage, sewage overflow, broken streetlights), describe it naturally in **Marathi (मराठी)**, **Hindi (हिन्दी)**, or **English**, and let **Google Gemini AI (`gemini-3.8-flash`)** analyze the evidence to automatically route the ticket to the correct municipal ward department with statutory SLA deadlines and a transparent, auditable timeline.

---

## 🌟 Key Features

1. **Animated Citizen Landing Page**:
   - Dynamic multilingual headline carousel cycling across Marathi, Hindi, and English.
   - Interactive AI vision scanner mockup simulating real-time bounding box inspection and structured work order generation.
   - Core value propositions solving department confusion, language barriers, and lack of accountability.

2. **Multilingual NLP with Gemini 3.8 Flash**:
   - Native support for Marathi (मराठी), Hindi (हिन्दी), and English.
   - Accepts colloquial descriptions, spelling variations, and mixed-language complaints.
   - Produces both citizen-friendly explanations in their mother tongue and standardized formal English work orders for municipal engineers.

3. **AI-Guided Complaint Registration**:
   - **Step 1 (Photo & Location)**: Web camera capture or file upload with live preview. Browser Geolocation API captures exact GPS coordinates with manual street address entry and ward landmark fallbacks.
   - **Step 2 (Describe Issue)**: Short voice/text description with quick prompt helpers in Marathi, Hindi, and English.
   - **Step 3 (AI Suggestion Review)**: AI review card displaying confidence rating, visible evidence checklist, suggested category, responsible municipal department, and SLA duration, with full citizen override controls.
   - **Step 4 (Final Review & Submission)**: Explicit confirmation step preventing accidental submissions.
   - **Step 5 (Confirmation)**: Generates collision-proof public tracking IDs (e.g., `CFX-2026-MUM-84920`) and activates SLA clocks.

4. **Real-Time Visual Tracking & Audit Trail**:
   - Dedicated tracking page with search by reference ID or issue title.
   - Filter by *All*, *Submitted*, *Under Review*, *In Progress*, *Resolved*, or *Overdue / Escalated*.
   - Vertical timeline displaying immutable events with timestamps and actor badges (*Citizen*, *Gemini AI Engine*, *Ward Field Officer*, *Supervisory Commissioner*).

5. **Statutory SLA & Multi-Tier Escalation Workflow**:
   - Configurable acknowledgement SLA (e.g. 12–24h) and resolution SLA (e.g. 2–3 days).
   - Real-time overdue detection based on persisted deadlines.
   - Formal escalation ladder (Tier 1: Ward Field Junior Engineer $\rightarrow$ Tier 2: Executive Ward Officer $\rightarrow$ Tier 3: Additional Municipal Commissioner) with justification recording.

6. **Citizen Resolution Verification & Dispute Handling**:
   - When an officer marks a complaint resolved with a post-repair photograph, the citizen can:
     - **Confirm Resolved**: Closes ticket with citizen sign-off.
     - **Dispute Resolution**: If the issue persists, the ticket is reopened and flagged for supervisory investigation.

7. **In-App Notification Center & Demo Controls**:
   - Instant notification alerts for acknowledgements, crew movements, and SLA warnings.
   - Built-in simulation controls (*Simulate Officer Acknowledge*, *Dispatch Crew*, *Mark Resolved*, *Fast-Forward Overdue*) to test the entire lifecycle in real time.
   - 1-click Demo Citizen presets (*Ramesh Patil — Marathi*, *Pooja Sharma — Hindi*, *Arjun Mehta — English*).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React icons
- **AI Engine**: Google Gemini API (`gemini-3.8-flash`) via `@google/genai` (Server-Side Proxy)
- **Backend / Server**: Node.js, Express (`tsx server.ts`)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Local Storage Demo Fallback
- **Location**: Browser Geolocation API + Municipal Ward Presets

---

## 🚀 Quickstart Guide

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/civicfix.git
cd civicfix
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example environment configuration:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Gemini API Key (Required for AI Vision & NLP analysis)
GEMINI_API_KEY="AIzaSy..."

# Supabase Credentials (Optional - runs in Demo Mode if omitted)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Deploying to Vercel

CivicFix is pre-configured for instant zero-configuration deployment on **Vercel** via `vercel.json` and `/api/index.ts`.

### 1. Push to GitHub
Ensure your repository is pushed to your GitHub account (e.g., `https://github.com/samruddhiwaykar2007-hash/Civicfix`).

### 2. Import into Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/new).
2. Click **"Add New Project"** and select **Import** next to your `Civicfix` repository.
3. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
   - `VITE_SUPABASE_URL` *(Optional)*: Your Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY` *(Optional)*: Your Supabase anonymous key.
5. Click **Deploy**. Your app will be live within seconds with serverless API functions and automatic HTTPS!

---

## 🗄️ Supabase PostgreSQL Migration

To connect live cloud database persistence:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and run `/supabase/migrations/20261024000000_civicfix_init.sql`.
4. Copy your project URL and anon public key into `.env`.

The schema configures:
- `profiles`: Authenticated citizen profiles.
- `departments`: Municipal departments with category routing and SLA durations.
- `complaints`: Public reference IDs, GPS coordinates, descriptions, and SLA deadlines.
- `complaint_attachments`: Storage paths for complaint and resolution evidence.
- `complaint_events`: Immutable audit milestones.
- `escalation_rules`: Multi-tier escalation policies.
- `notifications`: Citizen alerts.
- **Row Level Security (RLS)**: Enforces citizen data privacy and prevents arbitrary tampering with official audit logs.

---

## 🔒 Security Best Practices

- **Zero Client-Side Secret Exposure**: Gemini API calls are strictly handled on the Express server (`server.ts`). API keys are never bundled into client assets.
- **Append-Only Audit Log**: Citizens and field officers cannot alter past audit timestamps or delete logged events.
- **Private Attachments**: Images are tied to complaint records with access control policies.

---

## 📜 License
Apache-2.0
