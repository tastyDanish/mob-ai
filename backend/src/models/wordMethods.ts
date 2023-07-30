import Word from "./wordModel";

export const saveOrUpdateWord = async (word: string, isPositive: boolean) => {
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

export const getTopPhrases = async (isTop: boolean, limit: number) => {
  try {
    const sortDirection = isTop ? -1 : 1;
    const phrases = await Word.find({})
      .sort({ count: sortDirection })
      .limit(limit);
    return phrases;
  } catch (error) {
    console.error("Error fetching phrases:", error);
    throw error;
  }
};
