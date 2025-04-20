// src/app/campaign-details/[id]/page.jsx
'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ethers } from "ethers";

import { useStateContext } from "../../../../context";
import { CustomButton, CountBox, Loader } from "../../../../components";
import { calculateBarPercentage, daysLeft } from "../../../../utils";

const CampaignDetails = () => {
  const router = useRouter();
  const { id } = useParams();

  // pull in exactly the helpers we need
  const {
    getCampaigns,
    getDonators,            // on‑chain donator list
    getUserCampaigns,       // fetch campaigns by a given owner
    contract,
    address,
    donateToCampaign: donate // renamed for clarity
  } = useStateContext();

  const [campaign, setCampaign]            = useState(null);
  const [userCampaignCount, setCampaignCount] = useState(0);
  const [donators, setDonators]            = useState([]);
  const [amount, setAmount]                = useState("");
  const [isLoading, setIsLoading]          = useState(false);

  // 1) load the campaign by pId
  useEffect(() => {
    if (!contract || id == null) return;
    (async () => {
      const all = await getCampaigns();
      const found = all.find(c => String(c.pId) === id);
      setCampaign(found || null);
    })();
  }, [contract, id, getCampaigns]);

  // 2) load donators + how many campaigns this creator has
  useEffect(() => {
    if (!contract || !campaign) return;
    (async () => {
      // count how many on‑chain campaigns this owner has created
      const ownerCampaigns = await getUserCampaigns();
      setCampaignCount(ownerCampaigns.filter(c => c.owner === campaign.owner).length);

      // fetch donators
      const dons = await getDonators(campaign.pId);
      setDonators(dons);
    })();
  }, [contract, campaign, address, getUserCampaigns, getDonators]);

  // helper: donate handler
  const handleDonate = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }
    setIsLoading(true);
    try {
      await donate(campaign.pId, amount);
      router.push("/");       // back to home after donate
    } catch (err) {
      console.error("Donation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign) return <Loader />;

  // support IPFS image URIs
  const imageUrl = campaign.image?.startsWith("ipfs://")
    ? campaign.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : campaign.image;

  const progress = calculateBarPercentage(
    ethers.utils.parseEther(campaign.amountCollected).toString(),
    ethers.utils.parseEther(campaign.target).toString()
  );
  const remainingDays = daysLeft(campaign.deadline);

  return (
    <div className="bg-[#121212] text-[#e0e0e0] min-h-screen px-4 py-8">
      {isLoading && <Loader />}

      {/* Banner + Progress */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="campaign"
          className="w-full h-[410px] object-cover rounded-lg border border-[#3a3a43]"
        />
      )}
      <div className="relative w-full h-[5px] bg-[#4a4a4a] mt-2">
        <div
          className="absolute h-full bg-[#67cba0]"
          style={{ width: `${progress}%`, maxWidth: "100%" }}
        />
      </div>

      {/* Stats Row */}
      <div className="flex justify-between items-center w-full mt-4">
        <CountBox title="Category"   value={campaign.category || "—"} />
        {/* <CountBox title="Votes"      value={campaign.votes} /> */}
        <CountBox title="Days Left"  value={remainingDays >= 0 ? remainingDays : "Ended"} />
        <CountBox title="Raised"     value={`${campaign.amountCollected} ETH`} />
        <CountBox title="Donators"   value={donators.length} />
      </div>

      {/* Details + Links + Donate Form */}
      <div className="mt-16 flex flex-col lg:flex-row gap-8">
        {/* Left column */}
        <div className="flex-[2] flex flex-col gap-10">
          {/* Creator */}
          <section>
            <h4 className="text-[#ffcc00] uppercase font-semibold">Creator</h4>
            <div className="mt-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2f32] flex items-center justify-center">
                <img src="/assets/thirdweb.png" alt="user" className="w-2/3 h-2/3" />
              </div>
              <div>
                <p className="font-semibold break-all">{campaign.owner}</p>
                <p className="text-xs text-[#cccccc]">
                  {userCampaignCount} campaign{userCampaignCount !== 1 && "s"}
                </p>
              </div>
            </div>
          </section>

          {/* Story */}
          <section>
            <h4 className="text-[#ffcc00] uppercase font-semibold">Story</h4>
            <p className="mt-4 text-justify leading-7">{campaign.description}</p>
          </section>

          {/* Optional Links */}
          {(campaign.website || campaign.twitter || campaign.linkedin || campaign.documentLink) && (
            <section>
              <h4 className="text-[#ffcc00] uppercase font-semibold">Links</h4>
              <ul className="mt-4 space-y-2">
                {campaign.website && (
                  <li>
                    <a
                      href={campaign.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#a0f0d0]"
                    >
                      Website
                    </a>
                  </li>
                )}
                {campaign.twitter && (
                  <li>
                    <a
                      href={campaign.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#a0f0d0]"
                    >
                      Twitter
                    </a>
                  </li>
                )}
                {campaign.linkedin && (
                  <li>
                    <a
                      href={campaign.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#a0f0d0]"
                    >
                      LinkedIn
                    </a>
                  </li>
                )}
                {campaign.documentLink && (
                  <li>
                    <a
                      href={campaign.documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#a0f0d0]"
                    >
                      Supporting Document
                    </a>
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* Donators */}
          <section>
            <h4 className="text-[#ffcc00] uppercase font-semibold">Donations</h4>
            <div className="mt-4 space-y-2">
              {donators.length > 0 ? (
                donators.map((d, i) => (
                  <div key={`${d.donator}-${i}`} className="flex justify-between">
                    <span>{i + 1}. {d.donator}</span>
                    <span>{d.donation} ETH</span>
                  </div>
                ))
              ) : (
                <p>No donators yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right column: Fund form */}
        <div className="flex-1">
          <h4 className="text-[#ffcc00] uppercase font-semibold">Fund Campaign</h4>
          <div className="mt-4 bg-[#1c1c24] p-4 rounded-lg">
            <input
              type="number"
              placeholder="ETH 0.01"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full py-2 px-3 border border-[#4a4a4a] bg-transparent rounded-lg text-white outline-none"
            />
            <CustomButton
              btnType="button"
              title="Donate"
              styles="w-full mt-4 bg-[#8c6dfd]"
              handleClick={handleDonate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
