import "dotenv/config";
import dotenv from "dotenv";
import dns from "dns";
import app from "./app.js";
import connectDB from "./config/db.js";

dns.setDefaultResultOrder('ipv4first');

dotenv.config();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});