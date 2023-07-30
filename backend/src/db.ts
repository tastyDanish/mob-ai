import mongoose, { ConnectOptions } from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/your_database_name";

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
