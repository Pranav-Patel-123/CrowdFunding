import React from "react";
import { daysLeft } from "../utils";

const FundCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  category,
  votes,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);

  // Support IPFS URLs if needed
  const imageUrl = image?.startsWith("ipfs://")
    ? image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : image;

  return (
    <div
      className="sm:w-[350px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer"
      onClick={handleClick}
    >
      {/* Campaign image */}
      <img
        src={imageUrl}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-[15px]"
      />

      <div className="flex flex-col p-4">
        {/* Category tag */}
        <div className="flex flex-row items-center mb-[18px]">
          <img
            src="/assets/type.svg"
            alt="tag"
            className="w-[17px] h-[17px] object-contain"
          />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">
            {category}
          </p>
        </div>

        {/* Title & description */}
        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white leading-[26px]">
            {title}
          </h3>
          <p className="mt-[15px] font-epilogue font-normal text-[#808191] leading-[18px] truncate">
            {description}
          </p>
        </div>

        {/* Raised / target & days left */}
        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {amountCollected} ETH
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Raised of {(target / 1e18).toFixed(2)} ETH
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {remainingDays}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Days Left
            </p>
          </div>
        </div>

      

        {/* Owner avatar & address */}
        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img
              src="/assets/thirdweb.png"
              alt="user"
              className="w-[24px] h-[24px] object-contain"
            />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
            by <span className="text-[#b2b3bd]">{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
