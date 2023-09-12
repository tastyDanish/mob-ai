import { AnimatePresence, motion } from "framer-motion";
import styles from "../styles/wordList.module.css";
import { WordData } from "@/context/WordsContext";
import Image from "next/image";

export interface WordListProps {
  words: WordData[];
}

const WordList = ({ words }: WordListProps) => {
  return (
    <div className={styles.wordContainer}>
      <span>TOP WORDS</span>
      <AnimatePresence mode="popLayout">
        {words &&
          words.map((word, i) => (
            <motion.div
              layout
              className={styles.word}
              key={word.word}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ backgroundColor: i < 5 ? "lightgreen" : "lightblue" }}>
              {word.word}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default WordList;
