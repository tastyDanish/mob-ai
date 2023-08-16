"use client";
import { useEffect, useState } from "react";

export interface CountDownProps {
  timestamp: string;
}

const CountDown = ({ timestamp }: CountDownProps) => {
  const targetTime =
    new Date(timestamp).getTime() - new Date().getTimezoneOffset() * 60000;
  const currentTime = new Date().getTime();
  const timeRemaining = Math.max(targetTime - currentTime, 0);
  const [timeLeft, setTimeLeft] = useState<number>(timeRemaining);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeRemaining = Math.max(targetTime - currentTime, 0);

      if (timeRemaining <= 0) {
        clearInterval(intervalId);
      }

      setTimeLeft(timeRemaining);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timestamp]);

  const formatTime = (time: number): string => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);

    return `${minutes}m ${seconds}s`;
  };

  return <div>{timeLeft > 0 && <p>Countdown: {formatTime(timeLeft)}</p>}</div>;
};

export default CountDown;
