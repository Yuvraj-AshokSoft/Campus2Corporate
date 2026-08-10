import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

// ─── Icon System ──────────────────────────────────────────────────────────────

type IconName =
  | "search"
  | "bell"
  | "sparkles"
  | "chevron-down"
  | "user"
  | "settings"
  | "logout";

const Icon = ({
  name,
  className = "h-4 w-4",
}: {
  name: IconName;
  className?: string;
}) => {
  const paths: Record<IconName, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),

    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </>
    ),

    sparkles: (
      <>
        <path d="M12 3 10.5 8.5 5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" />
        <path d="M5 16v4" />
        <path d="M3 18h4" />
        <path d="M19 3v3" />
        <path d="M17.5 4.5h3" />
      </>
    ),

    "chevron-down": (
      <path d="m6 9 6 6 6-6" />
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7.5 7.5 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-2-1.2L14.2 3h-4.4l-.3 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7.5 7.5 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7.5 7.5 0 0 0 2 1.2l.3 2.6h4.4l.3-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" />
      </>
    ),

    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "ST";

// ─── Props ────────────────────────────────────────────────────────────────────

interface StudentNavbarProps {
  showAiButton?: boolean;
  onAiButtonClick?: () => void;
}

// ─── Student Navbar ───────────────────────────────────────────────────────────

