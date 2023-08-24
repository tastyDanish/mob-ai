import { AnimatePresence, motion } from "framer-motion";
import styles from "../styles/wordList.module.css";
import { WordData, useWords } from "@/context/WordsContext";

export interface WordListProps {
  words: WordData[];
  isPositive: boolean;
}

const WordList = ({ words, isPositive }: WordListProps) => {
  return (
    <div
      className={`${styles.wordContainer} ${
        isPositive ? styles.positive : styles.negative
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
