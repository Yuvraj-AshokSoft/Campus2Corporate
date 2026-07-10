import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Lock,
  Save,
  CheckCircle,
} from "lucide-react";

export default function Settings() {
  const [form, setForm] = useState({
    fullName: "Yuvraj Singh",
    email: "yuvraj@example.com",
    phone: "+91 9876543210",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    projects: true,
    interviews: true,
  });

  const [security, setSecurity] = useState({
    loginAlerts: true,
    twoFactor: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-8 py-8">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your account preferences and security.
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">

          <Save size={18} />

          Save Changes

        </button>

      </div>

      {/* Top Cards */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Personal Information */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-semibold">
            Personal Information
          </h2>

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Full Name
              </label>

              <div className="relative">

                <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Email
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Phone Number
              </label>

              <div className="relative">

                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
                />

              </div>

            </div>

          </div>

        </div>

        {/* Account Status */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-semibold">
            Account Status
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

              <span className="text-slate-600">
                Role
              </span>

              <span className="font-semibold">
                Student
              </span>

            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

              <span className="text-slate-600">
                Profile Completion
              </span>

              <span className="font-semibold text-blue-600">
                92%
              </span>

            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

              <span className="text-slate-600">
                Account Status
              </span>

              <span className="flex items-center gap-2 text-green-600 font-semibold">

                <CheckCircle size={18} />

                Verified

              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Password */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">

          <Lock className="text-blue-600" />

          Change Password

        </h2>

        <div className="grid gap-5 md:grid-cols-3">

          <input
            type="password"
            placeholder="Current Password"
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="New Password"
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
          />

        </div>

      </div>

      {/* Notifications & Privacy */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">

            <Bell className="text-blue-600" />

            Notifications

          </h2>

          <div className="space-y-5">

            <label className="flex items-center justify-between">

              Email Notifications

              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    email: !notifications.email,
                  })
                }
              />

            </label>

            <label className="flex items-center justify-between">

              Project Updates

              <input
                type="checkbox"
                checked={notifications.projects}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    projects: !notifications.projects,
                  })
                }
              />

            </label>

            <label className="flex items-center justify-between">

              Interview Alerts

              <input
                type="checkbox"
                checked={notifications.interviews}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    interviews: !notifications.interviews,
                  })
                }
              />

            </label>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">

            <Shield className="text-blue-600" />

            Privacy & Security

          </h2>

          <div className="space-y-5">

            <label className="flex items-center justify-between">

              Login Alerts

              <input
                type="checkbox"
                checked={security.loginAlerts}
                onChange={() =>
                  setSecurity({
                    ...security,
                    loginAlerts: !security.loginAlerts,
                  })
                }
              />

            </label>

            <label className="flex items-center justify-between">

              Two Factor Authentication

              <input
                type="checkbox"
                checked={security.twoFactor}
                onChange={() =>
                  setSecurity({
                    ...security,
                    twoFactor: !security.twoFactor,
                  })
                }
              />

            </label>

          </div>

        </div>

      </div>

    </div>
  );
}