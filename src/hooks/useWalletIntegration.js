// src/hooks/useWalletIntegration.js - SIMPLIFIED VERSION
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'

/**
 * Simplified wallet integration hook with better error handling
 */
export const useWalletIntegration = () => {
  const [connectionError, setConnectionError] = useState(null)

  // Wagmi hooks
  const { address, isConnected, isConnecting } = useAccount()
  const { data: balance, isLoading: balanceLoading } = useBalance({ 
    address,
    enabled: !!address 
  })
  const chainId = useChainId()
  const { switchChain, isPending: switchingNetwork } = useSwitchChain()
  
  // RainbowKit modals
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  // Network configuration - Mumbai for development
  const REQUIRED_NETWORK = {
    id: 80001,
    name: 'Polygon Mumbai',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  }

  // Check if user is on the correct network
  const isCorrectNetwork = chainId === REQUIRED_NETWORK.id

  // Format address for display
  const formatAddress = useCallback((addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }, [])

  // Format balance for display
  const formatBalance = useCallback((balanceData) => {
    if (!balanceData) return '0'
    const value = parseFloat(balanceData.formatted)
    return value < 0.0001 ? '< 0.0001' : value.toFixed(4)
  }, [])

  // Handle wallet connection
  const connectWallet = useCallback(async () => {
    try {
      setConnectionError(null)
      
      if (!openConnectModal) {
        throw new Error('RainbowKit not properly initialized')
      }
      
      openConnectModal()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      setConnectionError(error.message)
      toast.error('Failed to connect wallet: ' + error.message)
    }
  }, [openConnectModal])

  // Handle network switching
  const switchToCorrectNetwork = useCallback(async () => {
    try {
      if (!switchChain) {
        throw new Error('Network switching not available')
      }
      
      await switchChain({ chainId: REQUIRED_NETWORK.id })
      toast.success(`Switched to ${REQUIRED_NETWORK.name}`)
    } catch (error) {
      console.error('Failed to switch network:', error)
      toast.error(`Failed to switch to ${REQUIRED_NETWORK.name}`)
    }
  }, [switchChain])

  // Handle account modal opening
  const openAccount = useCallback(() => {
    if (openAccountModal) {
      openAccountModal()
    }
  }, [openAccountModal])

  // Effect to show network warning
  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      toast.error(`Please switch to ${REQUIRED_NETWORK.name} network`, {
        duration: 5000
      })
    }
  }, [isConnected, isCorrectNetwork])

  // Effect to show connection success
  useEffect(() => {
    if (isConnected && address) {
      setConnectionError(null)
      toast.success('Wallet connected successfully!')
    }
  }, [isConnected, address])

  return {
    // Connection state
    address,
    isConnected,
    isConnecting,
    connectionError,
    
    // Network state
    chainId,
    isCorrectNetwork,
    currentRequiredNetwork: REQUIRED_NETWORK,
    switchingNetwork,
    
    // Balance state
    balance,
    balanceLoading,
    
    // Actions
    connectWallet,
    switchToCorrectNetwork,
    openAccount,
    
    // Utilities
    formatAddress,
    formatBalance,
    formattedAddress: formatAddress(address),
    formattedBalance: formatBalance(balance),
  }
}