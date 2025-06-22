import React, { useState, useEffect } from 'react'
import { useAccount, useChainId, useSwitchChain, useDisconnect, useBalance } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { polygonMumbai, polygon } from 'wagmi/chains'
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
  Share2,
  Wallet,
  AlertCircle,
  ExternalLink,
  Wifi,
  WifiOff,
  ShoppingCart,
  Eye
} from 'lucide-react'

const ArtistProfilePage = () => {
  // Wallet hooks
  const { isConnected, address, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { data: balance } = useBalance({ address })

  // Component state
  const [activeTab, setActiveTab] = useState('all')
  const [likedArtworks, setLikedArtworks] = useState(new Set())
  const [isFollowing, setIsFollowing] = useState(false)
  const [networkError, setNetworkError] = useState('')
  const [purchaseLoading, setPurchaseLoading] = useState(null)

  // Network validation
  const isCorrectNetwork = chainId === polygonMumbai.id

  // Switch to Mumbai network
  const switchToMumbai = async () => {
    try {
      setNetworkError('')
      await switchChain({ chainId: polygonMumbai.id })
    } catch (error) {
      console.error('Failed to switch network:', error)
      setNetworkError('Failed to switch to Mumbai testnet. Please switch manually in your wallet.')
    }
  }

  // Mock artist data
  const artistData = {
    name: 'Elena Rodriguez',
    bio: 'Digital artist exploring the intersection of nature and technology through NFT art. Based in Barcelona, creating immersive experiences that bridge the physical and digital worlds.',
    location: 'Barcelona, Spain',
    website: 'elenaart.com',
    walletAddress: '0x742d35Cc6634C0532925a3b8D4021d4C87Ad30c9',
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
      price: '0.8', 
      priceUSD: '$1,600',
      likes: 234,
      status: 'available',
      location: 'Barcelona, Spain',
      coordinates: '41.3851,2.1734'
    },
    { 
      id: 2, 
      name: 'Digital Bloom', 
      price: '1.2', 
      priceUSD: '$2,400',
      likes: 189,
      status: 'sold',
      location: 'Madrid, Spain',
      coordinates: '40.4168,-3.7038'
    },
    { 
      id: 3, 
      name: 'Cyber Nature', 
      price: '0.6', 
      priceUSD: '$1,200',
      likes: 156,
      status: 'available',
      location: 'Valencia, Spain',
      coordinates: '39.4699,-0.3763'
    },
    { 
      id: 4, 
      name: 'Electric Dreams', 
      price: '0.9', 
      priceUSD: '$1,800',
      likes: 298,
      status: 'available',
      location: 'Seville, Spain',
      coordinates: '37.3886,-5.9823'
    },
    { 
      id: 5, 
      name: 'Quantum Garden', 
      price: '1.5', 
      priceUSD: '$3,000',
      likes: 421,
      status: 'sold',
      location: 'Bilbao, Spain',
      coordinates: '43.2627,-2.9253'
    },
    { 
      id: 6, 
      name: 'Bio-Digital', 
      price: '0.7', 
      priceUSD: '$1,400',
      likes: 167,
      status: 'available',
      location: 'Granada, Spain',
      coordinates: '37.1773,-3.5986'
    },
  ]

  // Filter artworks based on active tab
  const filteredArtworks = mockArtworks.filter(artwork => {
    if (activeTab === 'available') return artwork.status === 'available'
    if (activeTab === 'sold') return artwork.status === 'sold'
    return true
  })

  // Handle artwork like/unlike
  const handleLike = (artworkId) => {
    if (!isConnected) {
      alert('Please connect your wallet to like artworks')
      return
    }

    setLikedArtworks(prev => {
      const newLiked = new Set(prev)
      if (newLiked.has(artworkId)) {
        newLiked.delete(artworkId)
      } else {
        newLiked.add(artworkId)
      }
      return newLiked
    })
  }

  // Handle follow/unfollow
  const handleFollow = () => {
    if (!isConnected) {
      alert('Please connect your wallet to follow artists')
      return
    }
    setIsFollowing(!isFollowing)
  }

  // Handle artwork purchase
  const handlePurchase = async (artwork) => {
    if (!isConnected) {
      alert('Please connect your wallet to purchase NFTs')
      return
    }

    if (!isCorrectNetwork) {
      alert('Please switch to Mumbai testnet to purchase NFTs')
      return
    }

    setPurchaseLoading(artwork.id)
    
    try {
      // Simulate purchase transaction
      console.log('Purchasing artwork:', artwork.name, 'for', artwork.price, 'ETH')
      
      // Here you would implement actual purchase logic:
      // 1. Check user balance
      // 2. Call smart contract purchase function
      // 3. Handle transaction confirmation
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Successfully purchased ${artwork.name} for ${artwork.price} ETH!`)
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setPurchaseLoading(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Network Warning */}
      {isConnected && !isCorrectNetwork && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Wrong Network Detected
              </p>
              <p className="text-sm text-yellow-700">
                You're connected to {chain?.name || 'Unknown Network'}. Switch to Mumbai Testnet for full functionality.
              </p>
              <button
                onClick={switchToMumbai}
                className="mt-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
              >
                Switch to Mumbai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Network Error */}
      {networkError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{networkError}</p>
          </div>
        </div>
      )}

      {/* Artist Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
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
                <Wallet className="w-4 h-4" />
                <span className="font-mono text-sm">
                  {artistData.walletAddress.slice(0, 6)}...{artistData.walletAddress.slice(-4)}
                </span>
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

            {/* Connection Status */}
            {isConnected && (
              <div className="flex items-center space-x-4 text-sm text-purple-100">
                <div className="flex items-center space-x-2">
                  {isCorrectNetwork ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-300" />
                      <span>Connected to Mumbai</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-yellow-300" />
                      <span>Wrong Network</span>
                    </>
                  )}
                </div>
                {balance && (
                  <div>
                    Balance: {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {isConnected ? (
              <>
                <button 
                  onClick={handleFollow}
                  className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                    isFollowing 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="px-6 py-2 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </>
            ) : (
              <ConnectButton />
            )}
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
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-2 font-medium ${
                activeTab === 'all' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Artworks
            </button>
            <button 
              onClick={() => setActiveTab('available')}
              className={`pb-2 font-medium ${
                activeTab === 'available' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Available
            </button>
            <button 
              onClick={() => setActiveTab('sold')}
              className={`pb-2 font-medium ${
                activeTab === 'sold' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sold
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{filteredArtworks.length} items</span>
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
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
                  <button 
                    onClick={() => handleLike(artwork.id)}
                    className={`p-2 rounded-full transition-colors ${
                      likedArtworks.has(artwork.id)
                        ? 'bg-red-100 text-red-500'
                        : 'bg-white/90 hover:bg-white text-gray-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedArtworks.has(artwork.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                {/* Location Badge */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{artwork.location}</span>
                </div>
              </div>

              {/* Artwork Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{artwork.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-semibold text-gray-900">{artwork.price} ETH</span>
                    <span className="text-sm text-gray-500 ml-1">({artwork.priceUSD})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{artwork.likes + (likedArtworks.has(artwork.id) ? 1 : 0)}</span>
                  </div>
                </div>
                
                {/* GPS Coordinates */}
                <div className="text-xs text-gray-500 mb-3 font-mono">
                  GPS: {artwork.coordinates}
                </div>
                
                {artwork.status === 'available' ? (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handlePurchase(artwork)}
                      disabled={!isConnected || !isCorrectNetwork || purchaseLoading === artwork.id}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {purchaseLoading === artwork.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Buying...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Buy Now</span>
                        </>
                      )}
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 text-gray-500 text-sm">
                    Sold Out
                  </div>
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
          
          {isConnected && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">🔗 Blockchain Verified</h4>
              <p className="text-sm text-purple-800">
                This artist profile and all artworks are verified on the blockchain. 
                Connected wallet: <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistProfilePage