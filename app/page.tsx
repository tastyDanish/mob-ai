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
  const { topWords }: WordsContextType = useWords();

  return (
    <main className={styles.main}>
      <CronCountDown cronExpression="* * * * *" />
      <SidePanel />
      <div className={styles.artContainer}>
        <WordList words={topWords} />
        <div className={styles.art}>
          <WordPipe />
        </div>
      </div>
    </main>
  );
};

export default Home;
