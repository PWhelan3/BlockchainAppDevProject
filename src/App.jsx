import React from 'react'
import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'

// Import your existing components
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import ArtistProfilePage from './pages/ArtistProfilePage'
import MapPage from './pages/MapPage'
import MintPage from './pages/MintPage'

// Import wallet integration components
import ProtectedRoute from './components/ProtectedRoute'

// RainbowKit styles - imported at component level to ensure proper loading
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#7c3aed', // Purple to match your app theme
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
          showRecentTransactions={true}
        >
          <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                
                {/* Map page - accessible without wallet but enhanced with wallet */}
                <Route 
                  path="/pages/MapPage" 
                  element={
                    <ProtectedRoute requireConnection={false}>
                      <MapPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Routes - Require Wallet Connection */}
                <Route 
                  path="/pages/ProfilePage" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/pages/ArtistProfilePage" 
                  element={
                    <ProtectedRoute>
                      <ArtistProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/pages/MintPage" 
                  element={
                    <ProtectedRoute>
                      <MintPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Alternative route paths for easier navigation */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/artist/:id" 
                  element={
                    <ProtectedRoute>
                      <ArtistProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/map" 
                  element={
                    <ProtectedRoute requireConnection={false}>
                      <MapPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/mint" 
                  element={
                    <ProtectedRoute>
                      <MintPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch-all route for 404 */}
                <Route 
                  path="*" 
                  element={
                    <div className="min-h-[60vh] flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
                        <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                        <a 
                          href="/" 
                          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Go Home
                        </a>
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </Layout>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App