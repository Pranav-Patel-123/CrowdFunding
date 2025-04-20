'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FundCard from './FundCard';

const DisplayCampaigns = ({ isLoading, campaigns, title }) => {
  const router = useRouter();

  const handleNavigate = (campaign) => {
    router.push(`/campaign-details/${encodeURIComponent(campaign.pId)}`);
  };

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#282c34] to-[#1c1c24] rounded-lg shadow-md overflow-hidden">
      <h1 className="font-semibold text-2xl text-white mb-6 border-b border-[#8c6dfd] pb-2">
        {title} ({campaigns.length})
      </h1>

      {isLoading ? (
        <div className="flex justify-center">
          <img
            src="/assets/loader.svg"
            alt="loader"
            className="w-20 h-20 object-contain animate-spin"
          />
        </div>
      ) : campaigns.length === 0 ? (
        <p className="text-lg text-center text-gray-400">
          No campaigns available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <FundCard
              key={campaign.pId}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-[#8c6dfd] italic text-base">
          Support a campaign today!
        </p>
      </div>
    </div>
  );
};

export default DisplayCampaigns;
