// src/components/NetworkStatus.jsx
import React from 'react';
import { useWalletIntegration } from '../hooks/useWalletIntegration';
import { AlertTriangle, CheckCircle, Wifi } from 'lucide-react';

/**
 * Network status indicator component
 */
export const NetworkStatus = () => {
  const { 
    chainId, 
    isCorrectNetwork, 
    currentRequiredNetwork,
    switchToCorrectNetwork,
    switchingNetwork,
    isConnected
  } = useWalletIntegration();

  // Don't show anything if wallet isn't connected
  if (!isConnected) {
    return null;
  }

  if (!chainId) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          <Wifi className="w-4 h-4" />
          <span>No network detected</span>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">
              Wrong Network
            </p>
            <p className="text-xs text-yellow-600">
              Please switch to {currentRequiredNetwork.name}
            </p>
          </div>
          <button
            onClick={switchToCorrectNetwork}
            disabled={switchingNetwork}
            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            {switchingNetwork ? 'Switching...' : 'Switch'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-3 mb-4">
      <div className="flex items-center space-x-2 text-green-600 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span>Connected to {currentRequiredNetwork.name}</span>
      </div>
    </div>
  );
};