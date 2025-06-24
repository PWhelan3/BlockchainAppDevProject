import React, { useState } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  Map, 
  MapPin, 
  Search, 
  Filter, 
  Globe, 
  User, 
  Star, 
  Palette, 
  Settings, 
  LogOut,
  X,
  ChevronDown,
  Minus,
  Plus
} from 'lucide-react'

const MapPage = () => {
  const { isConnected } = useAccount()
  const [showNotification, setShowNotification] = useState(true)
  const [searchRadius, setSearchRadius] = useState(50)
  const [activeFilters, setActiveFilters] = useState({
    currentlyHappening: true,
    free: true,
    publiclyAccessible: true
  })

  // Mock location data
  const mockLocations = [
    { id: 1, city: 'New York', country: 'USA', artists: 156, nfts: 2341 },
    { id: 2, city: 'London', country: 'UK', artists: 89, nfts: 1456 },
    { id: 3, city: 'Tokyo', country: 'Japan', artists: 234, nfts: 3210 },
    { id: 4, city: 'Barcelona', country: 'Spain', artists: 67, nfts: 987 },
    { id: 5, city: 'Berlin', country: 'Germany', artists: 123, nfts: 1876 },
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6 p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <Map className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Explore the Art World</h1>
            <p className="text-gray-400 mb-6">
              Connect your wallet to discover artists and NFTs from around the globe
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Current</h1>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">My</div>
              <div className="text-sm text-gray-600">Interests</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Palette className="w-5 h-5" />
                <span>Explore</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Star className="w-5 h-5" />
                <span>Featured</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-5 h-5" />
                <span>Mint NFTs</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium">
                <MapPin className="w-5 h-5" />
                <span>Map</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-gray-200">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span>Preference</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Sign out</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8">
              <button className="text-gray-900 font-medium border-b-2 border-purple-500 pb-1">Map</button>
              <button className="text-gray-600 hover:text-gray-900">Profile</button>
              <button className="text-gray-600 hover:text-gray-900">Artist Profile</button>
              <button className="text-gray-600 hover:text-gray-900">Connect Wallet</button>
            </div>
            <button className="p-2">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {showNotification && (
          <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-teal-400" />
              <div>
                <div className="font-medium">New Artworks Ongoing!</div>
                <div className="text-sm text-gray-300">
                  Welcome! Discover the latest NFTs and events in your area. Dive into the world of art like never before!
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Map Container */}
        <div className="relative h-full">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-200">
            {/* Dublin Map Mockup */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 text-gray-600">
                <Map className="w-24 h-24 mx-auto opacity-30" />
                <div>
                  <h3 className="text-xl font-medium">Interactive Map</h3>
                  <p>Dublin area shown - MapBox integration would display here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search/Filter Panel */}
          <div className="absolute top-6 right-6 w-80 bg-gray-800 text-white rounded-lg shadow-2xl overflow-hidden">
            {/* Panel Header */}
            <div className="bg-teal-600 px-6 py-4">
              <h3 className="text-lg font-semibold">Explore the Map</h3>
              <p className="text-sm text-teal-100 mt-1">Find what's on near you...</p>
            </div>

            {/* Search Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search info</label>
                <div className="relative">
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white appearance-none">
                    <option>What are you looking for?</option>
                    <option>Artists</option>
                    <option>NFTs</option>
                    <option>Events</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="relative">
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white appearance-none">
                    <option>Where?</option>
                    <option>Dublin</option>
                    <option>London</option>
                    <option>New York</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="relative">
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white appearance-none">
                    <option>When?</option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="relative">
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white appearance-none">
                    <option>Genre?</option>
                    <option>Digital Art</option>
                    <option>Photography</option>
                    <option>Abstract</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Filters Section */}
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-teal-400 mb-3">Filters</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Currently Happening?</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={activeFilters.currentlyHappening}
                        onChange={(e) => setActiveFilters({...activeFilters, currentlyHappening: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors ${activeFilters.currentlyHappening ? 'bg-teal-500' : 'bg-gray-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out transform ${activeFilters.currentlyHappening ? 'translate-x-5 mt-1' : 'translate-x-1 mt-1'}`}></div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Free?</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={activeFilters.free}
                        onChange={(e) => setActiveFilters({...activeFilters, free: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors ${activeFilters.free ? 'bg-teal-500' : 'bg-gray-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out transform ${activeFilters.free ? 'translate-x-5 mt-1' : 'translate-x-1 mt-1'}`}></div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Publicly Accessible</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={activeFilters.publiclyAccessible}
                        onChange={(e) => setActiveFilters({...activeFilters, publiclyAccessible: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors ${activeFilters.publiclyAccessible ? 'bg-teal-500' : 'bg-gray-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out transform ${activeFilters.publiclyAccessible ? 'translate-x-5 mt-1' : 'translate-x-1 mt-1'}`}></div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Search Radius */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Search Radius</span>
                  <button 
                    onClick={() => setSearchRadius(Math.max(1, searchRadius - 10))}
                    className="w-6 h-6 bg-gray-700 rounded border border-gray-600 flex items-center justify-center hover:bg-gray-600"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-400">Less</span>
                  <div className="flex-1 relative">
                    <div className="w-full h-2 bg-gray-700 rounded-full">
                      <div 
                        className="h-2 bg-teal-500 rounded-full relative"
                        style={{ width: `${(searchRadius / 100) * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-sm border-2 border-teal-500"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">More</span>
                  <button 
                    onClick={() => setSearchRadius(Math.min(100, searchRadius + 10))}
                    className="w-6 h-6 bg-gray-700 rounded border border-gray-600 flex items-center justify-center hover:bg-gray-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Save
                </button>
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapPage