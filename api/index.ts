import { saveOrUpdateWord } from "@/supabase/wordMethods";

export const addWord = async (word: string) => {
  try {
    const newWord = await saveOrUpdateWord(word);
    return newWord;
  } catch (error) {
    console.error("Error posting word:", error);
    return null;
  }
};
