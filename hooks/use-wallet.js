import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { RPC_URL } from "./config";

export function useWallet() {
  const [initialized, setInit] = useState(false);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState();

  return {
    initialized,
    address,
    error,
    loading,
    connect,
    initWallet,
    getAddress,
    logoutWallet,
  };

  async function connect() {
    setLoading(true);
    try {
      const userAddress = await getAddress();
      setAddress(userAddress);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function initWallet() {
    const options = {
      name: "sample",
    };

    const Tezos = new TezosToolkit(RPC_URL);
    const beaconWallet = new BeaconWallet(options);
    setWallet(beaconWallet);

    Tezos.setWalletProvider(beaconWallet);
    setInit(true);
  }

  async function getAddress() {
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      return activeAccount.address;
    } else {
      const permissions = await wallet.client.requestPermissions();
      return permissions.address;
    }
  }

  async function logoutWallet() {
    if (address) await wallet.clearActiveAccount();

    setWallet(undefined);
    setAddress(null);
  }
}
