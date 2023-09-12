import React, { useEffect, useState } from "react";
import styles from "../styles/countdown.module.css";
import cronParser from "cron-parser";
import supabase from "@/supabase/supabase";

interface CronCountdownProps {
  cronExpression: string;
}

const CronCountDown = ({ cronExpression }: CronCountdownProps) => {
  const [progress, setProgress] = useState<number>(0);
  const [seedPhrase, setSeedPhrase] = useState("");

  const GetProgress = () => {
    const interval = cronParser.parseExpression(cronExpression);
    const nextDate = interval.next().toDate();

    const now = new Date();
    const timeDiff = nextDate.getTime() - now.getTime();
    const totalTime = interval.next().toDate().getTime() - nextDate.getTime();
    const progress = Math.max(
      0,
      Math.min(100, (1 - timeDiff / totalTime) * 100)
    );
    return progress;
  };

  useEffect(() => {
    supabase
      .from("seed")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSeedPhrase(data.phrase ?? "");
        }
      });

    const seedChannel = supabase.channel("seed-phrase").on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "words",
      },
      (payload) => {
        console.log("change received: ", payload);
      }
    );
  });

  useEffect(() => {
    try {
      setProgress(GetProgress());

      const updateProgress = () => {
        const newProgress = GetProgress();
        if (newProgress >= 100) {
          setProgress(0);
        } else {
          setProgress(newProgress);
        }
      };

      const progressInterval = setInterval(updateProgress, 1000);

      return () => {
        clearInterval(progressInterval);
      };
    } catch (error) {
      console.error("Invalid cron expression:", error);
    }
  }, [cronExpression]);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.seedPhrase}>Lets draw {seedPhrase}</div>
      <div
        className={styles.progress}
        style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default CronCountDown;
