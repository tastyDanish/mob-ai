import { saveOrUpdateWord } from "@/supabase/wordMethods";

export const addWord = async (word: string, isPositive: boolean) => {
  try {
    const newWord = await saveOrUpdateWord(word, isPositive);
    return newWord;
  } catch (error) {
    console.error("Error posting word:", error);
    return null;
  }
};
