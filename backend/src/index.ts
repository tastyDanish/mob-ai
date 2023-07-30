import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./db";
import { saveOrUpdateWord } from "./models/wordMethods";

const app = express();
const port = 5001;

connectDB();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend's domain
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! This is the backend server.");
});

app.post("/words", async (req: Request, res: Response) => {
  const { word, isPositive } = req.body;
  if (!word || typeof isPositive !== "boolean") {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    const savedWord = await saveOrUpdateWord(word, isPositive);
    return res.status(201).json(savedWord);
  } catch (error) {
    console.error("Error saving or updating word:", error);
    return res.status(500).json({ error: "sever error" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
