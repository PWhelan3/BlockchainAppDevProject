import React from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { User, Wallet, Image, Settings, Copy, CheckCircle } from 'lucide-react'
import useStore from '../store/useStore'

const ProfilePage = () => {
  const { isConnected, address } = useAccount()
  const { user } = useStore()
  const [copied, setCopied] = React.useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view your profile
          </p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  const mockNFTs = [
    { id: 1, name: 'Digital Sunset', image: '/api/placeholder/300/300', price: '0.5 ETH' },
    { id: 2, name: 'Abstract Dreams', image: '/api/placeholder/300/300', price: '0.3 ETH' },
    { id: 3, name: 'Cyber Landscape', image: '/api/placeholder/300/300', price: '0.8 ETH' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.profile.name || 'Anonymous User'}
              </h1>
              <p className="text-gray-600">
                {user.profile.bio || 'Web3 enthusiast and NFT collector'}
              </p>
            </div>

            {/* Wallet Address */}
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Edit Button */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-600">NFTs Owned</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">1.2</div>
          <div className="text-sm text-gray-600">ETH Volume</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-sm text-gray-600">Collections</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-600">Favorites</div>
        </div>
      </div>

      {/* NFT Collection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Image className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">My NFTs</h2>
          </div>
          <span className="text-sm text-gray-500">3 items</span>
        </div>

        {mockNFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNFTs.map((nft) => (
              <div key={nft.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <Image className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{nft.name}</h3>
                  <p className="text-sm text-gray-600">{nft.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No NFTs yet</h3>
            <p className="text-gray-600 mb-4">Start collecting or creating your first NFT</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Explore NFTs
            </button>
          </div>
        )}
      </div>

      {/* Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          {[
            { action: 'Purchased', item: 'Digital Sunset', time: '2 days ago', type: 'buy' },
            { action: 'Listed', item: 'Abstract Dreams', time: '1 week ago', type: 'list' },
            { action: 'Favorited', item: 'Cyber Landscape', time: '2 weeks ago', type: 'like' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'buy' ? 'bg-green-100' :
                  activity.type === 'list' ? 'bg-blue-100' : 'bg-pink-100'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'buy' ? 'bg-green-500' :
                    activity.type === 'list' ? 'bg-blue-500' : 'bg-pink-500'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {activity.action} {activity.item}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage