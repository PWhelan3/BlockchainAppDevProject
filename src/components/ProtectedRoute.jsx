import React from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet, Shield } from 'lucide-react'

const ProtectedRoute = ({ children, requireConnection = true }) => {
  const { isConnected } = useAccount()

  if (requireConnection && !isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6 p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              You need to connect your wallet to access this feature
            </p>
            <ConnectButton />
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Your wallet data is secure and never stored</span>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute