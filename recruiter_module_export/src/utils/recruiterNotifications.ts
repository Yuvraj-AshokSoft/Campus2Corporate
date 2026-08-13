export interface RecruiterNotification {
  id: number;
  type: "job" | "candidate" | "message" | "admin";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const pushRecruiterNotification = (notif: {
  type: "job" | "candidate" | "message" | "admin";
  title: string;
  message: string;
}) => {
  try {
    const existing: RecruiterNotification[] = JSON.parse(
      localStorage.getItem("c2c_recruiter_notifications") || "[]"
    );
    
    const newNotif: RecruiterNotification = {
      id: Date.now(),
      type: notif.type,
      title: notif.title,
      message: notif.message,
      time: "Just now",
      read: false
    };

    localStorage.setItem(
      "c2c_recruiter_notifications",
      JSON.stringify([newNotif, ...existing])
    );

    // Dispatch event so RecruiterNavbar updates instantly
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error(e);
  }
};
