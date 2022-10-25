import {NetworkType, ColorMode} from '@airgap/beacon-sdk'
import {BeaconWallet} from '@taquito/beacon-wallet'
import {TezosToolkit, MichelCodecPacker} from '@taquito/taquito'
import {NETWORK, RPC_URL} from '../hooks/config'
import {KukaiEmbed, Networks} from 'kukai-embed'

export let tezos
export let beaconWallet = null
export let kukaiEmbed

export const initTezos = () => {
  tezos = new TezosToolkit(RPC_URL)
  tezos.setPackerProvider(new MichelCodecPacker())
}

export const initBeacon = () => {
  if (beaconWallet !== null) {
    return beaconWallet
  }

  try {
    const options = {
      name: "test",
      iconUrl: 'https://tezostaquito.io/img/favicon.png',
      preferredNetwork: NetworkType[NETWORK],
    }

    beaconWallet = new BeaconWallet(options)
  } catch (e) {
    console.error('initBeacon', e)
  }
  return beaconWallet
}

export const initKukai = () => {
  if (!!kukaiEmbed) {
    return kukaiEmbed
  }

  try {
    kukaiEmbed = new KukaiEmbed({
      net: Networks.ghostnet,
      icon: false,
    })

    if (!kukaiEmbed.initialized) kukaiEmbed.init();
  } catch (e) {
    console.error('initKukai', e)
  }

  return kukaiEmbed
}

export const setWalletProvider = (wallet) => {
  tezos && tezos.setProvider({wallet})
}
