import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { addWord } from "@/api";
import styles from "../styles/wordPipe.module.css";
import { useWords } from "@/context/WordsContext";
import WordPopUp from "./wordPopUp";
import { useEffect, useRef, useState } from "react";

const WordPipe = () => {
  const { newWords, killWord } = useWords();
  const [text, setText] = useState("");
  const [scope, animate] = useAnimate();
  const [buttonScope, animateButton] = useAnimate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const submit = () => {
    addWord(text);
    setText("");
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submit();
    }
  };

  return (
    <div className={styles.wordPipe}>
      {newWords &&
        newWords.map((word) => (
          <WordPopUp
            key={word.id}
            id={word.id}
            word={word.word}
            killWord={killWord}
          />
        ))}
      <div
        ref={scope}
        className={styles.submitContainer}>
        <input
          ref={inputRef}
          value={text}
          onKeyUp={handleKeyUp}
          onChange={(e) => setText(e.target.value)}></input>
        <div
          ref={buttonScope}
          className={styles.submitButton}>
          <span>{"create"}</span>
        </div>
      </div>
    </div>
  );
};

export default WordPipe;
