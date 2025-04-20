import React, { useState } from 'react';
import { ethers } from 'ethers';
// Ensure the ABI file is correctly referenced or imported as needed.
import CampaignABI from '../abi/Campaign.json';

const DonationForm = ({ campaignAddress, signer }) => {
  const [donationAmount, setDonationAmount] = useState('');

  const donate = async () => {
    if (!signer) {
      console.error("Wallet not connected");
      return;
    }
    try {
      // Create a contract instance with signer to send the transaction
      const campaignContract = new ethers.Contract(campaignAddress, CampaignABI, signer);

      const tx = await campaignContract.donate({
        value: ethers.utils.parseEther(donationAmount)
      });
      console.log("Transaction submitted, hash:", tx.hash);
      await tx.wait();
      console.log("Donation successful!");
    } catch (err) {
      console.error("Donation failed:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        placeholder="Enter donation in ETH"
      />
      <button onClick={donate}>Donate</button>
    </div>
  );
};

export default DonationForm;
