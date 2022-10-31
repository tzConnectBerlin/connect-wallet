import React, { useState } from "react";
import Image from "next/image";
import { useWallet } from "../hooks/use-wallet";
import { getAccount } from "../api/tzkt";
import styles from "../styles/Home.module.css";

interface TokenData {
  name: string;
  thumbnailUri: string;
  artifactUri: string;
}

export const SingleConnection = () => {
  const { initWallet, logoutWallet, connect, address } = useWallet();

  const [tokens, setTokens] = React.useState<TokenData[]>([]);

  React.useEffect(() => {
    initWallet();
  });

  const getToken = (accountData: any) => {
    const tokensUri = accountData.map((d: any) => {
      return {
        name: d.token.metadata.name,
        thumbnailUri: d.token.metadata.thumbnailUri.replace("ipfs://", ""),
        artifactUri: d.token.metadata.artifactUri.replace("ipfs://", ""),
      };
    });
    console.log(tokensUri);
    return tokensUri;
  };

  const fetchData = React.useCallback(async () => {
    if (!!!address) return;
    const data = await getAccount(address);
    if (data) {
      console.log(data);
      const t = getToken(data);
      setTokens(t);
    }
  }, [address]);

  React.useEffect(() => {
    if (address) {
      fetchData().catch(console.error);
    }
  }, [address, fetchData]);

  const loginWallet = async () => {
    await connect();
  };

  return (
    <div>
      <div className={styles.header}>
        {address ? (
          <>
            <button className={styles.button} onClick={logoutWallet}>
              disconnect wallet
            </button>
            <div className={styles.addr}>
              Wallet address is{" "}
              {address.slice(0, 5) + "..." + address.slice(-5)}
            </div>
          </>
        ) : (
          <>
            <button className={styles.button} onClick={loginWallet}>
              connect wallet
            </button>
          </>
        )}
      </div>
      {address && (
        <>
          {tokens && tokens.length > 0 ? (
            <div className={styles.tokenContainer}>
              {tokens.map((token, i) => (
                <a
                  key={i}
                  className={styles.token}
                  href={`https://ipfs.io/ipfs/${token.artifactUri}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={`https://ipfs.io/ipfs/${token.thumbnailUri}`}
                    alt={token.name}
                    width={80}
                    height={80}
                  />
                </a>
              ))}
            </div>
          ) : (
            <div className={styles.title}>There is any NFTs</div>
          )}
        </>
      )}


    </div>
  );
};
