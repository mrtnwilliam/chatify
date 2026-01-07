import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) throw new Error("MONGODB_URI is not set")

    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.log("MongoDB connection error:", error)
    process.exit(1); // 1 status code means fail, 0 means success
  }
}