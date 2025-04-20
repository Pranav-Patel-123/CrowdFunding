'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useStateContext } from '../context';
import { CustomButton } from './';
import { navlinks } from '../constants';

const Navbar = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  const { address, connect, disconnect } = useStateContext();

  const handleMainButton = async () => {
    if (address) {
      router.push('/create-campaign');
    } else {
      try {
        if (disconnect) await disconnect();
        localStorage.removeItem('thirdweb_auth_token');
        await connect();
      } catch (error) {
        console.error('Error during wallet connection:', error);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      if (disconnect) await disconnect();
    } catch (error) {
      console.error('Error during disconnect:', error);
    } finally {
      setDropdownOpen(false);
    }
  };

  const handleChangeWalletClick = () => {
    setDropdownOpen(false);
    setShowManualInput(true);
  };

  const handleManualConnect = async () => {
    try {
      if (disconnect) await disconnect();
      localStorage.removeItem('thirdweb_auth_token');
      console.log('Manual connect to:', manualAddress);
      setShowManualInput(false);
    } catch (error) {
      console.error('Manual connection error:', error);
    }
  };

  const renderDropdown = () => (
    <div className="relative">
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer"
      >
        <Image src="/assets/thirdweb.png" alt="user" width={30} height={30} />
      </div>
      {dropdownOpen && (
        <div className="absolute top-14 right-0 w-48 bg-[#2c2f32] border border-gray-700 rounded-md shadow-lg z-50">
          <button
            onClick={handleDisconnect}
            className="w-full px-4 py-2 text-left text-white hover:bg-[#3a3a43]"
          >
            Disconnect
          </button>
          <button
            onClick={handleChangeWalletClick}
            className="w-full px-4 py-2 text-left text-white hover:bg-[#3a3a43]"
          >
            Change Wallet
          </button>
        </div>
      )}
    </div>
  );

  const renderManualInput = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-80">
        <h2 className="text-xl mb-4">Enter New Wallet Address</h2>
        <input
          type="text"
          placeholder="Wallet Address"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          className="w-full border border-gray-300 p-2 mb-4 rounded"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowManualInput(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleManualConnect}
            className="px-4 py-2 bg-[#1dc071] text-white rounded"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between items-center mb-[35px] gap-6">
      <div className="flex items-center">
        <div className="text-[#1dc071] text-[32px] font-bold animate-logo">Eth-FUND</div>
        {/* <Image src="/assets/logo.svg" alt="logo" width={40} height={40} className="ml-2" /> */}
      </div>

      <div className="sm:flex hidden flex-row items-center gap-4">
        <CustomButton
          btnType="button"
          title={address ? 'Create a campaign' : 'Connect wallet'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={handleMainButton}
        />
        {address && renderDropdown()}
      </div>

      <div className="sm:hidden flex justify-between items-center relative w-full">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center">
          <Image src="/assets/logo.png" alt="logo" width={24} height={24} />
        </div>
        <Image
          src="/assets/menu.png"
          alt="menu"
          width={34}
          height={34}
          className="cursor-pointer"
          onClick={() => setToggleDrawer(!toggleDrawer)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name ? 'bg-[#3a3a43]' : ''}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  router.push(link.link);
                }}
              >
                <Image
                  src={link.imgUrl}
                  alt={link.name}
                  width={24}
                  height={24}
                  className={`${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p
                  className={`ml-[20px] font-epilogue text-[14px] font-semibold ${
                    isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex mx-4 items-center gap-4">
            <CustomButton
              btnType="button"
              title={address ? 'Create a campaign' : 'Connect wallet'}
              styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
              handleClick={handleMainButton}
            />
            {address && renderDropdown()}
          </div>
        </div>
      </div>

      {showManualInput && renderManualInput()}

      <style jsx>{`
        @keyframes logoAnimation {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          50% {
            transform: translateY(5px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-logo {
          animation: logoAnimation 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
