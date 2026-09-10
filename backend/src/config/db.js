import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri && mongoUri.startsWith("mongodb+srv://")) {
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch {}
    }
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;