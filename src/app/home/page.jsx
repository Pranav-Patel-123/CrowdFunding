// src/app/home/page.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useStateContext } from '../../../context';
import DisplayCampaigns from '../../../components/DisplayCampaigns';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const {
    address,
    contract,
    getCampaigns,
    getCategories,
    getCampaignsByCategory,
    getTotalVotes      // ← pull in the new helper
  } = useStateContext();

  const [uniqueDonations, setUniqueDonations] = useState(0);
  const [projectsRaisedFunds, setProjectsRaisedFunds] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  // Fetch total votes on mount (and whenever the function identity changes)
  useEffect(() => {
    const fetchVotesCount = async () => {
      try {
        const totalVotes = await getTotalVotes();
        setUniqueDonations(totalVotes);
      } catch (error) {
        console.error("Error fetching total votes:", error);
      }
    };
    fetchVotesCount();
  }, [getTotalVotes]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const fetched = selectedCategory
      ? await getCampaignsByCategory(selectedCategory)
      : await getCampaigns();
    setCampaigns(fetched);
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const list = await getCategories();
    setCategories(list);
  };

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
      fetchCategories();
    }
  }, [address, contract, selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      animateCount(uniqueDonations, setUniqueDonations);
      animateCount(projectsRaisedFunds, setProjectsRaisedFunds);
    }
  }, [isVisible]);

  const animateCount = (target, setter) => {
    let start = 0;
    const inc = Math.ceil(target / 50);
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(start);
      }
    }, 20);
  };

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4 md:px-10 text-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto">
        {/* Category Filter */}
        <div className="flex flex-col mb-6">
          <h2 className="text-xl font-semibold mb-2">Filter by Category:</h2>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-[#2b2b2b] p-3 rounded-lg text-[#e0e0e0] border border-[#4a4a4a]"
          >
            <option value="">All Categories</option>
            {categories.length === 0
              ? <option value="">No categories found</option>
              : categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))
            }
          </select>
        </div>

        {/* Campaigns */}
        <DisplayCampaigns
          isLoading={isLoading}
          campaigns={campaigns}
          title={selectedCategory ? `${selectedCategory} Campaigns` : "All Campaigns"}
        />

        {/* Stats section (ensure you render statsRef somewhere)
        <div ref={statsRef} className="mt-12">
          <h3>Total Unique Votes: {uniqueDonations}</h3>
          <h3>Projects Funded: {projectsRaisedFunds}</h3>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
