import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

const WalletConnect = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  let web3Modal;

  // Initialize Web3Modal (this could also be moved to a separate utility file)
  useEffect(() => {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: {
        // Configure your wallet providers here, for example:
        // walletconnect: { package: WalletConnectProvider, options: { infuraId: "YOUR_INFURA_ID" } }
      }
    });
    // Automatically connect if a cached provider exists.
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWallet = async () => {
    try {
      // Open wallet modal and get provider instance
      const instance = await web3Modal.connect();
      const providerInstance = new ethers.providers.Web3Provider(instance);
      const signerInstance = providerInstance.getSigner();
      const address = await signerInstance.getAddress();
      setProvider(providerInstance);
      setSigner(signerInstance);
      setAccount(address);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const disconnectWallet = async () => {
    try {
      // If the underlying provider supports a disconnect method, call it
      if (provider && provider.provider && provider.provider.disconnect) {
        await provider.provider.disconnect();
      }
      // Clear any cached wallet information
      await web3Modal.clearCachedProvider();
      setProvider(null);
      setSigner(null);
      setAccount('');
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    }
  };

  const changeWallet = async () => {
    // Change wallet by first disconnecting and then reconnecting
    await disconnectWallet();
    await connectWallet();
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Connected as: {account}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
          <button onClick={changeWallet}>Change Wallet</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletConnect;
