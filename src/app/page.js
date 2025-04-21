'use client'

import React from 'react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 via-black to-gray-900 text-white p-8">
      <h1 className="text-5xl sm:text-6xl font-bold text-center mb-8">
        Welcome to ETH FUND 
      </h1>
      <p className="text-lg sm:text-xl mb-12 text-center max-w-2xl">
        Create, manage, and track campaigns effortlessly. Empower your ideas and make an impact today.
      </p>

      <div className="flex space-x-6">
        <Link href="/home" passHref>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-medium">
            Get Started
          </button>
        </Link>
        <Link href="/news" passHref>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded-lg text-lg font-medium">
            Latest News
          </button>
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Campaigns</h2>
          <p>Launch fundraising campaigns quickly and reach your audience.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Track Performance</h2>
          <p>Monitor your campaign&apos;s progress with detailed insights.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Stay Updated</h2>
          <p>Follow the latest news to stay informed and inspired.</p>
        </div>
      </div>
    </div>
  )
}
