import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { MapPin, Wifi, WifiOff } from 'lucide-react'

const WalletHeader = () => {
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const isCorrectNetwork = chainId === polygonMumbai.id

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Location NFT Minter
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Network Status */}
            {isConnected && (
              <div className="flex items-center space-x-2 text-sm">
                {isCorrectNetwork ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-green-700 font-medium">Mumbai</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-700 font-medium">Wrong Network</span>
                  </>
                )}
              </div>
            )}
            
            {/* Connect Button */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}

export default WalletHeader