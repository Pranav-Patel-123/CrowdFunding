"use client"

import { useState, useEffect, useRef } from "react"
import { useStateContext } from "@/context"
import DisplayCampaigns from "@/components/DisplayCampaigns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Clock, Filter, Users } from "lucide-react"

const CampaignsPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showOngoing, setShowOngoing] = useState(false)
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const { address, contract, getCampaigns, getCategories, getCampaignsByCategory, getTotalVotes } = useStateContext()

  const [uniqueDonations, setUniqueDonations] = useState(0)
  const [projectsRaisedFunds, setProjectsRaisedFunds] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef(null)

  // Fetch total votes on mount
  useEffect(() => {
    ;(async () => {
      try {
        const totalVotes = await getTotalVotes()
        setUniqueDonations(totalVotes)
      } catch (error) {
        console.error("Error fetching total votes:", error)
      }
    })()
  }, [getTotalVotes])

  // Helper to load + filter campaigns
  const fetchCampaigns = async () => {
    setIsLoading(true)

    // 1) fetch by category or all
    const raw = selectedCategory ? await getCampaignsByCategory(selectedCategory) : await getCampaigns()

    // 2) if "Ongoing only", filter out any whose deadline has already passed
    const today = new Date()
    const filtered = showOngoing
      ? raw.filter((c) => {
          // assume c.deadline is an ISO date string or timestamp
          const dl = new Date(c.deadline)
          return dl >= today
        })
      : raw

    setCampaigns(filtered)
    setIsLoading(false)
  }

  const fetchCategories = async () => {
    const list = await getCategories()
    setCategories(list)
  }

  // re-fetch whenever category, ongoing toggle, contract or address changes
  useEffect(() => {
    if (contract) {
      fetchCampaigns()
      fetchCategories()
    }
  }, [address, contract, selectedCategory, showOngoing])

  // stats intersection observer & count-up
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.5 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      animateCount(uniqueDonations, setUniqueDonations)
      animateCount(projectsRaisedFunds, setProjectsRaisedFunds)
    }
  }, [isVisible])

  const animateCount = (target, setter) => {
    let start = 0
    const inc = Math.ceil(target / 50)
    const timer = setInterval(() => {
      start += inc
      if (start >= target) {
        setter(target)
        clearInterval(timer)
      } else {
        setter(start)
      }
    }, 20)
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    if (value === "ongoing") {
      setShowOngoing(true)
    } else {
      setShowOngoing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gray-900 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Discover & Support Campaigns
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-300">
              Browse through innovative projects and campaigns that need your support
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="py-8 bg-gray-800/50 border-y border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-6 rounded-lg bg-gray-800/50 border border-gray-700 shadow-lg">
              <div className="p-3 rounded-full bg-purple-900/30 mb-4">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <span className="text-3xl md:text-4xl font-bold text-white">{uniqueDonations}</span>
              <span className="text-gray-400 mt-1">Unique Donations</span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg bg-gray-800/50 border border-gray-700 shadow-lg">
              <div className="p-3 rounded-full bg-emerald-900/30 mb-4">
                <BarChart3 className="h-8 w-8 text-emerald-400" />
              </div>
              <span className="text-3xl md:text-4xl font-bold text-white">{projectsRaisedFunds}</span>
              <span className="text-gray-400 mt-1">Projects Funded</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <Card className="mb-8 bg-gray-800/40 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-white">Filters</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ongoingOnly"
                    checked={showOngoing}
                    onCheckedChange={(checked) => setShowOngoing(checked === true)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label htmlFor="ongoingOnly" className="text-sm font-medium leading-none flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Ongoing campaigns only
                  </label>
                </div>

                <div className="w-full sm:w-64">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No categories found
                        </SelectItem>
                      ) : (
                        categories.map((cat, i) => (
                          <SelectItem key={i} value={cat}>
                            {cat}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="bg-gray-800/40 border border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
              All Campaigns
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="data-[state=active]:bg-gray-700">
              Ongoing Only
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Active Filters */}
        {(selectedCategory || showOngoing) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory && (
              <Badge variant="outline" className="bg-gray-800/40 text-gray-200 border-gray-700 px-3 py-1">
                Category: {selectedCategory}
              </Badge>
            )}
            {showOngoing && (
              <Badge variant="outline" className="bg-gray-800/40 text-gray-200 border-gray-700 px-3 py-1">
                Ongoing Only
              </Badge>
            )}
          </div>
        )}

        {/* Campaigns */}
        <DisplayCampaigns
          isLoading={isLoading}
          campaigns={campaigns}
          title={
            showOngoing
              ? selectedCategory
                ? `Ongoing ${selectedCategory} Campaigns`
                : "Ongoing Campaigns"
              : selectedCategory
                ? `${selectedCategory} Campaigns`
                : "All Campaigns"
          }
        />
      </div>
    </div>
  )
}

export default CampaignsPage
