import React from "react";
import { NetworkType } from "@airgap/beacon-sdk";
import {
  initKukai,
  initTezos,
  initWallet,
  setWalletProvider,
} from "../utils/wallet";

const NETWORK = "MAINNET";

export function useWallet() {
  let beaconWallet;
  let kukaiEmbed;

  const [authenticated, setAuthenticated] = React.useState(false);
  const [kukaiUserInfo, setKukaiUserInfo] = React.useState();
  const [beaconUserInfo, setBeaconUserInfo] = React.useState();
  const [isKukai, setIsKukai] = React.useState(true);
  const [wallet, setWallet] = React.useState();
  const [walletAddress, setWalletAddress] = React.useState();

  return { init, authenticated, walletAddress, logout, login };

  async function init() {
    initTezos();
    if (!beaconWallet) beaconWallet = initWallet();
    if (!kukaiEmbed) kukaiEmbed = initKukai();

    setWalletProvider(beaconWallet);
    await Promise.all([checkBeaconAuth(), checkKukaiAuth()]);
  }

  async function logout() {
    isKukai
      ? await kukaiEmbed?.logout()
      : await beaconWallet?.clearActiveAccount();
    setAuthenticated(undefined);
    setIsKukai(undefined);
    setWallet(undefined);
    setKukaiUserInfo(undefined);
    setBeaconUserInfo(undefined);
  }

  async function login(isSocial) {
    // if (authenticated) return;
    isSocial ? await kukaiLogin() : await beaconLogin();
  }

  async function checkBeaconAuth() {
    if (authenticated) return;
    try {
      const account = await beaconWallet.client.getActiveAccount();

      if (account) {
        setAuthenticated(true);
        setIsKukai(false);
        setWallet(await beaconWallet.getPKH());
        setWalletAddress(
          account.address.slice(0, 5) + "..." + account.address.slice(-5)
        );
      }
    } catch (e) {
      console.error("checkBeaconAuth", e);
    }
  }

  async function checkKukaiAuth() {
    if (authenticated) return;
    try {
      if (!kukaiEmbed.initialized) {
        await kukaiEmbed.init();
      }
      if (kukaiEmbed.user) {
        setKukaiUserInfo(kukaiEmbed.user);
        setAuthenticated(true);
        setIsKukai(true);
        setWallet(kukaiUserInfo.pkh);
        setWalletAddress(kukaiEmbed.user.pkh.slice(0, 5) + "..." + kukaiEmbed.user.pkh.slice(-5));
      }
    } catch (e) {
      console.error("checkKukaiAuth", e);
    }
  }

  async function beaconLogin() {
    if (!beaconWallet) return;

    try {
      const beacon = await beaconWallet.client.requestPermissions({
        network: {
          type: NetworkType[NETWORK],
        },
      });
      setAuthenticated(true);
      setIsKukai(false);
      setWallet(await beaconWallet.getPKH());
      setWalletAddress(
        beacon.address.slice(0, 5) + "..." + beacon.address.slice(-5)
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function kukaiLogin() {
    try {
      if (!kukaiEmbed.initialized) {
        await kukaiEmbed.init();
      }

      if (!kukaiEmbed?.user) {
        const kukai = await kukaiEmbed.login();
        console.log(kukai);
        setKukaiUserInfo(kukaiEmbed.user);
        setAuthenticated(true);
        setIsKukai(true);
        setWallet(kukaiUserInfo.pkh);
        setWalletAddress(kukaiUserInfo.pkh.slice(0, 5) + "..." + kukaiUserInfo.pkh.slice(-5));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
