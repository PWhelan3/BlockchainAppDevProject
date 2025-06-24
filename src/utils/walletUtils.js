// src/utils/walletUtils.js

/**
 * Utility functions for wallet operations
 */

export const SUPPORTED_NETWORKS = {
    80001: { name: 'Polygon Mumbai', symbol: 'MATIC', explorer: 'https://mumbai.polygonscan.com' },
    137: { name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com' }
  };
  
  export const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask);
  };
  
  export const addTokenToMetaMask = async (tokenAddress, tokenSymbol, tokenDecimals = 18, tokenImage) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }
  
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });
  
      return wasAdded;
    } catch (error) {
      console.error('Error adding token to MetaMask:', error);
      throw error;
    }
  };
  
  export const addNetworkToMetaMask = async (networkConfig) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }
  
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
    } catch (error) {
      console.error('Error adding network to MetaMask:', error);
      throw error;
    }
  };
  
  export const getTransactionExplorerUrl = (txHash, chainId) => {
    const network = SUPPORTED_NETWORKS[chainId];
    if (!network) return null;
    return `${network.explorer}/tx/${txHash}`;
  };
  
  export const shortenAddress = (address, chars = 4) => {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  };
  
  export const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };