import React, { useState, useEffect } from 'react'
import { 
  Upload, 
  Image, 
  PlusCircle, 
  Info, 
  Zap, 
  Palette,
  FileImage,
  MapPin,
  Tag,
  Map,
  Globe,
  Camera,
  AlertCircle
} from 'lucide-react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'

const MintPage = () => {
  // Mock wallet connection state for demo
  const [isConnected, setIsConnected] = useState(true)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    royalty: '10',
    location: '',
    tags: '',
    file: null,
    coordinates: null,
    geoHash: ''
  })
  const [dragActive, setDragActive] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.dataTransfer.files[0]
      }))
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files[0]
      }))
    }
  }

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    setLocationError('')
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser')
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData(prev => ({
          ...prev,
          coordinates: { lat: latitude, lng: longitude },
          geoHash: `${latitude.toFixed(6)},${longitude.toFixed(6)}`
        }))
        setIsGettingLocation(false)
        
        // Reverse geocoding would happen here with your preferred service
        // For demo, we'll just set a placeholder
        setFormData(prev => ({
          ...prev,
          location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        }))
      },
      (error) => {
        setLocationError('Unable to retrieve your location')
        setIsGettingLocation(false)
        console.error('Geolocation error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Add geo data to the form submission
    const mintData = {
      ...formData,
      timestamp: new Date().toISOString(),
      chainId: 80001, // Polygon Mumbai testnet
    }
    
    console.log('Minting Location NFT with data:', mintData)
    
    // Here you would:
    // 1. Upload file to IPFS
    // 2. Create metadata JSON with location data
    // 3. Call your smart contract mint function
    // 4. Handle transaction confirmation
  }

  const ConnectButton = () => (
    <button 
      onClick={() => setIsConnected(!isConnected)}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {isConnected ? 'Connected' : 'Connect Wallet'}
    </button>
  )

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 p-8">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
          <PlusCircle className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Location NFT</h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to start minting location-based NFTs with geo data
          </p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
          Create Location NFT
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Mint your digital artwork with embedded geographic data. Each NFT captures not just your creativity, 
          but also the exact location where it was created, making it truly unique and verifiable on the blockchain.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileImage className="w-5 h-5 text-purple-600" />
              <span>Upload Artwork</span>
            </h2>
            
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50 scale-105' 
                  : formData.file 
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
              />
              
              {formData.file ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FileImage className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{formData.file.name}</p>
                    <p className="text-gray-600">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      Drag and drop your file here
                    </p>
                    <p className="text-gray-600 mb-4">
                      or{' '}
                      <label
                        htmlFor="file-upload"
                        className="text-purple-600 hover:text-purple-700 cursor-pointer font-semibold underline"
                      >
                        browse files
                      </label>
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, GIF, MP4, MP3 up to 100MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          {formData.file && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Image className="w-5 h-5 text-purple-600" />
                <span>Preview</span>
              </h3>
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Image className="w-16 h-16 text-purple-400 mx-auto" />
                  <p className="text-purple-600 font-medium">Preview will appear here</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Tag className="w-5 h-5 text-purple-600" />
              <span>NFT Details</span>
            </h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter NFT name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your artwork and its location significance..."
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (ETH)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.001"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0.1"
              />
            </div>

            {/* Royalty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Royalty Percentage
              </label>
              <select
                name="royalty"
                value={formData.royalty}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Royalties you'll receive from future sales
              </p>
            </div>

            {/* Location Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-600" />
                <span>Location Data</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location Name
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="City, Country"
                  />
                </div>

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isGettingLocation ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Getting Location...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Capture Current Location</span>
                    </>
                  )}
                </button>

                {locationError && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{locationError}</span>
                  </div>
                )}

                {formData.coordinates && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      GPS Coordinates Captured
                    </p>
                    <p className="text-xs text-green-600">
                      {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="location, digital-art, geo-nft"
              />
              <p className="text-xs text-gray-500 mt-1">Comma separated tags</p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.file || !formData.name}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Mint Location NFT</span>
            </button>

            {formData.coordinates && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  This NFT will be minted with embedded GPS coordinates
                </p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">Location NFTs</h4>
                <p className="text-sm text-blue-800">
                  Your NFT will include verifiable location data, making it unique to the place where it was created. This geo-data is permanently stored on the blockchain.
                </p>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-start space-x-3">
              <Map className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-900">Network Info</h4>
                <p className="text-sm text-purple-800">
                  Minting on Polygon Mumbai Testnet. Switch to Polygon Mainnet for production NFTs.
                </p>
                <div className="flex items-center space-x-2 text-xs text-purple-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Connected to Mumbai Testnet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintPage