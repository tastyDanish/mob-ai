"use client";
import { LegacyRef, useEffect, useRef, useState } from "react";
import styles from "../styles/page.module.css";
import { addWord } from "@/api";
import { useWords, WordsContextType } from "../context/WordsContext";
import WordList from "@/components/WordList";
import { motion, useAnimate } from "framer-motion";

const Home = () => {
  const { topWords, bottomWords }: WordsContextType = useWords();
  const [text, setText] = useState("");
  const [positive, setPositive] = useState(true);
  const [scope, animate] = useAnimate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const submit = () => {
    addWord(text, positive);
    setText("");
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
    if (inputRef.current) inputRef.current.focus();
  }, [positive]);

  return (
    <main className={styles.main}>
      <div className={styles.artContainer}>
        <div onClick={() => setPositive(true)}>
          <h2>Top Words</h2>
          <WordList
            words={topWords}
            isPositive={true}
          />
        </div>
        <div style={{ height: 200, width: 0, background: "grey" }} />
        <div onClick={() => setPositive(false)}>
          <h2>Bottom Words</h2>
          <WordList
            words={bottomWords}
            isPositive={false}
          />
        </div>
      </div>

      <motion.div
        ref={scope}
        className={`${styles.submitContainer} ${
          positive ? styles.create : styles.destroy
        }`}>
        <input
          ref={inputRef}
          value={text}
          onKeyUp={handleKeyUp}
          onChange={(e) => setText(e.target.value)}></input>
        <button
          type="submit"
          onClick={submit}>
          submit word
        </button>
      </motion.div>
    </main>
  );
};

export default Home;
