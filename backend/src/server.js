import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { seedAdmin } from "./utils/seedAdmin.js";

// Connect Database & seed initial admin
connectDB().then(() => {
  seedAdmin();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
