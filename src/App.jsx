// src/App.jsx - SIMPLIFIED VERSION
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
 * Query client configuration with better error handling
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

/**
 * Main App Component - SIMPLIFIED VERSION
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
              {/* Toast notifications with better positioning */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    zIndex: 9999,
                  },
                  success: {
                    style: {
                      background: '#10b981',
                    },
                  },
                  error: {
                    style: {
                      background: '#ef4444',
                    },
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
                
                {/* Protected Routes - wallet connection REQUIRED */}
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
                
                <Route 
                  path="/claim/:qrId" 
                  element={
                    <ProtectedRoute requireConnection={true}>
                      <ClaimPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 route */}
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