"use client";
import Image from "next/image";
import { useEffect, useRef, useState, MouseEvent } from "react";
import styles from "../styles/sidePanel.module.css";
import { useAnimate } from "framer-motion";
import supabase from "@/supabase/supabase";

interface GameResult {
  imgUrl: string;
  topWords: string[];
  bottomWords: string[];
}

const base =
  "https://ravdcnteubpeotmrmfgi.supabase.co/storage/v1/object/public/generated-images/";

const SidePanel = () => {
  const [gameResult, setGameResult] = useState<GameResult | null>();
  const [expanded, setExpanded] = useState(false);
  const [scope, animate] = useAnimate();
  const isInitialRender = useRef(true);

  useEffect(() => {
    supabase
      .from("game")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data)
          setGameResult({
            imgUrl: data.img_url!,
            topWords: data.top_words!,
            bottomWords: data.bottom_words!,
          });
      });

    const gameChannel = supabase
      .channel("gameResults")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "game" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setGameResult({
              imgUrl: payload.new.img_url!,
              topWords: payload.new.top_words!,
              bottomWords: payload.new.bottom_words!,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    animate(scope.current, { x: expanded ? 800 : 0 });
  }, [expanded]);

  const handleClick = (
    event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLDivElement>,
    setTo: boolean
  ) => {
    event.stopPropagation();
    setExpanded(setTo);
  };

  return (
    <div
      className={styles.sidePanel}
      ref={scope}
      onClick={(e) => handleClick(e, true)}>
      {gameResult == null ? (
        <div>loading...</div>
      ) : (
        <img
          alt={"this is what you wanted"}
          src={`${base}${gameResult.imgUrl}`}
        />
      )}
      <button onClick={(e) => handleClick(e, false)}>close</button>
    </div>
  );
};

export default SidePanel;
