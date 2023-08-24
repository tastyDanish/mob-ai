import { AnimatePresence } from "framer-motion";
import styles from "../styles/wordPipe.module.css";
import { useWords } from "@/context/WordsContext";
import WordPopUp from "./wordPopUp";

const WordPipe = () => {
  const { newWords, killWord } = useWords();
  return (
    <div className={styles.wordPipe}>
      <AnimatePresence>
        {newWords &&
          newWords.map((word) => (
            <WordPopUp
              key={word.id}
              word={word.word}
              isPositive={word.isPositive}
              killWord={() => killWord(word.id)}
            />
          ))}
      </AnimatePresence>
    </div>
  );
};

export default WordPipe;
