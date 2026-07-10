import { useMemo, useState } from "react";
import {
  Award,
  Search,
  Download,
  Eye,
  Calendar,
  Building2,
} from "lucide-react";

interface Certificate {
  id: number;
  title: string;
  organization: string;
  issueDate: string;
  category: string;
}

const certificates: Certificate[] = [
  {
    id: 1,
    title: "Python Programming",
    organization: "Coursera",
    issueDate: "12 Jan 2026",
    category: "Programming",
  },
  {
    id: 2,
    title: "Machine Learning",
    organization: "Google",
    issueDate: "22 Feb 2026",
    category: "AI",
  },
  {
    id: 3,
    title: "React Developer",
    organization: "Meta",
    issueDate: "10 Mar 2026",
    category: "Web Development",
  },
  {
    id: 4,
    title: "SQL for Data Analytics",
    organization: "Udemy",
    issueDate: "15 Apr 2026",
    category: "Data",
  },
];

export default function Certificates() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredCertificates = useMemo(() => {
    return certificates.filter((certificate) => {
      const matchSearch =
        certificate.title.toLowerCase().includes(search.toLowerCase()) ||
        certificate.organization
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchFilter =
        filter === "All" || certificate.category === filter;

      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-8 ">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Certificates
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage all your earned certificates.
        </p>
      </div>

      {/* Search & Filter */}

      <div className="flex flex-col gap-4 md:flex-row">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search certificates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 focus:border-blue-500 focus:outline-none"
          />

        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3"
        >
          <option>All</option>
          <option>Programming</option>
          <option>AI</option>
          <option>Web Development</option>
          <option>Data</option>
        </select>

      </div>

      {/* Empty State */}

      {filteredCertificates.length === 0 ? (

        <div className="rounded-xl border bg-white p-16 text-center shadow-sm">

          <Award
            size={60}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-5 text-xl font-semibold">
            No Certificates Found
          </h2>

          <p className="mt-2 text-gray-500">
            Complete courses to earn certificates.
          </p>

        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredCertificates.map((certificate) => (

            <div
              key={certificate.id}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-lg"
            >

              <div className="flex items-center justify-between">

                <Award
                  className="text-yellow-500"
                  size={32}
                />

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {certificate.category}
                </span>

              </div>

              <h2 className="mt-5 text-lg font-bold">
                {certificate.title}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-gray-500">

                <Building2 size={16} />

                {certificate.organization}

              </div>

              <div className="mt-3 flex items-center gap-2 text-gray-500">

                <Calendar size={16} />

                {certificate.issueDate}

              </div>

              <div className="mt-6 flex gap-3">

                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700">

                  <Eye size={18} />

                  View

                </button>

                <button className="flex items-center gap-2 rounded-lg border px-4 hover:bg-gray-100">

                  <Download size={18} />

                  Download

                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}