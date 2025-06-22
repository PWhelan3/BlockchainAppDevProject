import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygon, polygonMumbai, sepolia, mainnet } from 'wagmi/chains'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '178fd38f4bcee3614df5176873ebb5c5'

export const rainbowkitConfig = getDefaultConfig({
  appName: 'Current',
  projectId: projectId,
  chains: [polygonMumbai, polygon, sepolia, mainnet],
  ssr: false,
})