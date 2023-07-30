import mongoose, { ConnectOptions } from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/word_store";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
