import React from "react";
import { useWallet } from "../hooks/wallet";
import useEventCallback from '../utils/event-callback'
import styles from "../styles/Home.module.css";

export const Wallet = () => {
  const { init, authenticated, walletAddress, logout, login } = useWallet();

  React.useEffect(() => {
    init();
  }, []);
  const loginWallet = useEventCallback((isSocial) => () => login(isSocial));

  return (
    <div>
      {authenticated && (
        <div className={styles.title}>Wallet address is {walletAddress}</div>
      )}

      {authenticated ? (
        <button
          className={styles.button}
          onClick={logout}
          textTransform="uppercase"
        >
          disconnect wallet
        </button>
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
