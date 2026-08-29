import AdminActivity from "../models/adminActivity.js";

export const logAdminActivity = async ({
  admin,
  action,
  targetModel,
  targetId = "",
  details = "",
  ipAddress = "127.0.0.1",
  status = "Success",
}) => {
  try {
    if (!admin) return;
    const adminId = admin._id || admin.id;
    const adminEmail = admin.email || "admin@system.local";

    await AdminActivity.create({
      admin: adminId,
      adminEmail,
      action,
      targetModel,
      targetId: targetId ? targetId.toString() : "",
      details,
      ipAddress,
      status,
    });
  } catch (err) {
    // Non-blocking error for background logging
    console.warn("⚠️ Warning: Failed to record admin activity audit:", err.message);
  }
};

export default logAdminActivity;
