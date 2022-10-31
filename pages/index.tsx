import React from "react";
import styles from "../styles/Home.module.css";
import { SingleConnection } from "../components/SingleConnection";
import { MintNFT } from "../components/MintNFT";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <SingleConnection />
        <MintNFT />
      </main>
    </div>
  );
}
