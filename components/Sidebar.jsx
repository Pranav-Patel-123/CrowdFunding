'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import './style.css';
import { navlinks } from '../constants';

const Sidebar = () => {
  const router = useRouter();
  const [isActive, setIsActive] = useState('logo');
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const Icon = ({ styles, name, imgUrl, isActive, handleClick }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div
        className={`relative w-[48px] h-[48px] rounded-[10px] ${
          isActive ? 'bg-[#2c2f32]' : ''
        } flex justify-center items-center cursor-pointer ${styles}`}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {name === 'money' && showTooltip && (
          <span className="tooltip absolute top-[30px] left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-md text-sm font-medium z-10">
            Donate
          </span>
        )}
        <Image
          src={imgUrl}
          alt={name}
          width={24}
          height={24}
          className={`object-contain ${isActive ? '' : 'grayscale'}`}
        />
      </div>
    );
  };

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      {/* Logo */}
      <Link href="/">
        <div onClick={() => setIsActive('logo')}>
          <Icon
            styles="w-[52px] h-[52px] bg-[#2c2f32]"
            imgUrl="/assets/logo.svg"
            name="logo"
            isActive={isActive === 'logo'}
          />
        </div>
      </Link>

      {/* Navigation Icons */}
      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <div
              key={link.name}
              className="tooltip-container relative"
              onMouseEnter={() => setHoveredIcon(link.name)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <Icon
                styles=""
                name={link.name}
                imgUrl={link.imgUrl}
                isActive={isActive === link.name}
                handleClick={() => {
                  setIsActive(link.name);
                  const route = link.name === 'dashboard' ? '/home' : link.link;
                  router.push(route);
                }}
              />
              {hoveredIcon === link.name && (
                <span className="tooltip absolute mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm bg-white text-black rounded shadow-md z-50 whitespace-nowrap">
                  {link.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
