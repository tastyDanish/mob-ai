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
    let randomNumber = Math.floor(Math.random() * 350) + 1;
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
        y: isPositive ? -800 : 800,
        opacity: 0.4,
        transition: { duration: 5 },
      }}
      onAnimationComplete={() => killWord(id)}>
      {word}
    </motion.div>
  );
};

export default WordPopUp;
