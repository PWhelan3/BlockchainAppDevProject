// src/components/ProtectedRoute.jsx - FIXED VERSION
import React from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet, Shield, AlertTriangle } from 'lucide-react'

const ProtectedRoute = ({ children, requireConnection = true }) => {
  const { isConnected, isConnecting } = useAccount()

  // If connection is not required, always render children
  if (!requireConnection) {
    return children
  }

  // If connection is required but user is not connected
  if (requireConnection && !isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center space-y-6 p-8 bg-white rounded-xl shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-10 h-10 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              You need to connect your wallet to access this feature and interact with the blockchain.
            </p>
            
            {/* Connection status indicator */}
            {isConnecting && (
              <div className="flex items-center justify-center space-x-2 mb-4 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Connecting...</span>
              </div>
            )}
            
            <ConnectButton />
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Your wallet data is secure and never stored</span>
          </div>
          
          {/* Additional help text */}
          <div className="text-xs text-gray-400 border-t pt-4">
            <p>Don't have a wallet? We recommend <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">MetaMask</a> for beginners.</p>
          </div>
        </div>
      </div>
    )
  }

  // User is connected, render children
  return children
}

export default ProtectedRoute