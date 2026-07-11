const Settings = () => {
  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-slate-500">
          Manage platform configuration.
        </p>

      </div>

      <div className="space-y-5 rounded-xl bg-white p-6 shadow">

        <div>

          <label className="font-medium">
            Platform Name
          </label>

          <input
            type="text"
            defaultValue="Campus2Career"
            className="mt-2 w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="font-medium">
            Admin Email
          </label>

          <input
            type="email"
            defaultValue="admin@c2c.com"
            className="mt-2 w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="font-medium">
            Placement Target
          </label>

          <input
            type="number"
            defaultValue="90"
            className="mt-2 w-full rounded-lg border p-3"
          />

        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 text-white">
          Save Settings
        </button>

      </div>

    </div>
  );
};

export default Settings;