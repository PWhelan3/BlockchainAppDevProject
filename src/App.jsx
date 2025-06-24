// src/App.jsx - FIXED VERSION
import React from 'react'
import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { config } from './config/wagmi'

// Import page components
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import ArtistProfilePage from './pages/ArtistProfilePage'
import MapPage from './pages/MapPage'
import MintPage from './pages/MintPage'
import ClaimPage from './pages/ClaimPage'
import NotFoundPage from './pages/NotFoundPage'

// Import wallet integration components
import ProtectedRoute from './components/ProtectedRoute'

// RainbowKit styles - MUST be imported
import '@rainbow-me/rainbowkit/styles.css'

/**
 * Query client configuration for React Query
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

/**
 * Main App Component - FIXED VERSION
 * Only place where providers should be configured
 */
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#7c3aed', // Purple to match app theme
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
          showRecentTransactions={true}
          modalSize="compact"
        >
          <Router>
            <Layout>
              {/* Toast notifications */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
              
              {/* Main application routes */}
              <Routes>
                {/* Public Routes - NO wallet required */}
                <Route path="/" element={<HomePage />} />
                
                {/* Map page - accessible without wallet, enhanced with wallet */}
                <Route 
                  path="/map" 
                  element={
                    <ProtectedRoute requireConnection={false}>
                      <MapPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Artist profile page - accessible without wallet */}
                <Route 
                  path="/artist/:artistId" 
                  element={
                    <ProtectedRoute requireConnection={false}>
                      <ArtistProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Claim page - accessible without wallet initially for QR scanning */}
                <Route 
                  path="/claim/:tokenId" 
                  element={
                    <ProtectedRoute requireConnection={false}>
                      <ClaimPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* PROTECTED Routes - wallet required */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute requireConnection={true}>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/mint" 
                  element={
                    <ProtectedRoute requireConnection={true}>
                      <MintPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App