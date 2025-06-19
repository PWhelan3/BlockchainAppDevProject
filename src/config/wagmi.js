import { http, createConfig } from 'wagmi'
import { polygon, polygonMumbai, sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Get your project ID from WalletConnect Cloud
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'

export const config = createConfig({
  chains: [polygonMumbai, polygon, sepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [polygonMumbai.id]: http('https://rpc-mumbai.maticvigil.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [sepolia.id]: http('https://rpc.sepolia.org'),
  },
})