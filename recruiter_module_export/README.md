# 💼 Campus2Corporate — Recruiter Portal Module

A complete, standalone enterprise Recruiter Portal frontend module built for the **Campus2Corporate (C2C)** platform. This module enables corporate recruiters to manage job postings, track applicant pipelines, shortlist candidate talent, and handle account verification.

---

## 📁 Module Directory Structure

```
recruiter_module_export/
├── README.md                           # Documentation & Integration Guide
└── src/
    ├── components/
    │   └── recruiter/
    │       ├── RecruiterLayout.tsx     # Responsive layout shell with sidebar, navbar, and access control
    │       ├── RecruiterNavbar.tsx     # Top navigation bar with global search, notifications, & test account switcher
    │       └── RecruiterSidebar.tsx    # Left sidebar navigation
    ├── pages/
    │   └── recruiter/
    │       ├── ApplicationsReports.tsx # Applications & Candidate Reports with shortlist action buttons
    │       ├── CandidateDossier.tsx    # Detailed applicant profile view
    │       ├── Messages.tsx            # Recruiter notifications & messaging center
    │       ├── MyJobPostings.tsx       # Managed job listings & pipeline navigation
    │       ├── PipelineManagement.tsx  # 4-stage Shortlisted Candidates Kanban pipeline
    │       ├── PostJob.tsx             # Job creation and publication form
    │       ├── RecruiterDashboard.tsx  # Overview dashboard metrics & account status
    │       └── RecruiterSettings.tsx   # Company profile & team management settings
    └── utils/
        └── recruiterNotifications.ts   # Helper utility for managing live recruiter notifications
```

---

## ✨ Key Features

### 1. 📋 Shortlisted Candidates Kanban Pipeline (`PipelineManagement.tsx`)
- **4-Stage Workflow**: *Shortlisted* ➔ *Contacted* ➔ *Interview Scheduled* ➔ *Offer Extended*.
- **Stage Progression Actions**:
  - `Move Forward →`: Advances candidate to the next hiring stage.
  - `↩️ Rollback`: Reverts candidate to the previous hiring stage if needed.
- **Candidate Sourcing**: Supports adding candidates from **Referral**, **External / Outside Application**, or **Direct Application**.
- **Real-Time Data Persistence**: Syncs instantly across tabs and page reloads via `localStorage`.

### 2. 📊 Applications & Reports (`ApplicationsReports.tsx`)
- View candidate application intelligence across all active and past job postings.
- Filter candidates by stage (*Eligible / Applied*, *Shortlisted*, *Contacted*, *Interview*, *Offer Extended*).
- Shortlist candidates directly from table rows with instant real-time pipeline sync.

### 3. 🔒 Account Verification Access Control (`RecruiterLayout.tsx`)
- **Unverified Recruiter Access**: Unverified recruiters (`UNFILLED` or `PENDING`) can access **Notifications** (`/recruiter/messages`) and **Settings** (`/recruiter/settings`).
- **Restricted Features**: Candidate tools, job postings, and applicant dossiers require `VERIFIED` status approved by Admin.

### 4. 🔍 Global Search & Notifications (`RecruiterNavbar.tsx`)
- Live search bar searching across portal pages, candidates, and job postings.
- Interactive notification popover bell `🔔` with badge count and filter tabs (*All*, *System*, *Candidates*, *Admin*).
- Demo account switcher (`verified@recruiter.com` vs `unverified@recruiter.com`).

---

## 🚀 How to Integrate into Main Project

1. Copy the `src` folder contents from `recruiter_module_export/src/` into your main project's `src/` directory.
2. Ensure required icons from `lucide-react` and helper utilities from `src/lib/utils` (such as `cn`) are installed.
3. Import routes into your router configuration (`AppRoutes.tsx`):

```tsx
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostJob from "./pages/recruiter/PostJob";
import MyJobPostings from "./pages/recruiter/MyJobPostings";
import ApplicationsReports from "./pages/recruiter/ApplicationsReports";
import PipelineManagement from "./pages/recruiter/PipelineManagement";
import CandidateDossier from "./pages/recruiter/CandidateDossier";
import RecruiterSettings from "./pages/recruiter/RecruiterSettings";
import Messages from "./pages/recruiter/Messages";
```

---

## 🛠️ Tech Stack

- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State & Storage**: React State + LocalStorage Event Synchronization
