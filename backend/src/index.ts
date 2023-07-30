import express, { Request, Response } from "express";
import WebSocket from "ws";
import cors from "cors";
import connectDB from "./db";
import { getPhrases, saveOrUpdateWord } from "./models/wordMethods";
import { WordDocument } from "./models/wordModel";
import { arraysAreEqual } from "./utils/arrayUtils";

let previousTopPhrases: WordDocument[] = [];
let previousBottomPhrases: WordDocument[] = [];

const app = express();
const port = 5001;
const wss = new WebSocket.Server({ port: 5002 });
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
    sendDataToClient();
    return res.status(201).json(savedWord);
  } catch (error) {
    console.error("Error saving or updating word:", error);
    return res.status(500).json({ error: "sever error" });
  }
});

wss.on("connection", (ws: WebSocket) => {
  console.log("websocket client connected");

  sendDataToClient();
});

const sendDataToClient = async () => {
  try {
    const topPhrases = await getPhrases(true, 20);
    const bottomPhrases = await getPhrases(false, 20);

    // Compare new results with previous results
    const topPhrasesChanged = !arraysAreEqual(previousTopPhrases, topPhrases);
    const bottomPhrasesChanged = !arraysAreEqual(
      previousBottomPhrases,
      bottomPhrases
    );

    if (topPhrasesChanged || bottomPhrasesChanged) {
      const data = JSON.stringify({ top: topPhrases, bottom: bottomPhrases });
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
      // Notify the WebSocket clients about the updated data

      // Update the previous phrases with the current ones
      previousTopPhrases = topPhrases;
      previousBottomPhrases = bottomPhrases;
    }
  } catch (error) {
    console.error("Error sending data to client:", error);
  }
};

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
