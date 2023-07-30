import Word from "./wordModel";

export const saveOrUpdateWord = async (word: string) => {
  try {
    const existingWord = await Word.findOne({ word });
    if (existingWord) {
      existingWord.count += 1;
    } else {
      return Word.create({ word });
    }
  } catch (error) {
    console.error("Error saving or updating word:", error);
    throw error;
  }
};

export const getTopPhrases = async () => {
  try {
    const topPhrases = await Word.find({}).sort({ count: -1 }).limit(20);
    return topPhrases;
  } catch (error) {
    console.error("Error fetching top phrases:", error);
    throw error;
  }
};
