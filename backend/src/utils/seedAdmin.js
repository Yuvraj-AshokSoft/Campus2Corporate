import Admin from "../models/admin.js";

export const seedAdmin = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || "admin@campus.com").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "AdmiN@2026";
    const name = process.env.ADMIN_NAME || "Platform Super Admin";
    const phone = process.env.ADMIN_PHONE || "9876543210";

    let admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      admin = new Admin({
        name,
        email,
        phone,
        password,
        role: "Super Admin",
        status: "Active",
      });
      await admin.save();
      console.log(` Initial Super Admin created successfully: ${email}`);
    } else {
      // Ensure it is Super Admin and Active
      admin.role = "Super Admin";
      admin.status = "Active";
      admin.password = password; // pre-save will re-hash
      await admin.save();
      console.log(` Primary Super Admin credentials synced: ${email}`);
    }
  } catch (error) {
    console.error(" Error in seedAdmin:", error.message);
  }
};

export default seedAdmin;
