"use client";
import supabase from "@/supabase/supabase";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface WordData {
  word: string;
  count: number;
}

export interface NewWord {
  word: string;
  id: string;
}

export interface WordsContextType {
  topWords: WordData[];
  newWords: NewWord[];
  killWord(id: string): void;
}

const defaultWordsContextValue: WordsContextType = {
  topWords: [],
  newWords: [],
  killWord(id: string): void {},
};

export const WordsContext = createContext<WordsContextType>(
  defaultWordsContextValue
);

export function useWords() {
  return useContext(WordsContext);
}

export interface WordsProviderProps {
  children: ReactNode;
}

const numberSort = (list: WordData[]) => {
  return list.sort((a, b) => {
    return b.count - a.count;
  });
};

export function WordsProvider({ children }: WordsProviderProps) {
  const [topWords, setTopWords] = useState<WordData[]>([]);
  const [newWords, setNewWords] = useState<NewWord[]>([]);

  const NUMBER_LIMIT = 10;

  useEffect(() => {
    supabase
      .from("words")
      .select("*")
      .filter("count", "gt", 0)
      .order("count", { ascending: false })
      .limit(NUMBER_LIMIT)
      .then(({ data }) => {
        if (data) {
          setTopWords(
            numberSort(data.map((s) => ({ word: s.word, count: s.count })))
          );
        }
      });
  }, []);

  const killWord = useCallback(
    (id: string) => {
      setNewWords((prevWords) => prevWords.filter((s) => s.id !== id));
    },
    [setNewWords]
  );

  const replaceTopWord = (newWord: WordData) => {
    const filteredList = topWords.filter((s) => s.word !== newWord.word);
    if (newWord.count <= 0) {
      setTopWords(filteredList);
      return;
    }
    const updatedList = numberSort([...filteredList, newWord]);
    if (updatedList.length > NUMBER_LIMIT) {
      updatedList.splice(NUMBER_LIMIT);
    }
    setTopWords(updatedList);
  };

  const newWordBelongs = (words: WordData[], newItem: WordData): boolean => {
    if (words.length < NUMBER_LIMIT) {
      return true;
    }
    if (words.filter((s) => s.word == newItem.word).length > 0) {
      return true;
    }
    const lastItem = words[words.length - 1];
    return newItem.count > lastItem.count;
  };

  useEffect(() => {
    const wordChannel = supabase
      .channel(`new-words`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "words",
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setTopWords([]);
          } else if (payload.eventType === "INSERT") {
            const word = { word: payload.new.word, count: payload.new.count };

            setNewWords([
              ...newWords,
              {
                word: payload.new.word,
                id: uuidv4(),
              },
            ]);
            if (newWordBelongs(topWords, word)) {
              replaceTopWord(word);
            }
          } else if (payload.eventType === "UPDATE") {
            const word = { word: payload.new.word, count: payload.new.count };
            setNewWords([
              ...newWords,
              {
                word: payload.new.word,
                id: uuidv4(),
              },
            ]);
            if (newWordBelongs(topWords, word)) {
              replaceTopWord(word);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(wordChannel);
    };
  }, [topWords, setNewWords, replaceTopWord]);

  return (
    <WordsContext.Provider value={{ topWords, newWords, killWord }}>
      {children}
    </WordsContext.Provider>
  );
}
