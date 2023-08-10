import mongoose, { Document, Model, Schema } from "mongoose";
import { WordDocument } from "./wordModel";

interface GameAttributes {
  topWords: WordDocument[];
  bottomWords: WordDocument[];
  endTime: EpochTimeStamp;
  imgUrl: string;
}

export interface GameDocument extends GameAttributes, Document {}

interface GameModel extends Model<GameDocument> {}

const gameSchema = new Schema<GameDocument, GameModel>({
  topWords: { type: [String] },
  bottomWords: { type: [String] },
  endTime: { type: Number, required: true },
  imgUrl: { type: String, required: false },
});

const Game = mongoose.model<GameDocument, GameModel>("Game", gameSchema);

export default Game;
