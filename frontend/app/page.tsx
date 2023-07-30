"use client";
import { useEffect, useState } from "react";
import styles from "../styles/page.module.css";
import { fetchData } from "@/api";

const Home = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataFromBackend = async () => {
      const result = await fetchData(""); // Replace 'data' with the endpoint on your backend to fetch data
      console.log("result: ", result);
      setData(result);
    };
    fetchDataFromBackend();
  }, []);

  return (
    <main className={styles.main}>
      <h1>Data from Backend:</h1>
      {data ? <p>{data}</p> : <p>Loading...</p>}
    </main>
  );
};

export default Home;
