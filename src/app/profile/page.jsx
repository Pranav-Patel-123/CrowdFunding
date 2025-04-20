"use client";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../../context";
import { DisplayCampaigns } from "../../../components";
import { CustomButton } from "../../../components";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns, deleteUserCampaigns } =
    useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const campaigns = await getUserCampaigns();
      setCampaigns(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      setIsLoading(true);
      try {
        await deleteUserCampaigns(campaignId);
        fetchCampaigns(); // Refresh campaigns after deletion
      } catch (error) {
        console.error("Error deleting campaign:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <div style={styles.container}>
      <h1 className="text-[#e0e0e0] text-2xl mb-4">My Campaigns</h1>
      <DisplayCampaigns
        isLoading={isLoading}
        campaigns={campaigns.map(campaign => ({
          ...campaign,
          handleDelete: () => handleDeleteCampaign(campaign.pId), // Add delete handler
        }))}
        title="My Campaigns"
      />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#e0e0e0',
  },
};

export default Profile;
