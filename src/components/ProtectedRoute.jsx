// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAccount } from 'wagmi';
import { WalletButton } from './WalletButton';
import { Lock, Shield } from 'lucide-react';

/**
 * ProtectedRoute Component - Wrapper for routes requiring wallet connection
 */
const ProtectedRoute = ({ 
  children, 
  requireConnection = true,
  fallbackTitle = "Connect Your Wallet",
  fallbackMessage = "Please connect your wallet to access this feature"
}) => {
  const { isConnected } = useAccount();

  // If connection is not required, always render children
  if (!requireConnection) {
    return children;
  }

  // If wallet is connected, render the protected content
  if (isConnected) {
    return children;
  }

  // Render connection prompt when wallet is not connected
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Icon container with gradient background */}
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-10 h-10 text-white" />
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {fallbackTitle}
          </h2>
          <p className="text-gray-600">
            {fallbackMessage}
          </p>
        </div>

        {/* Connection button */}
        <WalletButton 
          size="lg"
          variant="default"
        />

        {/* Security note */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Your wallet connection is secure and encrypted</span>
        </div>

        {/* Help text */}
        <div className="text-xs text-gray-400 space-y-1">
          <p>Don't have a wallet?</p>
          <a 
            href="https://metamask.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 underline"
          >
            Download MetaMask
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;