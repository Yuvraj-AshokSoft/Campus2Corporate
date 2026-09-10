import Admin from "../models/admin.js";

export const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : null;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn("⚠️ Admin seeding skipped: ADMIN_EMAIL or ADMIN_PASSWORD environment variable is not set.");
      return;
    }

    const name = process.env.ADMIN_NAME ? process.env.ADMIN_NAME.trim() : "Platform Super Admin";
    const phone = process.env.ADMIN_PHONE ? process.env.ADMIN_PHONE.trim() : "9876543210";

    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      const admin = new Admin({
        name,
        email,
        phone,
        password,
        role: "Super Admin",
        status: "Active",
      });
      await admin.save();
      console.log(` Initial Super Admin provisioned successfully: ${email}`);
    } else {
      // Idempotent: Do not overwrite existing admin password, status, or role
      console.log(`ℹ️ Admin account already exists (${email}). Seeder skipped.`);
    }
  } catch (error) {
    console.error("❌ Error in seedAdmin:", error.message);
  }
};

export default seedAdmin;
