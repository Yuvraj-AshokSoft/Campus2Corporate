const companies = [
  {
    name: "Infosys",
    jobs: 24,
    recruiters: 12,
    status: "Active",
  },
  {
    name: "TCS",
    jobs: 16,
    recruiters: 8,
    status: "Active",
  },
  {
    name: "Google",
    jobs: 6,
    recruiters: 3,
    status: "Pending",
  },
];

const CompanyManagement = () => {
  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Company Management
        </h1>

        <p className="text-slate-500">
          Manage recruiters and hiring companies.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-3">

        {companies.map((company) => (

          <div
            key={company.name}
            className="rounded-xl bg-white p-6 shadow"
          >

            <h2 className="text-xl font-bold">
              {company.name}
            </h2>

            <p className="mt-2 text-slate-500">
              Open Jobs : {company.jobs}
            </p>

            <p className="text-slate-500">
              Recruiters : {company.recruiters}
            </p>

            <button className="mt-5 rounded bg-blue-600 px-4 py-2 text-white">
              View Details
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default CompanyManagement;