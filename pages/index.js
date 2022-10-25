import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { SingleConnection } from "../components/SingleConnection";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <SingleConnection />
      </main>
    </div>
  );
}
