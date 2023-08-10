import express, { Request, Response } from "express";
import WebSocket from "ws";
import cors from "cors";
import connectDB from "./db";
import { clearWords, getPhrases, saveOrUpdateWord } from "./models/wordMethods";
import { WordDocument } from "./models/wordModel";
import { arraysAreEqual } from "./utils/arrayUtils";
import { getLastGame, startGame } from "./models/gameMethods";
import { GameDocument } from "./models/gameModel";

let previousTopPhrases: WordDocument[] = [];
let previousBottomPhrases: WordDocument[] = [];

const app = express();
const port = 5001;
const wss = new WebSocket.Server({ port: 5002 });
connectDB();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

getLastGame(false).then((lastGame) => {
  if (lastGame) {
    const endMs = lastGame.endTime - Math.floor(Date.now() / 1000);
    setTimeout(endGame, endMs * 1000);
  }
});

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
    const game = await getLastGame(false);
    console.log("game found: ", game);
    if (!game) {
      console.log("no game found... making one");
      const gameDurationInSeconds = 1 * 60;
      const gameStartTimestamp = Math.floor(Date.now() / 1000);
      const gameEndTimestamp = gameStartTimestamp + gameDurationInSeconds;

      const game = await startGame(gameEndTimestamp);
      setTimeout(endGame, gameDurationInSeconds * 1000);
      sendGameEndToClient(game.endTime);
    }
    sendWordsToClient();
    return res.status(201).json(savedWord);
  } catch (error) {
    console.error("Error saving or updating word:", error);
    return res.status(500).json({ error: "sever error" });
  }
});

const endGame = async () => {
  const game = await getLastGame(false);
  if (game) {
    game.topWords = await getPhrases(true, 10);
    game.bottomWords = await getPhrases(false, 10);
    game.imgUrl = "https://picsum.photos/200";
    await game.save();
    await clearWords();
    await broadcast<GameDocument>("lastResult", game);
  }
};

wss.on("connection", (ws: WebSocket) => {
  console.log("websocket client connected");

  sendWordsToClient();
  getLastGame(true).then((lastGame) => {
    if (lastGame) broadcast<GameDocument>("lastResult", lastGame);
  });
  getLastGame(false).then((currentGame) => {
    if (currentGame) broadcast<number>("gameEnd", currentGame.endTime);
  });
});

const broadcast = <T>(messageType: string, data: T) => {
  const message = JSON.stringify({ type: messageType, data });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const sendGameEndToClient = async (end: number) => {
  try {
    broadcast("gameEnd", { end });
  } catch (error) {
    console.log("error sending data to the client:", error);
  }
};

const sendWordsToClient = async () => {
  try {
    const topPhrases = await getPhrases(true, 10);
    const bottomPhrases = await getPhrases(false, 10);

    // Compare new results with previous results
    const topPhrasesChanged = !arraysAreEqual(previousTopPhrases, topPhrases);
    const bottomPhrasesChanged = !arraysAreEqual(
      previousBottomPhrases,
      bottomPhrases
    );

    if (topPhrasesChanged || bottomPhrasesChanged) {
      broadcast("wordUpdate", { top: topPhrases, bottom: bottomPhrases });
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
