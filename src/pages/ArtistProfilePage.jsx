import React from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  Palette, 
  MapPin, 
  Globe, 
  Instagram, 
  Twitter, 
  Image, 
  TrendingUp,
  Users,
  Heart,
  Share2
} from 'lucide-react'

const ArtistProfilePage = () => {
  const { isConnected } = useAccount()

  // Mock artist data
  const artistData = {
    name: 'Elena Rodriguez',
    bio: 'Digital artist exploring the intersection of nature and technology through NFT art. Based in Barcelona, creating immersive experiences that bridge the physical and digital worlds.',
    location: 'Barcelona, Spain',
    website: 'elenaart.com',
    social: {
      twitter: '@elenadigitalart',
      instagram: '@elena.creates'
    },
    stats: {
      followers: 2847,
      artworks: 156,
      sold: 89,
      volume: '12.4 ETH'
    },
    verified: true
  }

  const mockArtworks = [
    { 
      id: 1, 
      name: 'Neon Forest', 
      price: '0.8 ETH', 
      likes: 234,
      status: 'available'
    },
    { 
      id: 2, 
      name: 'Digital Bloom', 
      price: '1.2 ETH', 
      likes: 189,
      status: 'sold'
    },
    { 
      id: 3, 
      name: 'Cyber Nature', 
      price: '0.6 ETH', 
      likes: 156,
      status: 'available'
    },
    { 
      id: 4, 
      name: 'Electric Dreams', 
      price: '0.9 ETH', 
      likes: 298,
      status: 'available'
    },
    { 
      id: 5, 
      name: 'Quantum Garden', 
      price: '1.5 ETH', 
      likes: 421,
      status: 'sold'
    },
    { 
      id: 6, 
      name: 'Bio-Digital', 
      price: '0.7 ETH', 
      likes: 167,
      status: 'available'
    },
  ]

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
          <Palette className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect to View Artists</h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to explore artist profiles and their collections
          </p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Artist Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Artist Avatar */}
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <Palette className="w-16 h-16 text-white" />
          </div>

          {/* Artist Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold">{artistData.name}</h1>
              {artistData.verified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <p className="text-purple-100 text-lg leading-relaxed">
              {artistData.bio}
            </p>

            {/* Location and Links */}
            <div className="flex flex-wrap items-center gap-4 text-purple-100">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{artistData.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>{artistData.website}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Twitter className="w-4 h-4" />
                <span>{artistData.social.twitter}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Instagram className="w-4 h-4" />
                <span>{artistData.social.instagram}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button className="px-6 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Follow
            </button>
            <button className="px-6 py-2 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{artistData.stats.followers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Image className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{artistData.stats.artworks}</div>
          <div className="text-sm text-gray-600">Artworks</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{artistData.stats.sold}</div>
          <div className="text-sm text-gray-600">Sold</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{artistData.stats.volume}</div>
          <div className="text-sm text-gray-600">Volume</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-6">
            <button className="text-purple-600 border-b-2 border-purple-600 pb-2 font-medium">
              All Artworks
            </button>
            <button className="text-gray-600 hover:text-gray-900 pb-2">
              Available
            </button>
            <button className="text-gray-600 hover:text-gray-900 pb-2">
              Sold
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{mockArtworks.length} items</span>
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArtworks.map((artwork) => (
            <div key={artwork.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
              {/* Artwork Image */}
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                <Image className="w-16 h-16 text-gray-400" />
                {artwork.status === 'sold' && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                    SOLD
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Artwork Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{artwork.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">{artwork.price}</span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{artwork.likes}</span>
                  </div>
                </div>
                
                {artwork.status === 'available' && (
                  <button className="w-full mt-3 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Artist</h2>
        <div className="prose prose-gray max-w-none">
          <p>
            Elena Rodriguez is a pioneering digital artist who has been at the forefront of the NFT movement since 2021. 
            Her work explores themes of environmental consciousness, technological integration, and the future of human-nature relationships.
          </p>
          <p>
            With a background in both traditional fine arts and computer science, Elena brings a unique perspective to digital creation. 
            Her pieces have been featured in major galleries across Europe and have gained recognition in the international NFT community.
          </p>
          <p>
            Elena's artistic philosophy centers around creating immersive experiences that challenge viewers to reconsider their 
            relationship with technology and the natural world. Through her NFT collections, she aims to fund environmental 
            conservation projects and promote sustainable digital art practices.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ArtistProfilePage