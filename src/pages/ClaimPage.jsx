// src/pages/ClaimPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { MapPin, Clock, Users, Award, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { WalletButton } from '../components/WalletButton';
import { useWalletIntegration } from '../hooks/useWalletIntegration';

/**
 * ClaimPage Component - Page for claiming NFTs via QR code scan
 * 
 * Handles the complete claim flow:
 * 1. Verify user location against NFT location
 * 2. Check if NFT is claimable
 * 3. Generate claim signature
 * 4. Execute claim transaction
 * 5. Show success/error states
 */
const ClaimPage = () => {
  const { tokenId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const { isCorrectNetwork } = useWalletIntegration();

  // State management
  const [userLocation, setUserLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [claimData, setClaimData] = useState(null);
  const [claimSignature, setClaimSignature] = useState(null);
  const [isGeneratingSignature, setIsGeneratingSignature] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Get coordinates from URL parameters
  const targetLat = parseFloat(searchParams.get('lat')) || 0;
  const targetLng = parseFloat(searchParams.get('lng')) || 0;

  // Contract addresses (these would come from your deployed contracts)
  const NFT_CLAIM_CONTRACT_ADDRESS = process.env.REACT_APP_CLAIM_CONTRACT_ADDRESS;

  /**
   * Get original NFT data from the geo-tagged NFT contract
   * Updated for Wagmi v2
   */
  const { data: originalNFTData, isLoading: nftDataLoading } = useReadContract({
    address: process.env.REACT_APP_GEO_NFT_CONTRACT_ADDRESS,
    abi: [
      {
        "inputs": [{"type": "uint256", "name": "tokenId"}],
        "name": "getGeoData",
        "outputs": [
          {
            "components": [
              {"type": "int256", "name": "latitude"},
              {"type": "int256", "name": "longitude"},
              {"type": "string", "name": "location"},
              {"type": "address", "name": "artist"},
              {"type": "uint256", "name": "mintedAt"},
              {"type": "string", "name": "geoHash"},
              {"type": "bool", "name": "claimable"}
            ],
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'getGeoData',
    args: [tokenId],
    query: {
      enabled: !!tokenId
    }
  });

  /**
   * Check if user has already claimed this NFT
   */
  const { data: hasAlreadyClaimed } = useReadContract({
    address: NFT_CLAIM_CONTRACT_ADDRESS,
    abi: [
      {
        "inputs": [
          {"type": "uint256", "name": "originalTokenId"},
          {"type": "address", "name": "user"}
        ],
        "name": "hasUserClaimed",
        "outputs": [{"type": "bool"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'hasUserClaimed',
    args: [tokenId, address],
    query: {
      enabled: !!tokenId && !!address
    }
  });

  /**
   * Get total claims for this NFT
   */
  const { data: totalClaims } = useReadContract({
    address: NFT_CLAIM_CONTRACT_ADDRESS,
    abi: [
      {
        "inputs": [{"type": "uint256", "name": "originalTokenId"}],
        "name": "getTotalClaims",
        "outputs": [{"type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'getTotalClaims',
    args: [tokenId],
    query: {
      enabled: !!tokenId
    }
  });

  /**
   * Get user's current location
   */
  const getUserLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  /**
   * Calculate distance between two points using Haversine formula
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  /**
   * Generate claim signature from backend (mock for now)
   */
  const generateClaimSignature = async () => {
    if (!userLocation || !originalNFTData) return;

    setIsGeneratingSignature(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const userLat = Math.floor(userLocation.latitude * 1000000); // Convert to microdecimals
      const userLng = Math.floor(userLocation.longitude * 1000000);

      // Mock signature generation for demo
      // In production, this would call your backend API
      setTimeout(() => {
        setClaimData({
          metadataURI: `ipfs://claim-${tokenId}-${address}`,
          userLatitude: userLat,
          userLongitude: userLng,
          timestamp
        });
        setClaimSignature('0x' + '0'.repeat(130)); // Mock signature
        setIsGeneratingSignature(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating signature:', error);
      toast.error('Failed to generate claim signature. Please try again.');
      setIsGeneratingSignature(false);
    }
  };

  /**
   * Execute the claim process (mock for now)
   */
  const handleClaim = async () => {
    try {
      // Mock claim process
      toast.success('Processing claim...');
      setTimeout(() => {
        setClaimSuccess(true);
        toast.success('NFT claimed successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error('Claim failed:', error);
      toast.error('Claim transaction failed');
    }
  };

  /**
   * Get user location on component mount
   */
  useEffect(() => {
    getUserLocation();
  }, []);

  /**
   * Generate signature when user location and NFT data are available
   */
  useEffect(() => {
    if (userLocation && originalNFTData && isConnected && !claimSignature) {
      generateClaimSignature();
    }
  }, [userLocation, originalNFTData, isConnected, claimSignature]);

  // Loading state
  if (nftDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          <p className="text-gray-600">Loading NFT data...</p>
        </div>
      </div>
    );
  }

  // NFT not found or not claimable
  if (!originalNFTData || !originalNFTData.claimable) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">
            NFT Not Available for Claiming
          </h2>
          <p className="text-gray-600">
            This NFT is either not found or not available for claiming.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate distance if both locations available
  let distance = null;
  if (userLocation && targetLat && targetLng) {
    distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      targetLat / 1000000, // Convert from microdecimals
      targetLng / 1000000
    );
  }

  // Check if user is close enough (within 100 meters)
  const isCloseEnough = distance !== null && distance <= 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Claim NFT #{tokenId}
          </h1>
          <p className="text-gray-600">
            Prove your presence at this location to claim a unique NFT
          </p>
        </div>

        {/* NFT Information Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Artwork Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex items-center space-x-2">
             <MapPin className="w-5 h-5 text-gray-500" />
             <span className="text-sm text-gray-600">
               {originalNFTData.location}
             </span>
           </div>
           
           <div className="flex items-center space-x-2">
             <Users className="w-5 h-5 text-gray-500" />
             <span className="text-sm text-gray-600">
               {totalClaims ? totalClaims.toString() : '0'} claims
             </span>
           </div>
           
           <div className="flex items-center space-x-2">
             <Clock className="w-5 h-5 text-gray-500" />
             <span className="text-sm text-gray-600">
               Created {new Date(Number(originalNFTData.mintedAt) * 1000).toLocaleDateString()}
             </span>
           </div>
           
           <div className="flex items-center space-x-2">
             <Award className="w-5 h-5 text-gray-500" />
             <span className="text-sm text-gray-600">
               Artist: {originalNFTData.artist?.slice(0, 6)}...{originalNFTData.artist?.slice(-4)}
             </span>
           </div>
         </div>
       </div>

       {/* Location Status Card */}
       <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
         <h3 className="text-lg font-semibold text-gray-900">
           Location Verification
         </h3>
         
         {isGettingLocation ? (
           <div className="flex items-center space-x-2 text-gray-600">
             <Loader2 className="w-5 h-5 animate-spin" />
             <span>Getting your location...</span>
           </div>
         ) : locationError ? (
           <div className="space-y-3">
             <div className="flex items-center space-x-2 text-red-600">
               <AlertCircle className="w-5 h-5" />
               <span>{locationError}</span>
             </div>
             <button
               onClick={getUserLocation}
               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
             >
               Try Again
             </button>
           </div>
         ) : userLocation ? (
           <div className="space-y-3">
             <div className={`flex items-center space-x-2 ${isCloseEnough ? 'text-green-600' : 'text-red-600'}`}>
               {isCloseEnough ? (
                 <CheckCircle className="w-5 h-5" />
               ) : (
                 <AlertCircle className="w-5 h-5" />
               )}
               <span>
                 {distance !== null 
                   ? `You are ${Math.round(distance)}m away from the artwork`
                   : 'Calculating distance...'
                 }
               </span>
             </div>
             
             {!isCloseEnough && distance !== null && (
               <p className="text-sm text-gray-600">
                 You need to be within 100 meters of the artwork location to claim.
               </p>
             )}
           </div>
         ) : null}
       </div>

       {/* Claim Status and Actions */}
       <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
         {!isConnected ? (
           <div className="text-center space-y-4">
             <h3 className="text-lg font-semibold text-gray-900">
               Connect Your Wallet
             </h3>
             <p className="text-gray-600">
               Connect your wallet to claim this NFT
             </p>
             <WalletButton size="lg" />
           </div>
         ) : !isCorrectNetwork ? (
           <div className="text-center space-y-4">
             <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
             <h3 className="text-lg font-semibold text-gray-900">
               Wrong Network
             </h3>
             <p className="text-gray-600">
               Please switch to the correct network to claim
             </p>
           </div>
         ) : hasAlreadyClaimed ? (
           <div className="text-center space-y-4">
             <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
             <h3 className="text-lg font-semibold text-gray-900">
               Already Claimed
             </h3>
             <p className="text-gray-600">
               You have already claimed this NFT
             </p>
             <button
               onClick={() => navigate('/profile')}
               className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
             >
               View in Profile
             </button>
           </div>
         ) : !isCloseEnough ? (
           <div className="text-center space-y-4">
             <AlertCircle className="w-8 h-8 text-orange-500 mx-auto" />
             <h3 className="text-lg font-semibold text-gray-900">
               Get Closer to Claim
             </h3>
             <p className="text-gray-600">
               Move closer to the artwork location to claim your NFT
             </p>
           </div>
         ) : isGeneratingSignature ? (
           <div className="text-center space-y-4">
             <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
             <h3 className="text-lg font-semibold text-gray-900">
               Preparing Claim
             </h3>
             <p className="text-gray-600">
               Generating verification signature...
             </p>
           </div>
         ) : claimSuccess ? (
           <div className="text-center space-y-4">
             <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
             <h3 className="text-lg font-semibold text-gray-900">
               NFT Claimed Successfully!
             </h3>
             <p className="text-gray-600">
               Congratulations! Your proof-of-presence NFT has been minted.
             </p>
             <p className="text-sm text-gray-500">
               Redirecting to your profile in a few seconds...
             </p>
           </div>
         ) : (
           <div className="text-center space-y-4">
             <Award className="w-8 h-8 text-purple-600 mx-auto" />
             <h3 className="text-lg font-semibold text-gray-900">
               Ready to Claim
             </h3>
             <p className="text-gray-600">
               You're at the right location! Claim your proof-of-presence NFT.
             </p>
             
             <button
               onClick={handleClaim}
               disabled={!claimData || !claimSignature}
               className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium transform hover:scale-105 disabled:hover:scale-100"
             >
               <div className="flex items-center space-x-2">
                 <Award className="w-5 h-5" />
                 <span>Claim NFT</span>
               </div>
             </button>

             {totalClaims && (
               <p className="text-sm text-gray-500">
                 You will be claim #{(Number(totalClaims.toString()) + 1).toString()}
               </p>
             )}
           </div>
         )}
       </div>

       {/* Instructions */}
       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
         <h4 className="text-sm font-medium text-blue-900 mb-2">
           How NFT Claiming Works:
         </h4>
         <ul className="text-xs text-blue-800 space-y-1">
           <li>• Your location is verified against the artwork's coordinates</li>
           <li>• A unique proof-of-presence NFT is minted to your wallet</li>
           <li>• Each claim is timestamped and numbered</li>
           <li>• You can only claim each artwork once</li>
           <li>• The claim is recorded permanently on the blockchain</li>
         </ul>
       </div>
     </div>
   </div>
 );
};

export default ClaimPage;