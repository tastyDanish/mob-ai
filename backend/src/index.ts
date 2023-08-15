require("dotenv").config();
import express, { Request, Response } from "express";
import WebSocket from "ws";
import cors from "cors";
import {
  clearWords,
  getBottomWords,
  getTopWords,
  saveOrUpdateWord,
} from "./models/wordMethods";
import { arraysAreEqual } from "./utils/arrayUtils";
import {
  finishGame,
  getLastCompletedGame,
  getLastGame,
  startGame,
} from "./models/gameMethods";

interface word {
  word: string;
  count: number;
}
let previousTopPhrases: word[] = [];
let previousBottomPhrases: word[] = [];

const app = express();
const port = 5001;
const wss = new WebSocket.Server({ port: 5002 });
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

getLastGame().then((lastGame) => {
  if (lastGame) {
    const gameEnd = new Date(lastGame.end_time);
    const currentTime = new Date();
    const endMs = gameEnd.getTime() - currentTime.getTime();
    if (endMs > 0) setTimeout(endGame, endMs);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("You've reached the API");
});

app.post("/words", async (req: Request, res: Response) => {
  const { word, isPositive } = req.body;
  if (!word || typeof isPositive !== "boolean") {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    const savedWord = await saveOrUpdateWord(word, isPositive);
    const game = await getLastGame();
    if (!game) {
      console.log("no game found... making one");
      const gameDurationInSeconds = 1 * 30;
      const gameStartTimestamp = Math.floor(Date.now() / 1000);
      const gameEndTimestamp = gameStartTimestamp + gameDurationInSeconds;

      const game = await startGame(gameEndTimestamp);
      setTimeout(endGame, gameDurationInSeconds * 1000);
      sendGameEndToClient(game.end_time);
    }
    sendWordsToClient();
    return res.status(201).json(savedWord);
  } catch (error) {
    console.error("Error saving or updating word:", error);
    return res.status(500).json({ error: "sever error" });
  }
});

const endGame = async () => {
  console.log("ending the game!");
  const topWords = (await getTopWords(10)).map((s) => s.word);
  const bottom_words = (await getBottomWords(10)).map((s) => s.word);
  await finishGame(topWords, bottom_words, "");
  await clearWords();
  await sendWordsToClient();
};

wss.on("connection", (ws: WebSocket) => {
  console.log("websocket client connected");

  sendWordsToClient(true);

  getLastGame().then((currentGame) => {
    if (currentGame) broadcast<string>("gameEnd", currentGame.end_time);
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

const sendGameEndToClient = async (end: string) => {
  try {
    broadcast("gameEnd", end);
  } catch (error) {
    console.log("error sending data to the client:", error);
  }
};

const sendWordsToClient = async (force: boolean = false) => {
  try {
    const topPhrases: word[] = (await getTopWords(10)).map((s) => ({
      word: s.word,
      count: s.count,
    }));
    const bottomPhrases: word[] = (await getBottomWords(10)).map((s) => ({
      word: s.word,
      count: s.count,
    }));

    // Compare new results with previous results
    const topPhrasesChanged = !arraysAreEqual(previousTopPhrases, topPhrases);
    const bottomPhrasesChanged = !arraysAreEqual(
      previousBottomPhrases,
      bottomPhrases
    );

    if (topPhrasesChanged || bottomPhrasesChanged || force) {
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
