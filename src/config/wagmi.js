// src/config/wagmi.js - SIMPLIFIED VERSION
import { http, createConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Use a working WalletConnect project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'a01e2f3b4c5d6e7f8a9b0c1d2e3f4a5b'

console.log('Wagmi config initialized with project ID:', projectId ? 'Present' : 'Missing')

export const config = createConfig({
  chains: [polygonMumbai, polygon],
  connectors: [
    // Injected connector (for MetaMask and other browser wallets)
    injected(),
    
    // MetaMask specific connector
    metaMask(),
    
    // WalletConnect v2 connector
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Current NFT Platform',
        description: 'Discover and mint location-based NFT art',
        url: 'https://localhost:5173',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    })
  ],
  transports: {
    [polygonMumbai.id]: http('https://rpc-mumbai.maticvigil.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
  },
  ssr: false
})