import { useState } from "react";
import {
  Mail,
  Phone,
  GraduationCap,
  School,
  MapPin,
  Calendar,
  Pencil,
  Upload,
  FileText,
  Award,
  Briefcase,
  CheckCircle,
} from "lucide-react";

export default function Profile() {
  const [skills] = useState([
    "React",
    "TypeScript",
    "Python",
    "FastAPI",
    "SQL",
    "Machine Learning",
    "Tailwind CSS",
    "Git",
  ]);

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-8 ">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your personal information, academic details and resume.
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">

          <Pencil size={18} />

          Edit Profile

        </button>

      </div>

      {/* Profile Card */}

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Avatar */}

          <div className="flex flex-col items-center">

            <img
              src="https://ui-avatars.com/api/?name=Yuvraj+Singh&background=2563eb&color=fff&size=250"
              alt="Profile"
              className="h-40 w-40 rounded-full border-4 border-blue-100"
            />

            <button className="mt-5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-50">

              Change Photo

            </button>

          </div>

          {/* Info */}

          <div className="flex-1">

            <div className="flex flex-col gap-2">

              <h2 className="text-3xl font-bold">
                Yuvraj Singh
              </h2>

              <p className="font-medium text-blue-600">
                B.Tech Computer Science Engineering
              </p>

            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              <div className="flex items-center gap-3">

                <Mail className="text-blue-600" />

                <span>yuvraj@example.com</span>

              </div>

              <div className="flex items-center gap-3">

                <Phone className="text-blue-600" />

                <span>+91 9876543210</span>

              </div>

              <div className="flex items-center gap-3">

                <School className="text-blue-600" />

                <span>Campus2Corporate University</span>

              </div>

              <div className="flex items-center gap-3">

                <GraduationCap className="text-blue-600" />

                <span>B.Tech • 4th Year</span>

              </div>

              <div className="flex items-center gap-3">

                <MapPin className="text-blue-600" />

                <span>Indore, Madhya Pradesh</span>

              </div>

              <div className="flex items-center gap-3">

                <Calendar className="text-blue-600" />

                <span>Expected Graduation • 2027</span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <Briefcase className="mb-5 text-blue-600" />

          <h2 className="text-3xl font-bold">
            5
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Registered Projects
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <CheckCircle className="mb-5 text-green-600" />

          <h2 className="text-3xl font-bold">
            2
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Applied Projects
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <Award className="mb-5 text-yellow-500" />

          <h2 className="text-3xl font-bold">
            4
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Certificates
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <FileText className="mb-5 text-purple-600" />

          <h2 className="text-3xl font-bold">
            92%
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Profile Completion
          </p>

        </div>

      </div>

      {/* About & Skills */}

      <div className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold">
            About Me
          </h2>

          <p className="leading-8 text-slate-600">

            Passionate Computer Science Engineering student interested in
            Artificial Intelligence, Machine Learning, Full Stack Development
            and Data Analytics. I enjoy solving real-world problems and
            building scalable applications while continuously improving my
            technical skills through projects, hackathons and internships.

          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-xl font-semibold">
            Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {skills.map((skill) => (

              <span
                key={skill}
                className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

      </div>

      {/* Resume */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">
          Resume
        </h2>

        <div className="flex flex-col gap-5 rounded-xl border border-dashed border-slate-300 p-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-5">

            <FileText
              size={42}
              className="text-blue-600"
            />

            <div>

              <h3 className="font-semibold">
                Resume.pdf
              </h3>

              <p className="text-sm text-slate-500">
                Uploaded on 10 July 2026
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <button className="rounded-xl border border-slate-200 px-5 py-3 font-medium transition hover:bg-slate-50">

              View Resume

            </button>

            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">

              <Upload size={18} />

              Upload New

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}