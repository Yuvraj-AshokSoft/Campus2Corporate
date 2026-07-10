import { useMemo, useState } from "react";
import {
  Calendar,
  Building2,
  Eye,
  Search,
  Briefcase,
} from "lucide-react";

interface AppliedProject {
  id: number;
  title: string;
  company: string;
  appliedDate: string;
  status: "Pending" | "Shortlisted" | "Selected" | "Rejected";
}

const appliedProjects: AppliedProject[] = [
  {
    id: 1,
    title: "AI Engineer Internship",
    company: "OpenAI Labs",
    appliedDate: "10 July 2026",
    status: "Pending",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "TechNova",
    appliedDate: "08 July 2026",
    status: "Shortlisted",
  },
  {
    id: 3,
    title: "Machine Learning Intern",
    company: "Google",
    appliedDate: "05 July 2026",
    status: "Selected",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "Infosys",
    appliedDate: "03 July 2026",
    status: "Rejected",
  },
];

export default function AppliedProjects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    return appliedProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.company.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const badgeColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Shortlisted":
        return "bg-blue-100 text-blue-700";

      case "Selected":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-8 ">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Applied Projects
        </h1>

        <p className="mt-2 text-slate-500">
          Track all the projects you've applied for.
        </p>
      </div>

      {/* Search + Filter */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row">

        <div className="relative flex-1">

          <Search
            className="absolute left-4 top-3.5 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search applied projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 focus:border-blue-500 focus:outline-none"
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Shortlisted</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>

      </div>

      {/* Empty State */}

      {filteredProjects.length === 0 ? (

        <div className="rounded-xl border bg-white p-16 text-center shadow-sm">

          <Briefcase
            className="mx-auto mb-4 text-gray-300"
            size={60}
          />

          <h2 className="text-xl font-semibold">
            No Applied Projects
          </h2>

          <p className="mt-2 text-gray-500">
            You haven't applied to any projects yet.
          </p>

        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2">

          {filteredProjects.map((project) => (

            <div
              key={project.id}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-lg font-bold">
                    {project.title}
                  </h2>

                  <div className="mt-1 flex items-center gap-2 text-gray-500">

                    <Building2 size={16} />

                    {project.company}

                  </div>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>

              </div>

              <div className="mt-5 flex items-center gap-2 text-gray-500">

                <Calendar size={16} />

                Applied on {project.appliedDate}

              </div>

              <button
                className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                <Eye size={18} />

                View Details

              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}