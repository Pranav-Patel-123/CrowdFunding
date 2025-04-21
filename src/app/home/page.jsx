'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useStateContext } from '../../../context';
import DisplayCampaigns from '../../../components/DisplayCampaigns';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showOngoing, setShowOngoing] = useState(false);
  const [categories, setCategories] = useState([]);
  const {
    address,
    contract,
    getCampaigns,
    getCategories,
    getCampaignsByCategory,
    getTotalVotes
  } = useStateContext();

  const [uniqueDonations, setUniqueDonations] = useState(0);
  const [projectsRaisedFunds, setProjectsRaisedFunds] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  // Fetch total votes on mount
  useEffect(() => {
    (async () => {
      try {
        const totalVotes = await getTotalVotes();
        setUniqueDonations(totalVotes);
      } catch (error) {
        console.error("Error fetching total votes:", error);
      }
    })();
  }, [getTotalVotes]);

  // Helper to load + filter campaigns
  const fetchCampaigns = async () => {
    setIsLoading(true);

    // 1) fetch by category or all
    const raw = selectedCategory
      ? await getCampaignsByCategory(selectedCategory)
      : await getCampaigns();

    // 2) if “Ongoing only”, filter out any whose deadline has already passed
    const today = new Date();
    const filtered = showOngoing
      ? raw.filter(c => {
          // assume c.deadline is an ISO date string or timestamp
          const dl = new Date(c.deadline);
          return dl >= today;
        })
      : raw;

    setCampaigns(filtered);
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const list = await getCategories();
    setCategories(list);
  };

  // re-fetch whenever category, ongoing toggle, contract or address changes
  useEffect(() => {
    if (contract) {
      fetchCampaigns();
      fetchCategories();
    }
  }, [address, contract, selectedCategory, showOngoing]);

  // stats intersection observer & count-up (unchanged)…
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
        {/* Filters */}
        <div className="flex flex-wrap items-center mb-6 gap-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ongoingOnly"
              checked={showOngoing}
              onChange={e => setShowOngoing(e.target.checked)}
              className="h-5 w-5 text-blue-600 bg-[#2b2b2b] border-[#4a4a4a] rounded"
            />
            <label htmlFor="ongoingOnly" className="text-lg">
              Ongoing campaigns only
            </label>
          </div>
          <div className="flex flex-col">
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
        </div>

        {/* Campaigns */}
        <DisplayCampaigns
          isLoading={isLoading}
          campaigns={campaigns}
          title={
            showOngoing
              ? (selectedCategory
                  ? `Ongoing ${selectedCategory} Campaigns`
                  : "Ongoing Campaigns")
              : (selectedCategory
                  ? `${selectedCategory} Campaigns`
                  : "All Campaigns")
          }
        />

        {/* Stats section (uncomment when ready)
        <div ref={statsRef} className="mt-12">
          <h3>Total Unique Votes: {uniqueDonations}</h3>
          <h3>Projects Funded: {projectsRaisedFunds}</h3>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
