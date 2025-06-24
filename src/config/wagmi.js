// src/config/wagmi.js - FIXED VERSION
import { http, createConfig } from 'wagmi'
import { polygon, polygonMumbai, sepolia, mainnet } from 'wagmi/chains'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Get project ID from environment variables
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// Debug logging
console.log('Environment check:', {
  projectId: projectId ? 'Present' : 'Missing',
  nodeEnv: import.meta.env.MODE
})

// Fallback project ID (you should replace this with your own)
const fallbackProjectId = '178fd38f4bcee3614df5176873ebb5c5'
const finalProjectId = projectId || fallbackProjectId

if (!projectId) {
  console.warn('⚠️  VITE_WALLETCONNECT_PROJECT_ID environment variable is missing')
  console.warn('⚠️  Using fallback project ID - please set your own in .env file')
  console.warn('⚠️  Get your project ID from: https://cloud.walletconnect.com')
}

export const config = createConfig({
  chains: [polygonMumbai, polygon, sepolia, mainnet],
  connectors: [
    // Injected connector (for browser wallets like MetaMask)
    injected({
      target: 'metaMask',
    }),
    
    // MetaMask connector
    metaMask({
      dappMetadata: {
        name: 'Current - NFT Art Platform',
        description: 'Discover and mint location-based NFT art',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:5173',
        iconUrl: 'https://current-nft.vercel.app/icon.png'
      }
    }),
    
    // WalletConnect v2 connector
    walletConnect({ 
      projectId: finalProjectId,
      metadata: {
        name: 'Current',
        description: 'A Blockchain Based Artistic Archive and Events Platform',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:5173',
        icons: [
          'https://current-nft.vercel.app/icon.png',
          'https://avatars.githubusercontent.com/u/37784886'
        ]
      },
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'light',
        themeVariables: {
          '--wcm-z-index': '1000'
        }
      }
    }),
    
    // Coinbase Wallet
    coinbaseWallet({ 
      appName: 'Current - NFT Art Platform',
      appLogoUrl: 'https://current-nft.vercel.app/icon.png'
    })
  ],
  transports: {
    [polygonMumbai.id]: http('https://rpc-mumbai.maticvigil.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [sepolia.id]: http('https://rpc.sepolia.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
  // SSR configuration
  ssr: false,
  // Storage configuration
  storage: typeof window !== 'undefined' ? {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: (key) => localStorage.removeItem(key),
  } : undefined
})