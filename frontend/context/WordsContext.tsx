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

export interface Game {
  endTime: number;
  topWords: Word[];
  bottomWords: Word[];
  imgUrl: string;
}

export interface WordsContextType {
  topWords: Word[];
  bottomWords: Word[];
  endTime: string | null;
  lastResult: Game | null;
}

const defaultWordsContextValue: WordsContextType = {
  topWords: [],
  bottomWords: [],
  endTime: null,
  lastResult: null,
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
  const [endTime, setEndTime] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<null | Game>(null);

  useEffect(() => {
    const ws = new WebSocket(websocketUrl);

    ws.onmessage = (event) => {
      console.log("received message: ", event);
      const data = JSON.parse(event.data);
      const messageType = data.type;
      const messageData = data.data;

      switch (messageType) {
        case "wordUpdate":
          const { top, bottom } = messageData;
          setTopWords(top);
          setBottomWords(bottom);
          return;
        case "gameEnd":
          setEndTime(messageData);
          return;
        case "lastResult":
          const { result } = messageData;
          setLastResult(result);
          setBottomWords([]);
          setTopWords([]);
          return;
        default:
          console.log("received unknown type");
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WordsContext.Provider
      value={{ topWords, bottomWords, endTime, lastResult }}>
      {children}
    </WordsContext.Provider>
  );
}
