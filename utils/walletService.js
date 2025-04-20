import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

let web3Modal;

export const initWeb3Modal = () => {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions: {
      // Configure wallet providers here.
    }
  });
};

export const connectWallet = async () => {
  if (!web3Modal) {
    initWeb3Modal();
  }
  try {
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    return { provider, signer, account };
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
};

export const disconnectWallet = async () => {
  if (web3Modal) {
    try {
      if (web3Modal.cachedProvider) {
        // if using a provider that supports disconnect:
        // await provider.provider.disconnect();
      }
      await web3Modal.clearCachedProvider();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      throw error;
    }
  }
};
