import mongoose, { Document, Model, Schema } from "mongoose";

interface WordAttributes {
  word: string;
  count: number;
}

export interface WordDocument extends WordAttributes, Document {}

interface WordModel extends Model<WordDocument> {}

const wordSchema = new Schema<WordDocument, WordModel>({
  word: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
});

const Word = mongoose.model<WordDocument, WordModel>("Word", wordSchema);

export default Word;
