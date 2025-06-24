// src/components/WalletButton.jsx - SIMPLIFIED VERSION
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWalletIntegration } from '../hooks/useWalletIntegration'
import { Wallet, AlertTriangle, Loader2 } from 'lucide-react'

/**
 * Simplified wallet button with error handling
 */
export const WalletButton = ({ className = '' }) => {
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
    connectWallet
  } = useWalletIntegration()

  return (
    <div className={className}>
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
          const ready = mounted
          const connected = ready && account && chain

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
                        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium 
                        bg-purple-600 hover:bg-purple-700 text-white transition-all
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
                  )
                }

                // Wrong network state
                if (chain.unsupported || !isCorrectNetwork) {
                  return (
                    <button
                      onClick={switchingNetwork ? undefined : switchToCorrectNetwork}
                      type="button"
                      disabled={switchingNetwork}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium 
                        bg-red-600 hover:bg-red-700 text-white transition-all
                        ${switchingNetwork ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>
                        {switchingNetwork ? 'Switching...' : 'Wrong Network'}
                      </span>
                    </button>
                  )
                }

                // Connected state
                return (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <span>{account.displayName}</span>
                      <span className="text-sm opacity-75">
                        {account.displayBalance ? ` (${account.displayBalance})` : ''}
                      </span>
                    </button>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>

      {/* Error message */}
      {connectionError && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {connectionError}
        </div>
      )}
    </div>
  )
}