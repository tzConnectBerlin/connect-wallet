import React from "react";
// import { useWallet } from "../hooks/wallet";
import { useWallet } from "../hooks/use-wallet";
import styles from "../styles/Home.module.css";

export const SingleConnection = () => {
  // const { init, authenticated, walletAddress, logoutWallet, login } = useWallet();
  const { initWallet, logoutWallet, connect, address } = useWallet();

  React.useEffect(() => {
    initWallet();
  }, []);
  const loginWallet = () => () => connect();

  return (
    <div>
      {address ? (
        <>
          <div className={styles.title}>Wallet address is {address.slice(0, 5) + "..." + address.slice(-5)}</div>
          <button
            className={styles.button}
            onClick={logoutWallet}
            textTransform="uppercase"
          >
            disconnect wallet
          </button>
        </>
      ) : (
        <>
          <button className={styles.button} onClick={loginWallet()}>
            connect wallet
          </button>
        </>
      )}
    </div>
  );
};
