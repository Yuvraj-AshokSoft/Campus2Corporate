const users = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Student",
    email: "rahul@gmail.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Recruiter",
    email: "priya@gmail.com",
    status: "Pending",
  },
  {
    id: 3,
    name: "Ashok College",
    role: "College",
    email: "college@gmail.com",
    status: "Active",
  },
];

const UserManagement = () => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          User Management
        </h1>

        <p className="text-slate-500">
          Manage students, recruiters, colleges and mentors.
        </p>
      </div>

      <div className="rounded-xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Role</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id} className="border-b">

                <td className="p-4">{user.name}</td>

                <td className="p-4">{user.role}</td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">

                  <span className={`rounded-full px-3 py-1 text-sm ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {user.status}
                  </span>

                </td>

                <td className="p-4">

                  <button className="rounded bg-blue-600 px-3 py-2 text-white">
                    Edit
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default UserManagement;