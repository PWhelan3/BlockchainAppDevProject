import React from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Map, MapPin, Search, Filter, Globe } from 'lucide-react'

const MapPage = () => {
  const { isConnected } = useAccount()

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
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
          <Map className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore the Art World</h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to discover artists and NFTs from around the globe
          </p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Global Art Map</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover artists and NFT collections from around the world. Explore different regions 
          and connect with the global creative community.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city, country, or artist..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Globe className="w-4 h-4" />
              <span>View Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Map className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Interactive Map Coming Soon</h3>
              <p className="text-gray-600">MapBox GL JS integration will be implemented here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Locations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockLocations.map((location) => (
            <div key={location.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{location.city}</h3>
                    <p className="text-sm text-gray-600">{location.country}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{location.artists}</div>
                  <div className="text-gray-600">Artists</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-600">{location.nfts.toLocaleString()}</div>
                  <div className="text-gray-600">NFTs</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Artists by Region */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Artists by Region</h2>
        
        <div className="space-y-6">
          {['North America', 'Europe', 'Asia'].map((region) => (
            <div key={region} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
              <h3 className="font-medium text-gray-900 mb-4">{region}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">A{i}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Artist {i}</h4>
                      <p className="text-sm text-gray-600">12 NFTs • 0.5 ETH avg</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Global Community</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">89</div>
            <div className="text-purple-100">Countries</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">1,247</div>
            <div className="text-purple-100">Cities</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">12,456</div>
            <div className="text-purple-100">Artists</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">156K</div>
            <div className="text-purple-100">NFTs</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapPage