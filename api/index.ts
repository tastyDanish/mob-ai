import { saveOrUpdateWord } from "@/supabase/wordMethods";

const trimWord = (word: string) => {
  return word.trim().toLocaleLowerCase();
};

export const addWord = async (word: string) => {
  try {
    const newWord = await saveOrUpdateWord(trimWord(word));
    return newWord;
  } catch (error) {
    console.error("Error posting word:", error);
    return null;
  }
};
