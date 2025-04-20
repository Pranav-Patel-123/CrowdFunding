// src/context/index.jsx
'use client';

import React, { createContext, useContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useDisconnect,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import ABI from "../abi.json";

const StateContext = createContext();
const CONTRACT_ADDRESS = "0xd6805d7b49fd9cdf9ffa0199acb6bc9547f90861";

const categoriesList = [
  "Education",
  "Health",
  "Environment",
  "Arts & Culture",
  "Technology",
];

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(CONTRACT_ADDRESS, ABI);
  const { mutateAsync: createCampaignTx } = useContractWrite(contract, "createCampaign");

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  const createCampaign = async (form) => {
    if (!address) throw new Error("Wallet not connected");
    const targetWei = ethers.utils.parseEther(form.target.toString());
    const deadlineTs = Math.floor(new Date(form.deadline).getTime() / 1000);

    const tx = await createCampaignTx({
      args: [
        address,
        form.title,
        form.description,
        targetWei,
        deadlineTs,
        form.image,
        form.category,
        form.website || "",
        form.twitter || "",
        form.linkedin || "",
        form.documentLink || "",
      ],
    });
    const receipt = tx.receipt;
    const event = receipt.events?.find(e => e.event === "CampaignCreated");
    return event?.args?.campaignId.toString();
  };

  const getCampaigns = async () => {
    if (!contract) return [];
    const onChain = await contract.call("getCampaigns");
    return onChain.map((c, i) => ({
      pId: i,
      owner: c.owner,
      title: c.title,
      description: c.description,
      target: ethers.utils.formatEther(c.target.toString()),
      deadline: c.deadline.toNumber() * 1000,
      amountCollected: ethers.utils.formatEther(c.amountCollected.toString()),
      image: c.image,
      votes: c.votes.toNumber(),
      category: c.category,
      website: c.website,
      twitter: c.twitter,
      linkedin: c.linkedin,
      documentLink: c.documentLink,
    }));
  };

  // NEW: Sum votes across all campaigns
  const getTotalVotes = async () => {
    if (!contract) return 0;
    const all = await getCampaigns();
    return all.reduce((sum, c) => sum + c.votes, 0);
  };

  const getUserCampaigns = async () => {
    const all = await getCampaigns();
    return all.filter(c => c.owner.toLowerCase() === address?.toLowerCase());
  };

  const donateToCampaign = async (pId, amount) => {
    if (!contract) return;
    return contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount.toString()),
    });
  };

  const getDonators = async (pId) => {
    if (!contract) return [];
    const [donators, donations] = await contract.call("getDonators", [pId]);
    return donators.map((d, i) => ({
      donator: d,
      donation: ethers.utils.formatEther(donations[i].toString()),
    }));
  };

  const getWinnersByCategory = async () => {
    if (!contract) return [];
    const winners = await contract.call("getWinnersByCategory");
    return winners.map(w => ({
      category: w.category,
      title: w.title,
      owner: w.owner,
      amountCollected: ethers.utils.formatEther(w.amountCollected.toString()),
    }));
  };

  const getCategories = async () => categoriesList;

  const getCampaignsByCategory = async (category) => {
    const all = await getCampaigns();
    return all.filter(c => c.category === category);
  };

  return (
    <StateContext.Provider
      value={{
        contract,               // ← now exposed
        address,
        connect,
        disconnect,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donateToCampaign,
        getDonators,
        getWinnersByCategory,
        getCategories,
        getCampaignsByCategory,
        getTotalVotes,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
