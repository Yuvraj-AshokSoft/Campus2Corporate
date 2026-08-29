import mongoose from "mongoose";

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/c2c";
  const localFallbackUri = "mongodb://127.0.0.1:27017/c2c";

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (primaryUri !== localFallbackUri) {
      console.warn(
        `⚠️ Primary MongoDB connection failed (${error.message}). Trying local fallback: ${localFallbackUri}`
      );
      try {
        const fallbackConn = await mongoose.connect(localFallbackUri, {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(
          ` MongoDB Connected (Local Fallback): ${fallbackConn.connection.host}`
        );
        return fallbackConn;
      } catch (fallbackErr) {
        console.error("❌ MongoDB Connection Failed (Primary & Local Fallback)");
        console.error(fallbackErr.message);
        throw fallbackErr;
      }
    } else {
      console.error("❌ MongoDB Connection Failed:", error.message);
      throw error;
    }
  }
};

export default connectDB;
