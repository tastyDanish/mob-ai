import { AnimatePresence } from "framer-motion";
import styles from "../styles/wordPipe.module.css";
import { useWords } from "@/context/WordsContext";
import WordPopUp from "./wordPopUp";

const WordPipe = () => {
  const { newWords, killWord } = useWords();
  return (
    <div className={styles.wordPipe}>
      {newWords &&
        newWords.map((word) => (
          <WordPopUp
            key={word.id}
            id={word.id}
            word={word.word}
            isPositive={word.isPositive}
            killWord={killWord}
          />
        ))}
    </div>
  );
};

export default WordPipe;
