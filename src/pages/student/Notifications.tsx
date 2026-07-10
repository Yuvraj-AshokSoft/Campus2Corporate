import { useState } from "react";
import {
  Bell,
  Briefcase,
  CheckCircle,
  Calendar,
  FileText,
  CheckCheck,
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  iconColor: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Project Posted",
      description:
        "A new AI Engineer project has been posted matching your skills.",
      time: "5 mins ago",
      read: false,
      icon: Briefcase,
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Interview Scheduled",
      description:
        "Your interview for Frontend Developer has been scheduled.",
      time: "2 hours ago",
      read: false,
      icon: Calendar,
      iconColor: "text-green-600",
    },
    {
      id: 3,
      title: "Profile Approved",
      description:
        "Your student profile has been successfully verified.",
      time: "Yesterday",
      read: true,
      icon: CheckCircle,
      iconColor: "text-emerald-600",
    },
    {
      id: 4,
      title: "Resume Reviewed",
      description:
        "Your resume has been reviewed by the placement team.",
      time: "2 days ago",
      read: true,
      icon: FileText,
      iconColor: "text-orange-600",
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-8 ">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-slate-500">
            Stay updated with your latest activities and project updates.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <CheckCheck size={18} />
          Mark All Read
        </button>

      </div>

      {/* Empty State */}

      {notifications.length === 0 ? (
        <div className="rounded-xl border bg-white p-16 text-center shadow-sm">

          <Bell
            size={56}
            className="mx-auto mb-4 text-gray-300"
          />

          <h2 className="text-xl font-semibold">
            No Notifications
          </h2>

          <p className="mt-2 text-gray-500">
            You're all caught up.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {notifications.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
                  item.read
                    ? "bg-white"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start gap-4">

                  <div className="rounded-full bg-slate-100 p-3">
                    <Icon
                      size={20}
                      className={item.iconColor}
                    />
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between">

                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <span className="text-sm text-gray-500">
                        {item.time}
                      </span>

                    </div>

                    <p className="mt-2 text-gray-600">
                      {item.description}
                    </p>

                  </div>

                  {!item.read && (
                    <div className="mt-2 h-3 w-3 rounded-full bg-blue-600"></div>
                  )}

                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}