import { http, createConfig } from 'wagmi'
import { polygon, polygonMumbai, sepolia, mainnet } from 'wagmi/chains'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Debug: Check if project ID is loaded
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
console.log('Loading WalletConnect with Project ID:', projectId)

if (!projectId) {
  console.warn('WalletConnect Project ID is missing. Some wallet connections may not work.')
}

export const config = createConfig({
  chains: [polygonMumbai, polygon, sepolia, mainnet],
  connectors: [
    // Injected connector (for browser wallets like MetaMask)
    injected({
      target: 'metaMask',
    }),
    
    // MetaMask connector
    metaMask(),
    
    // WalletConnect (only if project ID exists)
    ...(projectId ? [walletConnect({ 
      projectId,
      metadata: {
        name: 'Location NFT Minter',
        description: 'Mint NFTs with location data',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      },
      showQrModal: true,
    })] : []),
    
    // Coinbase Wallet
    coinbaseWallet({ 
      appName: 'Location NFT Minter',
      appLogoUrl: 'https://avatars.githubusercontent.com/u/37784886'
    })
  ],
  transports: {
    [polygonMumbai.id]: http('https://rpc-mumbai.maticvigil.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [sepolia.id]: http('https://rpc.sepolia.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
})