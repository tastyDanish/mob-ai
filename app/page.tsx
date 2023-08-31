"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/page.module.css";
import { addWord } from "@/api";
import { useWords, WordsContextType } from "../context/WordsContext";
import WordList from "@/components/WordList";
import { motion, useAnimate } from "framer-motion";
import SidePanel from "@/components/SidePanel";
import WordPipe from "@/components/WordPipe";

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
    if (inputRef.current) inputRef.current.focus();
  }, [positive]);

  return (
    <main className={styles.main}>
      <SidePanel />
      <div className={styles.artContainer}>
        <WordList
          words={topWords}
          isPositive={true}
        />
        <div className={styles.art}>
          <WordPipe />
        </div>
        <WordList
          words={bottomWords}
          isPositive={false}
        />
      </div>

      <motion.div
        ref={scope}
        className={`${styles.submitContainer} ${
          positive ? styles.create : styles.destroy
        }`}>
        <input
          ref={inputRef}
          value={text}
          onKeyDown={handleKeyDown}
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
