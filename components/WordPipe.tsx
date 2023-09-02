import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { addWord } from "@/api";
import styles from "../styles/wordPipe.module.css";
import { useWords } from "@/context/WordsContext";
import WordPopUp from "./wordPopUp";
import { useEffect, useRef, useState } from "react";

const WordPipe = () => {
  const { newWords, killWord } = useWords();
  const [text, setText] = useState("");
  const [positive, setPositive] = useState(true);
  const [scope, animate] = useAnimate();
  const [buttonScope, animateButton] = useAnimate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const submit = () => {
    addWord(text, positive);
    setText("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setPositive(!positive);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submit();
    }
  };

  useEffect(() => {
    animate(scope.current, {
      x: positive ? -100 : 100,
    });
    animateButton(buttonScope.current, {
      x: positive ? -150 : 150,
    });

    if (inputRef.current) inputRef.current.focus();
  }, [positive]);

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
      <motion.div
        ref={scope}
        className={styles.submitContainer}>
        <input
          ref={inputRef}
          value={text}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onChange={(e) => setText(e.target.value)}></input>
        <motion.div
          ref={buttonScope}
          className={styles.submitButton}>
          <span>{positive ? "create" : "destroy"}</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WordPipe;
