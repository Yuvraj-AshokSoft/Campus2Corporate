import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, FileText, Send } from "lucide-react";
import {
  getApiErrorMessage,
  studentApi,
} from "../../services/studentApi";
import StudentLayout from "../../components/student/StudentLayout";
import type { StudentSidebarIconName } from "../../components/student/StudentSidebar";

const sidebarItems: Array<{
  label: string;
  icon: StudentSidebarIconName;
  route: string;
  badge?: number;
}> = [
  {
    label: "Dashboard",
    icon: "dashboard",
    route: "/student-dashboard",
  },
  {
    label: "My Profile",
    icon: "user-check",
    route: "/student/profile",
  },
  {
    label: "My Projects",
    icon: "briefcase",
    route: "/student/projects",
  },
  {
    label: "Applications",
    icon: "clipboard",
    route: "/student/applications",
    badge: 2,
  },
  {
    label: "Placement Prep",
    icon: "building",
    route: "/student/placementprep",
  },
  {
    label: "Notifications",
    icon: "bell",
    route: "/student/notifications",
    badge: 3,
  },
  {
    label: "Certificates",
    icon: "award",
    route: "/student/certificates",
  },
  {
    label: "Settings",
    icon: "settings",
    route: "/student/settings",
  },
  {
    label: "AI Resume",
    icon: "resume",
    route: "/student/ai-resume",
  },
  {
    label: "Career Roadmap",
    icon: "map",
    route: "/student/roadmap",
  },
  {
    label: "Career Updates",
    icon: "megaphone",
    route: "/student/broadcast",
  },
];

export default function ApplicationSubmission() {
  const navigate = useNavigate();
  const { driveId } = useParams<{ driveId: string }>();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Keep this page independent from the hiring-process UI.
    // Student profile data can be prefilled here later from the API.
  }, []);

  const handleSubmit = async () => {
    if (!driveId) {
      setError("Hiring drive information is missing.");
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (!resumeFile) {
      setError("Please select a resume file.");
      return;
    }

    const allowedResumeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedResumeTypes.includes(resumeFile.type)) {
      setError("Resume must be a PDF, DOC, or DOCX file.");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      return;
    }

    if (!confirmed) {
      setError("Please confirm that your information is correct.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("resume", resumeFile);
      formData.append("driveId", driveId);

      await studentApi.startHiringDrive(driveId, formData);

      navigate(`/student/hiring-process/${driveId}`);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout
      sidebarItems={sidebarItems}
      sidebarHighlight="Hiring Process"
      userSummary={{
        fullName: fullName || "Student",
        role: "B.Tech CSE · 4th Year",
        status: "Application submission",
      }}
      stats={{
        label: "Application",
        value: "1",
        subtitle: "Ready to submit",
        accent: "Action",
      }}
    >
      <div className="mx-auto max-w-4xl space-y-5">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/student/placementprep")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-[#5400D6]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Placement Prep
        </button>

        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#E9DDFF]/60 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E9DDFF] bg-[#F4EFFF] px-3 py-1 text-[11px] font-bold text-[#4500AD]">
              <FileText className="h-3.5 w-3.5" />
              Job application
            </span>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Submit your application
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review your details before submitting your application.
              After submission, you will continue to the hiring process.
            </p>
          </div>
        </section>

        {/* Application Form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-black text-slate-900">
              Applicant information
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Enter the information that should be associated with this
              hiring application.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Full name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#B99AFF] focus:bg-white focus:ring-2 focus:ring-[#F4EFFF]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#B99AFF] focus:bg-white focus:ring-2 focus:ring-[#F4EFFF]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Phone number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#B99AFF] focus:bg-white focus:ring-2 focus:ring-[#F4EFFF]"
              />
            </div>

            {/* Resume */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Resume
              </label>

              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => {
                  setResumeFile(event.target.files?.[0] || null);
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#B99AFF] focus:bg-white focus:ring-2 focus:ring-[#F4EFFF]"
              />

              <p className="mt-1.5 text-xs text-slate-500">
                {resumeFile?.name || "PDF, DOC, or DOCX up to 5 MB"}
              </p>
            </div>
          </div>

          {/* Confirmation */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) =>
                  setConfirmed(event.target.checked)
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#5400D6] focus:ring-[#5400D6]"
              />

              <span className="text-xs leading-5 text-slate-600">
                I confirm that the information provided above is accurate
                and I want to submit this application for the selected
                hiring drive.
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/student/placementprep")}
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5400D6] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-[#5400D6]/20 transition hover:bg-[#4500AD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </section>

        {/* After submission information */}
        <section className="rounded-2xl border border-[#E9DDFF] bg-[#F4EFFF] p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white">
              <CheckCircle2 className="h-5 w-5 text-[#5400D6]" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#4500AD]">
                What happens next?
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#5F3C8A]">
                After submitting your application, you will be taken to
                the hiring process where you can begin the Aptitude
                Assessment.
              </p>
            </div>
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}