import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "SeatLock",
    });

    console.log("Successfully connected to DB✅");
  } catch (error) {
    console.log("Failed to connect to DB❌");
  }
};