const StudentNavbar = ({
  showAiButton = true,
  onAiButtonClick,
}: StudentNavbarProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const fullName =
    currentUser?.fullName ||
    currentUser?.name ||
    "Student";

  const firstName =
    fullName.split(" ")[0] || "Student";

  const initials = getInitials(fullName);

  const email = currentUser?.email || "";

  const shouldShowAi =
    showAiButton &&
    location.pathname === "/student-dashboard";

  const unreadCount = 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Close profile dropdown when clicking outside
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Close dropdown on route change
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-[48px]
        w-full
        border-b
        border-[#CBC3DA]
        bg-[#FCF9F8]
      "
    >
      <div
        className="
          relative
          flex
          h-full
          w-full
          items-center
          justify-end
          px-[18px]
        "
      >
        {/* ═════════════════════════════════════════════════════════════
            SEARCH BAR
        ═════════════════════════════════════════════════════════════ */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            flex
            h-[29px]
            w-[min(445px,calc(100%-150px))]
            -translate-x-1/2
            -translate-y-1/2
            items-center
            rounded-full
            border
            border-[#CBC3DA]
            bg-[#FCF9F8]
            px-[11px]
            shadow-[0_1px_2px_rgba(73,68,87,0.03)]
            transition-all
            duration-150
            hover:border-[#AFA5C2]
            focus-within:border-[#5400D6]
            focus-within:shadow-[0_0_0_3px_rgba(84,0,214,0.07)]
          "
        >
          {/* Search */}

          <Icon
            name="search"
            className="
              h-[13px]
              w-[13px]
              flex-shrink-0
              text-[#494457]
            "
          />

          <input
            type="search"
            aria-label="Search"
            placeholder="Search for roadmaps, projects, or jobs..."
            className="
              ml-[7px]
              h-full
              min-w-0
              flex-1
              border-none
              bg-transparent
              p-0
              text-[9px]
              font-normal
              text-[#494457]
              outline-none
              placeholder:text-[#8B8792]
            "
          />

          {/* AI */}

          {shouldShowAi && (
            <button
              type="button"
              onClick={onAiButtonClick}
              aria-label="Ask AI"
              title="Ask AI"
              className="
                ml-[4px]
                flex
                h-[21px]
                w-[21px]
                flex-shrink-0
                items-center
                justify-center
                rounded-full
                text-[#5400D6]
                transition-all
                duration-150
                hover:bg-[#DFD0FE]
                hover:scale-105
                active:scale-95
              "
            >
              <Icon
                name="sparkles"
                className="h-[13px] w-[13px]"
              />
            </button>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════════════
            RIGHT CONTROLS
        ═════════════════════════════════════════════════════════════ */}

        <div className="flex items-center gap-[7px]">
          {/* ─────────────────────────────────────────────────────────
              NOTIFICATIONS
          ───────────────────────────────────────────────────────── */}

          <button
            type="button"
            onClick={() =>
              navigate("/student/notifications")
            }
            aria-label="Notifications"
            title="Notifications"
            className="
              relative
              flex
              h-[30px]
              w-[30px]
              items-center
              justify-center
              rounded-full
              text-[#494457]
              transition-all
              duration-150
              hover:bg-[#F3EDF9]
              hover:text-[#5400D6]
              active:scale-95
              focus:outline-none
              focus:ring-2
              focus:ring-[#5400D6]/20
            "
          >
            <Icon
              name="bell"
              className="h-[15px] w-[15px]"
            />

            {unreadCount > 0 && (
              <>
                <span
                  className="
                    absolute
                    right-[5px]
                    top-[4px]
                    h-[6px]
                    w-[6px]
                    rounded-full
                    bg-[#5400D6]
                    ring-2
                    ring-[#FCF9F8]
                  "
                />

                <span className="sr-only">
                  {unreadCount} unread notifications
                </span>
              </>
            )}
          </button>

          {/* ─────────────────────────────────────────────────────────
              PROFILE
          ───────────────────────────────────────────────────────── */}

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen((value) => !value)
              }
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label={`Open ${fullName} profile menu`}
              className={`
                flex
                h-[32px]
                items-center
                gap-[5px]
                rounded-full
                px-[3px]
                pr-[5px]
                transition-all
                duration-150
                focus:outline-none
                focus:ring-2
                focus:ring-[#5400D6]/20
                ${
                  profileOpen
                    ? "bg-[#F3EDF9]"
                    : "hover:bg-[#F3EDF9]"
                }
              `}
            >
              {/* Avatar */}

              <span
                className="
                  flex
                  h-[26px]
                  w-[26px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DFD0FE]
                  bg-[#DFD0FE]
                  text-[8px]
                  font-bold
                  text-[#5400D6]
                  shadow-[0_1px_2px_rgba(84,0,214,0.08)]
                "
              >
                {initials}
              </span>

              {/* Chevron */}

              <Icon
                name="chevron-down"
                className={`
                  h-[10px]
                  w-[10px]
                  text-[#494457]
                  transition-transform
                  duration-200
                  ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* ═══════════════════════════════════════════════════════
                PROFILE DROPDOWN
            ═══════════════════════════════════════════════════════ */}

            {profileOpen && (
              <div
                role="menu"
                className="
                  absolute
                  right-0
                  top-[39px]
                  z-50
                  w-[215px]
                  overflow-hidden
                  rounded-[12px]
                  border
                  border-[#CBC3DA]
                  bg-[#FCF9F8]
                  shadow-[0_12px_30px_rgba(73,68,87,0.13)]
                  ring-1
                  ring-black/[0.02]
                "
              >
                {/* User header */}

                <div
                  className="
                    flex
                    items-center
                    gap-[9px]
                    border-b
                    border-[#CBC3DA]
                    px-[12px]
                    py-[11px]
                  "
                >
                  <span
                    className="
                      flex
                      h-[30px]
                      w-[30px]
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#DFD0FE]
                      text-[9px]
                      font-bold
                      text-[#5400D6]
                    "
                  >
                    {initials}
                  </span>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-[10px]
                        font-semibold
                        text-[#292631]
                      "
                    >
                      {fullName}
                    </p>

                    {email && (
                      <p
                        className="
                          mt-[2px]
                          truncate
                          text-[8px]
                          text-[#8B8792]
                        "
                      >
                        {email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Profile item */}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/student/profile");
                    setProfileOpen(false);
                  }}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-[9px]
                    px-[12px]
                    py-[9px]
                    text-left
                    text-[10px]
                    text-[#494457]
                    transition-colors
                    hover:bg-[#F3EDF9]
                    hover:text-[#5400D6]
                  "
                >
                  <span
                    className="
                      flex
                      h-[25px]
                      w-[25px]
                      items-center
                      justify-center
                      rounded-[7px]
                      bg-[#F3EDF9]
                      text-[#494457]
                      transition-colors
                      group-hover:text-[#5400D6]
                    "
                  >
                    <Icon
                      name="user"
                      className="h-[13px] w-[13px]"
                    />
                  </span>

                  <span>My Profile</span>
                </button>

                {/* Settings */}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/student/settings");
                    setProfileOpen(false);
                  }}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-[9px]
                    px-[12px]
                    py-[9px]
                    text-left
                    text-[10px]
                    text-[#494457]
                    transition-colors
                    hover:bg-[#F3EDF9]
                    hover:text-[#5400D6]
                  "
                >
                  <span
                    className="
                      flex
                      h-[25px]
                      w-[25px]
                      items-center
                      justify-center
                      rounded-[7px]
                      bg-[#F3EDF9]
                      text-[#494457]
                      transition-colors
                      group-hover:text-[#5400D6]
                    "
                  >
                    <Icon
                      name="settings"
                      className="h-[13px] w-[13px]"
                    />
                  </span>

                  <span>Settings</span>
                </button>

                {/* Logout */}

                <div className="mx-[10px] border-t border-[#CBC3DA]" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    logout?.();
                    setProfileOpen(false);
                    navigate("/");
                  }}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-[9px]
                    px-[12px]
                    py-[9px]
                    text-left
                    text-[10px]
                    text-[#494457]
                    transition-colors
                    hover:bg-[#F3EDF9]
                    hover:text-[#5400D6]
                  "
                >
                  <span
                    className="
                      flex
                      h-[25px]
                      w-[25px]
                      items-center
                      justify-center
                      rounded-[7px]
                      bg-[#F3EDF9]
                      text-[#494457]
                      transition-colors
                      group-hover:text-[#5400D6]
                    "
                  >
                    <Icon
                      name="logout"
                      className="h-[13px] w-[13px]"
                    />
                  </span>

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;