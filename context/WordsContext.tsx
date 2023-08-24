"use client";
import supabase from "@/supabase/supabase";
import React, {
  ReactNode,
  createContext,
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
  isPositive: boolean;
}

export interface WordsContextType {
  topWords: WordData[];
  bottomWords: WordData[];
  newWords: NewWord[];
  killWord(id: string): void;
}

const defaultWordsContextValue: WordsContextType = {
  topWords: [],
  bottomWords: [],
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

const numberSort = (list: WordData[], isPositive: boolean) => {
  return list.sort((a, b) => {
    if (b.count !== a.count) {
      return isPositive ? b.count - a.count : a.count - b.count;
    } else {
      return a.word.localeCompare(b.word);
    }
  });
};

export function WordsProvider({ children }: WordsProviderProps) {
  const [topWords, setTopWords] = useState<WordData[]>([]);
  const [newWords, setNewWords] = useState<NewWord[]>([]);
  const [bottomWords, setBottomWords] = useState<WordData[]>([]);

  useEffect(() => {
    supabase
      .from("words")
      .select("*")
      .filter("count", "gt", 0)
      .order("count", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) {
          setTopWords(
            numberSort(
              data.map((s) => ({ word: s.word, count: s.count })),
              true
            )
          );
        }
      });
    supabase
      .from("words")
      .select("*")
      .filter("count", "lte", 0)
      .order("count", { ascending: true })
      .limit(10)
      .then(({ data }) => {
        if (data) {
          setBottomWords(
            numberSort(
              data.map((s) => ({ word: s.word, count: s.count })),
              false
            )
          );
        }
      });
  }, []);

  const killWord = (id: string) => {
    setNewWords(newWords.filter((s) => s.id != id));
  };

  const replaceTopWord = (newWord: WordData) => {
    const filteredList = topWords.filter((s) => s.word !== newWord.word);
    if (newWord.count <= 0) {
      setTopWords(filteredList);
      return;
    }
    const updatedList = numberSort([...filteredList, newWord], true);
    if (updatedList.length > 10) {
      updatedList.splice(10);
    }
    setTopWords(updatedList);
  };

  const replaceBottomWord = (newWord: WordData) => {
    const filteredList = bottomWords.filter((s) => s.word !== newWord.word);
    if (newWord.count > 0) {
      setBottomWords(filteredList);
      return;
    }
    const updatedList = numberSort([...filteredList, newWord], false);
    if (updatedList.length > 10) {
      updatedList.splice(10);
    }
    setBottomWords(updatedList);
  };

  const newWordBelongs = (
    words: WordData[],
    newItem: WordData,
    isPositive: boolean
  ): boolean => {
    if (words.length < 10) {
      return true;
    }
    if (words.filter((s) => s.word == newItem.word).length > 0) {
      return true;
    }
    const lastItem = words[words.length - 1];
    if (isPositive) {
      return newItem.count > lastItem.count;
    } else {
      return newItem.count < lastItem.count;
    }
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
          console.log("new payload: ", payload);
          if (payload.eventType === "DELETE") {
            setTopWords([]);
            setBottomWords([]);
          } else if (payload.eventType === "INSERT") {
            const word = { word: payload.new.word, count: payload.new.count };

            if (payload.new.count > 0) {
              setNewWords([
                ...newWords,
                {
                  word: payload.new.word,
                  isPositive: true,
                  id: uuidv4(),
                },
              ]);
              if (newWordBelongs(topWords, word, true)) {
                replaceTopWord(word);
              }
            } else {
              setNewWords([
                ...newWords,
                {
                  word: payload.new.word,
                  isPositive: false,
                  id: uuidv4(),
                },
              ]);
              if (newWordBelongs(bottomWords, word, false)) {
                replaceBottomWord(word);
              }
            }
          } else if (payload.eventType === "UPDATE") {
            const word = { word: payload.new.word, count: payload.new.count };
            setNewWords([
              ...newWords,
              {
                word: payload.new.word,
                isPositive: payload.new.count > payload.old.count,
                id: uuidv4(),
              },
            ]);
            if (newWordBelongs(topWords, word, true)) {
              replaceTopWord(word);
            }

            if (newWordBelongs(bottomWords, word, false)) {
              replaceBottomWord(word);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(wordChannel);
    };
  }, [topWords, bottomWords, setNewWords, replaceTopWord, replaceBottomWord]);

  return (
    <WordsContext.Provider
      value={{ topWords, bottomWords, newWords, killWord }}>
      {children}
    </WordsContext.Provider>
  );
}
