"use client";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Word {
  word: string;
  count: number;
}

export interface WordsContextType {
  topWords: Word[];
  bottomWords: Word[];
}

const defaultWordsContextValue: WordsContextType = {
  topWords: [],
  bottomWords: [],
};

export const WordsContext = createContext<WordsContextType>(
  defaultWordsContextValue
);

export function useWords() {
  return useContext(WordsContext);
}

const websocketUrl = "ws://127.0.0.1:5002";

export interface WordsProviderProps {
  children: ReactNode;
}

export function WordsProvider({ children }: WordsProviderProps) {
  const [topWords, setTopWords] = useState<Word[]>([]);
  const [bottomWords, setBottomWords] = useState<Word[]>([]);

  useEffect(() => {
    const ws = new WebSocket(websocketUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { top, bottom } = data;
      setTopWords(top);
      setBottomWords(bottom);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WordsContext.Provider value={{ topWords, bottomWords }}>
      {children}
    </WordsContext.Provider>
  );
}
