import { motion } from "framer-motion";
import styles from "../styles/wordPipe.module.css";
import { useEffect } from "react";

export interface WordPopUp {
  word: string;
  id: string;
  killWord(wordId: string): void;
}
const WordPopUp = ({ word, id, killWord }: WordPopUp) => {
  const getRandomNumber = (): number => {
    return Math.floor(Math.random() * 350) + 1;
  };

  return (
    <motion.div
      className={`${styles.wordPopUp} ${styles.positiveWord}`}
      initial={{ x: getRandomNumber() }}
      animate={{
        y: -800,
        opacity: 0.4,
        transition: { duration: 5 },
      }}
      onAnimationComplete={() => killWord(id)}>
      {word}
    </motion.div>
  );
};

export default WordPopUp;
