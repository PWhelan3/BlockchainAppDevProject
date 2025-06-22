import React from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Map, Palette, PlusCircle, Sparkles } from 'lucide-react'

const HomePage = () => {
  const { isConnected, address } = useAccount()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Discover Art on the{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Blockchain
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with artists, explore NFT collections, and discover digital art 
            from around the world. Mint, trade, and showcase your creations.
          </p>
        </div>

        {!isConnected ? (
          <div className="space-y-4">
            <ConnectButton />
            <p className="text-sm text-gray-500">
              Connect your wallet to get started
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-800 font-medium">
              🎉 Welcome! Wallet connected
            </p>
            <p className="text-green-600 text-sm mt-1">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <Link to="/MapPage" className="group">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Map className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Explore Map
            </h3>
            <p className="text-gray-600">
              Discover art and artists from around the world on our interactive map.
            </p>
          </div>
        </Link>

        <Link to="/MintPage" className="group">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <PlusCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mint NFTs
            </h3>
            <p className="text-gray-600">
              Create and mint your digital art as NFTs on the blockchain.
            </p>
          </div>
        </Link>

        <Link to="/ArtistProfilePage" className="group">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
              <Palette className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Artist Profiles
            </h3>
            <p className="text-gray-600">
              Showcase your work and connect with other artists and collectors.
            </p>
          </div>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">1,234</div>
            <div className="text-purple-100">NFTs Minted</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">567</div>
            <div className="text-purple-100">Active Artists</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">89</div>
            <div className="text-purple-100">Countries</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { action: 'New NFT minted', artist: 'Artist123', time: '2 hours ago' },
            { action: 'Collection created', artist: 'CreativeArt', time: '4 hours ago' },
            { action: 'NFT sold', artist: 'DigitalMaster', time: '6 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">by {activity.artist}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage