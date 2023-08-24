import { motion } from "framer-motion";
import styles from "../styles/wordPipe.module.css";
import { useEffect } from "react";

export interface WordPopUp {
  word: string;
  isPositive: boolean;
  killWord(): void;
}
const WordPopUp = ({ word, isPositive, killWord }: WordPopUp) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      killWord();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className={`${styles.wordPopUp} ${
        isPositive ? styles.positiveWord : styles.negativeWord
      }`}
      animate={{ y: isPositive ? -100 : 100, opacity: 1 }}
      exit={{ y: isPositive ? -200 : 200, opacity: 0 }}
      layout>
      {word}
    </motion.div>
  );
};

export default WordPopUp;
