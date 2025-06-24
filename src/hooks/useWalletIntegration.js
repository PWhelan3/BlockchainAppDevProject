// src/hooks/useWalletIntegration.js
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for comprehensive wallet integration
 * Handles connection, network switching, balance checking, and error states
 */
export const useWalletIntegration = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const { address, isConnected, isConnecting: wagmiConnecting } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({ address });
  const chainId = useChainId(); // Updated: use useChainId instead of useNetwork
  const { switchChain, isPending: switchingNetwork } = useSwitchChain(); // Updated: use useSwitchChain
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  // Required network configuration (Polygon Mumbai for development, Polygon for production)
  const REQUIRED_NETWORK = {
    development: {
      id: 80001,
      name: 'Polygon Mumbai',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    },
    production: {
      id: 137,
      name: 'Polygon',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    }
  };

  const currentRequiredNetwork = process.env.NODE_ENV === 'production' 
    ? REQUIRED_NETWORK.production 
    : REQUIRED_NETWORK.development;

  // Check if user is on the correct network
  const isCorrectNetwork = chainId === currentRequiredNetwork.id;

  // Format address for display
  const formatAddress = useCallback((addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  // Format balance for display
  const formatBalance = useCallback((balanceData) => {
    if (!balanceData) return '0';
    const value = parseFloat(balanceData.formatted);
    return value < 0.0001 ? '< 0.0001' : value.toFixed(4);
  }, []);

  // Handle wallet connection
  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      if (openConnectModal) {
        openConnectModal();
      } else {
        throw new Error('Connect modal not available');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnectionError(error.message);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [openConnectModal]);

  // Handle network switching
  const switchToCorrectNetwork = useCallback(async () => {
    try {
      if (switchChain) {
        await switchChain({ chainId: currentRequiredNetwork.id }); // Updated: pass object with chainId
        toast.success(`Switched to ${currentRequiredNetwork.name}`);
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error(`Failed to switch to ${currentRequiredNetwork.name}`);
    }
  }, [switchChain, currentRequiredNetwork]);

  // Handle account modal opening
  const openAccount = useCallback(() => {
    if (openAccountModal) {
      openAccountModal();
    }
  }, [openAccountModal]);

  // Effect to handle connection state changes
  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      toast.error(`Please switch to ${currentRequiredNetwork.name} network`);
    }
  }, [isConnected, isCorrectNetwork, currentRequiredNetwork.name]);

  // Effect to clear errors when connection succeeds
  useEffect(() => {
    if (isConnected) {
      setConnectionError(null);
      toast.success('Wallet connected successfully');
    }
  }, [isConnected]);

  return {
    // Connection state
    address,
    isConnected,
    isConnecting: isConnecting || wagmiConnecting,
    connectionError,
    
    // Network state
    chainId, // Updated: return chainId instead of chain
    isCorrectNetwork,
    currentRequiredNetwork,
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
  };
};