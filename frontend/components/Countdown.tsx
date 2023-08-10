"use client";
import { useEffect, useState } from "react";
import styles from "../styles/countdown.module.css";

export interface CountDownProps {
  targetTimestamp: number | null;
}

const CountDown = ({ targetTimestamp }: CountDownProps) => {
  const [remainingTime, setRemainingTime] = useState(
    targetTimestamp ? targetTimestamp : 0
  );

  useEffect(() => {
    // Update the countdown every second
    const timerInterval = setInterval(() => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (targetTimestamp) {
        const newRemainingTime = targetTimestamp - currentTimestamp;

        // Check if the countdown is finished
        if (newRemainingTime < 0) {
          clearInterval(timerInterval);
        } else {
          setRemainingTime(newRemainingTime);
        }
      }
    }, 1000);

    // Clean up the interval on unmount
    return () => clearInterval(timerInterval);
  }, [targetTimestamp]);

  // Calculate remaining hours, minutes, and seconds
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  return (
    targetTimestamp && (
      <div className={styles.countdown}>
        {minutes}m {seconds}s
      </div>
    )
  );
};

export default CountDown;
