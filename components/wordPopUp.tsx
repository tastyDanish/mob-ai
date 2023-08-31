import { motion } from "framer-motion";
import styles from "../styles/wordPipe.module.css";
import { useEffect } from "react";

export interface WordPopUp {
  word: string;
  id: string;
  isPositive: boolean;
  killWord(wordId: string): void;
}
const WordPopUp = ({ word, isPositive, id, killWord }: WordPopUp) => {
  const getRandomNumber = (isNegative: boolean): number => {
    let randomNumber = Math.floor(Math.random() * 150) + 1;
    if (!isNegative) {
      randomNumber *= -1;
    }
    return randomNumber;
  };

  return (
    <motion.div
      className={`${styles.wordPopUp} ${
        isPositive ? styles.positiveWord : styles.negativeWord
      }`}
      initial={{ x: getRandomNumber(isPositive) }}
      animate={{
        y: isPositive ? -300 : 300,
        opacity: 0,
        transition: { duration: 3 },
      }}
      onAnimationComplete={() => killWord(id)}>
      {word}
    </motion.div>
  );
};

export default WordPopUp;
