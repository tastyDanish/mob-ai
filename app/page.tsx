"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/page.module.css";
import { useWords, WordsContextType } from "../context/WordsContext";
import WordList from "@/components/WordList";
import { motion, useAnimate } from "framer-motion";
import SidePanel from "@/components/SidePanel";
import WordPipe from "@/components/WordPipe";
import CronCountDown from "@/components/CronCountDown";

const Home = () => {
  const { topWords, bottomWords }: WordsContextType = useWords();

  return (
    <main className={styles.main}>
      <CronCountDown cronExpression="*/2 * * * *" />
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
    </main>
  );
};

export default Home;
