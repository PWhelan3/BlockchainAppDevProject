import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygon, polygonMumbai, sepolia } from 'wagmi/chains'

export const rainbowkitConfig = getDefaultConfig({
  appName: 'Location NFT Minter',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [polygonMumbai, polygon, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
})