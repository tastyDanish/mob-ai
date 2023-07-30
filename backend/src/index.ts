import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const port = 5001;

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend's domain
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! This is the backend server.");
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
