import Word from "./wordModel";

export const saveOrUpdateWord = async (word: string, isPositive: boolean) => {
  try {
    const existingWord = await Word.findOne({ word });
    if (existingWord) {
      existingWord.count += isPositive ? 1 : -1;
      await existingWord.save();
      return existingWord;
    } else {
      return Word.create({ word: word, count: isPositive ? 1 : -1 });
    }
  } catch (error) {
    console.error("Error saving or updating word:", error);
    throw error;
  }
};

export const getPhrases = async (isTop: boolean, limit: number) => {
  try {
    const sortDirection = isTop ? -1 : 1;
    const condition = isTop ? { $gt: 0 } : { $lte: 0 };
    const phrases = await Word.find({ count: condition })
      .sort({ count: sortDirection })
      .limit(limit);
    return phrases;
  } catch (error) {
    console.error("Error fetching phrases:", error);
    throw error;
  }
};

export const clearWords = async () => {
  try {
    const deleteResult = await Word.deleteMany({});
  } catch (error) {
    console.error("error deleteing words:", error);
  }
};
