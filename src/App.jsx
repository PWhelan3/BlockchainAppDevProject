import React from 'react'
import { useState } from 'react'
import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import ArtistProfilePage from './pages/ArtistProfilePage'
import MapPage from './pages/MapPage'
import MintPage from './pages/MintPage'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages/ProfilePage" element={<ProfilePage />} />
                <Route path="/pages/ArtistProfilePage" element={<ArtistProfilePage />} />
                <Route path="/pages/MapPage" element={<MapPage />} />
                <Route path="/pages/MintPage" element={<MintPage />} />
              </Routes>
            </Layout>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
