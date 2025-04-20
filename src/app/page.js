// src/app/page.jsx
'use client'

import React from 'react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-12 bg-gradient-to-r from-purple-900 via-black to-gray-900 text-white">
      <h1 className="text-5xl sm:text-6xl font-bold text-center mb-6">
        Welcome to <span className="text-purple-400">ETH FUND</span>
      </h1>
      <p className="text-lg sm:text-xl text-center max-w-2xl mb-10">
        Seamlessly create, manage, and track your fundraising campaigns. Power your vision and drive change through the power of blockchain.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-16">
        <Link href="/home" passHref>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-semibold transition duration-300">
            Get Started
          </button>
        </Link>
        <Link href="/news" passHref>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded-lg text-lg font-semibold transition duration-300">
            Latest News
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-5xl text-center">
        <FeatureCard
          title="Create Campaigns"
          description="Kickstart your ideas by launching powerful campaigns and reaching your supporters."
        />
        <FeatureCard
          title="Track Performance"
          description="Gain valuable insights and analytics to monitor and optimize your campaigns."
        />
        <FeatureCard
          title="Stay Updated"
          description="Get the latest updates on campaigns and the decentralized fundraising space."
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white bg-opacity-5 p-6 rounded-lg shadow-lg hover:bg-opacity-10 transition duration-300">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <p className="text-sm sm:text-base text-gray-300">{description}</p>
    </div>
  )
}
