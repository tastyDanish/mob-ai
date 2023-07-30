"use client";
import { useState } from "react";
import styles from "../styles/page.module.css";
import { addWord } from "@/api";
import { useWords, WordsContextType } from "../context/WordsContext";

const Home = () => {
  const { topWords, bottomWords }: WordsContextType = useWords();
  const [text, setText] = useState("");

  const handleClick = () => {
    addWord(text, true);
  };

  return (
    <main className={styles.main}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}></input>
      <button onClick={handleClick}>submit word</button>
      <div>
        <h2>Top Words</h2>
        <ul>
          {topWords &&
            topWords.map((word) => <li key={Math.random()}>{word.word}</li>)}
        </ul>
        <h2>Bottom Words</h2>
        <ul>
          {bottomWords &&
            bottomWords.map((word) => <li key={Math.random()}>{word.word}</li>)}
        </ul>
      </div>
    </main>
  );
};

export default Home;
