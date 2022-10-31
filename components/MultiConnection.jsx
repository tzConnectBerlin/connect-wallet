import React from "react";
import { useWallet } from "../hooks/wallet";
import styles from "../styles/Home.css";

export const MultiConnection = () => {
  const { init, authenticated, walletAddress, logoutWallet, login } =
    useWallet();

  React.useEffect(() => {
    init();
  }, []);
  const loginWallet = (isSocial) => () => login(isSocial);

  return (
    <div>
      {authenticated ? (
        <>
          <div className={styles.title}>Wallet address is {walletAddress}</div>
          <button className={styles.button} onClick={logoutWallet}>
            disconnect wallet
          </button>
        </>
      ) : (
        <>
          <button className={styles.button} onClick={loginWallet(true)}>
            social login
          </button>
          <button className={styles.button} onClick={loginWallet(false)}>
            connect wallet
          </button>
        </>
      )}
    </div>
  );
};
