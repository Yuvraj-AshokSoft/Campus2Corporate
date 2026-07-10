import { useMemo, useState } from "react";
import {
  Search,
  Bookmark,
  MapPin,
  CalendarDays,
  Building2,
  Filter,
  Briefcase,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  company: string;
  location: string;
  domain: string;
  deadline: string;
  description: string;
  skills: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "AI Resume Analyzer",
    company: "Campus2Corporate",
    location: "Remote",
    domain: "AI/ML",
    deadline: "20 July 2026",
    description:
      "Develop an AI-powered resume analysis platform using LLMs and FastAPI.",
    skills: ["Python", "FastAPI", "LLM", "React"],
  },
  {
    id: 2,
    title: "Frontend Dashboard",
    company: "TechNova",
    location: "Bangalore",
    domain: "Frontend",
    deadline: "25 July 2026",
    description:
      "Build responsive React dashboards using Tailwind CSS.",
    skills: ["React", "Tailwind", "TypeScript"],
  },
  {
    id: 3,
    title: "Data Analytics Portal",
    company: "Infosys",
    location: "Hybrid",
    domain: "Data Analytics",
    deadline: "30 July 2026",
    description:
      "Create interactive dashboards using SQL and Power BI.",
    skills: ["SQL", "Power BI", "Python"],
  },
];

export default function ProjectList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.company.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        filter === "All" || project.domain === filter;

      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-8 ">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Project List
        </h1>

        <p className="mt-2 text-slate-500">
          Browse and apply for industry projects.
        </p>

      </div>

      {/* Search & Filter */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row">

        <div className="relative flex-1">

          <Search
            className="absolute left-4 top-3.5 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 focus:border-blue-500 focus:outline-none"
          />

        </div>

        <div className="relative">

          <Filter
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-gray-300 py-3 pl-10 pr-8"
          >
            <option>All</option>
            <option>AI/ML</option>
            <option>Frontend</option>
            <option>Data Analytics</option>
          </select>

        </div>

      </div>

      {/* Empty State */}

      {filteredProjects.length === 0 ? (

        <div className="rounded-xl border bg-white p-20 text-center shadow-sm">

          <Briefcase
            size={60}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-5 text-xl font-semibold">
            No Projects Found
          </h2>

          <p className="mt-2 text-gray-500">
            Try changing your search or filter.
          </p>

        </div>

      ) : (

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

          {filteredProjects.map((project) => (

            <div
              key={project.id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Top */}

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    {project.title}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">

                    <Building2 size={16} />

                    {project.company}

                  </div>

                </div>

                <button>

                  <Bookmark
                    size={20}
                    className="text-gray-400 hover:text-blue-600"
                  />

                </button>

              </div>

              {/* Description */}

              <p className="mt-5 text-sm leading-6 text-gray-600">
                {project.description}
              </p>

              {/* Info */}

              <div className="mt-5 space-y-3 text-sm text-gray-500">

                <div className="flex items-center gap-2">

                  <MapPin size={16} />

                  {project.location}

                </div>

                <div className="flex items-center gap-2">

                  <CalendarDays size={16} />

                  Deadline : {project.deadline}

                </div>

              </div>

              {/* Skills */}

              <div className="mt-5 flex flex-wrap gap-2">

                {project.skills.map((skill) => (

                  <span
                    key={skill}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {skill}
                  </span>

                ))}

              </div>

              {/* Buttons */}

              <div className="mt-6 flex gap-3">

                <button className="flex-1 rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700">
                  Apply Now
                </button>

                <button className="rounded-lg border px-4 hover:bg-gray-100">
                  Save
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}