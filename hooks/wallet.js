import React from "react";
import { NetworkType } from "@airgap/beacon-sdk";
import {
  initKukai,
  initTezos,
  initBeacon,
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
  const [pkh, setPkh] = React.useState();
  const [walletAddress, setWalletAddress] = React.useState();

  async function init() {
    initTezos();
    if (!beaconWallet) beaconWallet = await initBeacon();
    if (!kukaiEmbed) kukaiEmbed = await initKukai();

    setWalletProvider(beaconWallet);

    await Promise.all([checkKukaiAuth(), checkBeaconAuth()]);
  }

  const logoutWallet = async () => {
    isKukai && kukaiEmbed
      ? await kukaiEmbed.logout()
      : beaconWallet && (await beaconWallet.clearActiveAccount());

    setAuthenticated(false);
    setIsKukai(undefined);
    setWallet(undefined);
    setKukaiUserInfo(undefined);
    setBeaconUserInfo(undefined);
    setWalletAddress(undefined);
  };

  async function login(isSocial) {
    if (authenticated) return;
    isSocial ? await kukaiLogin() : await beaconLogin();
  }

  const walletAddressGenerator = () => {
    console.log('wallet address Generator:')
    console.log(wallet);
  };

  async function checkBeaconAuth() {
    if (authenticated) return;

    try {
      const account = await beaconWallet.client.getActiveAccount();
      console.log(account);

      if (account) {
        setAuthenticated(true);
        setIsKukai(false);
        setWallet(await beaconWallet.getPKH());
        setWalletAddress(
          account.address.slice(0, 5) + "..." + account.address.slice(-5)
        );
        console.log("checkBeaconAuth");
        walletAddressGenerator();
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
        setWalletAddress(
          kukaiEmbed.user.pkh.slice(0, 5) +
            "..." +
            kukaiEmbed.user.pkh.slice(-5)
        );
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
      console.log(beacon);
      const w = await beaconWallet.getPKH();
      setWallet(w);
      setAuthenticated(true);
      setIsKukai(false);
      setWalletAddress(
        beacon.address.slice(0, 5) + "..." + beacon.address.slice(-5)
      );
      walletAddressGenerator();
    } catch (error) {
      console.error(error);
    }
  }

  async function kukaiLogin() {
    try {
      if (!kukaiEmbed.initialized) {
        await kukaiEmbed.init();
      }

      if (!kukaiEmbed.user) {
        await kukaiEmbed.login();
        setKukaiUserInfo(kukaiEmbed.user);
        setAuthenticated(true);
        setIsKukai(true);
        setWallet(kukaiUserInfo.pkh);
        setWalletAddress(
          kukaiUserInfo.pkh.slice(0, 5) + "..." + kukaiUserInfo.pkh.slice(-5)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return { init, authenticated, walletAddress, logoutWallet, login };
}
