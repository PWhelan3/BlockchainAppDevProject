// src/components/WalletButton.jsx
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletIntegration } from '../hooks/useWalletIntegration';
import { Wallet, AlertTriangle, Loader2 } from 'lucide-react';

/**
 * Enhanced wallet connection button with network switching and error handling
 */
export const WalletButton = ({ 
  variant = 'default', 
  size = 'md',
  showBalance = true,
  showNetwork = false 
}) => {
  const {
    isConnected,
    isConnecting,
    connectionError,
    isCorrectNetwork,
    switchToCorrectNetwork,
    switchingNetwork,
    currentRequiredNetwork,
    formattedAddress,
    formattedBalance,
    balance
  } = useWalletIntegration();

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-purple-600 hover:bg-purple-700 text-white',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
    ghost: 'text-purple-600 hover:bg-purple-50'
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              // Not connected state
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    disabled={isConnecting}
                    className={`
                      flex items-center space-x-2 rounded-lg font-medium transition-all
                      ${sizeClasses[size]} ${variantClasses[variant]}
                      ${isConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                    `}
                  >
                    {isConnecting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wallet className="w-4 h-4" />
                    )}
                    <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                  </button>
                );
              }

              // Wrong network state
              if (!isCorrectNetwork) {
                return (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={switchToCorrectNetwork}
                      type="button"
                      disabled={switchingNetwork}
                      className={`
                        flex items-center space-x-2 rounded-lg font-medium transition-all
                        bg-red-600 hover:bg-red-700 text-white
                        ${sizeClasses[size]}
                        ${switchingNetwork ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {switchingNetwork ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                      <span>
                        {switchingNetwork 
                          ? 'Switching...' 
                          : `Switch to ${currentRequiredNetwork.name}`
                        }
                      </span>
                    </button>
                  </div>
                );
              }

              // Connected state
              return (
                <div className="flex items-center space-x-2">
                  {/* Network indicator */}
                  {showNetwork && (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{chain.name}</span>
                    </button>
                  )}

                  {/* Account button */}
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className={`
                      flex items-center space-x-2 rounded-lg font-medium transition-all
                      ${sizeClasses[size]} ${variantClasses[variant]}
                      hover:scale-105
                    `}
                  >
                    <Wallet className="w-4 h-4" />
                    <div className="flex flex-col items-start">
                      <span>{account.displayName}</span>
                      {showBalance && account.balanceFormatted && (
                        <span className="text-xs opacity-75">
                          {account.balanceFormatted}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })()}

            {/* Connection error display */}
            {connectionError && (
              <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{connectionError}</p>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};