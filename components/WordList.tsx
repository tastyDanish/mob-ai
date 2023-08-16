import { AnimatePresence, motion } from "framer-motion";
import styles from "../styles/wordList.module.css";
import { Word } from "@/context/WordsContext";
import { useCallback, useEffect, useState } from "react";
import supabase from "@/supabase/supabase";

export interface WordListProps {
  isPositive: boolean;
}

interface WordData {
  word: string;
  count: number;
}

const WordList = ({ isPositive }: WordListProps) => {
  const [words, setWords] = useState<WordData[]>([]);

  function newWordBelongs(newItem: WordData): boolean {
    if (words.length === 0) {
      return true;
    }
    if (words.filter((s) => s.word == newItem.word).length > 0) {
      return true;
    }
    const lastItem = words[words.length - 1];
    return newItem.count > lastItem.count;
  }

  const numberSort = (list: WordData[]) => {
    return list.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      } else {
        return a.word.localeCompare(b.word);
      }
    });
  };

  const replaceWord = (newWord: WordData) => {
    const filteredList = words.filter((s) => s.word !== newWord.word);
    const updatedList = numberSort([...filteredList, newWord]);
    if (updatedList.length > 10) {
      updatedList.splice(10);
    }
    setWords(updatedList);
  };

  useEffect(() => {
    supabase
      .from("words")
      .select("*")
      .filter("count", isPositive ? "gt" : "lte", 0)
      .order("count", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) {
          setWords(
            numberSort(data.map((s) => ({ word: s.word, count: s.count })))
          );
        }
      });
  }, []);

  useEffect(() => {
    const wordChannel = supabase
      .channel(`${isPositive ? "top" : "bottom"}-words`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "words", filter: "count=gt.0" },
        (payload) => {
          if (payload.eventType === "INSERT" && words.length < 10) {
            replaceWord({ word: payload.new.word, count: payload.new.count });
          } else if (payload.eventType === "UPDATE") {
            const newWord = {
              word: payload.new.word,
              count: payload.new.count,
            };
            if (newWordBelongs(newWord))
              replaceWord({ word: payload.new.word, count: payload.new.count });
          } else if (payload.eventType === "DELETE") {
            setWords([]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(wordChannel);
    };
  }, [words]);
  return (
    <div
      className={`${styles.wordContainer} ${
        isPositive ? styles.positive : ""
      }`}>
      <AnimatePresence mode="popLayout">
        {words &&
          words.map((word) => (
            <motion.div
              layout
              className={styles.word}
              key={word.word}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              {word.word}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default WordList;