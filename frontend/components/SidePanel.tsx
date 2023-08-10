"use client";
import { useEffect, useRef, useState, MouseEvent } from "react";
import styles from "../styles/sidePanel.module.css";
import { useAnimate } from "framer-motion";

const SidePanel = () => {
  const [expanded, setExpanded] = useState(false);
  const [scope, animate] = useAnimate();
  const isInitialRender = useRef(true);

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
      <button onClick={(e) => handleClick(e, false)}>close</button>
    </div>
  );
};

export default SidePanel;
