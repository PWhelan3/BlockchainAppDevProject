import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Home, User, Map, Palette, PlusCircle } from 'lucide-react'
import useStore from '../store/useStore'



const Layout = ({ children }) => {
  const location = useLocation()
  const { address, isConnected } = useAccount()
  const { setUserAddress, clearUser } = useStore()

  // Update store when wallet connection changes
  React.useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address)
    } else {
      clearUser()
    }
  }, [isConnected, address, setUserAddress, clearUser])

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/pages/MapPage', label: 'Map', icon: Map },
    { path: '/pages/MintPage', label: 'Mint', icon: PlusCircle },
    { path: '/pages/ProfilePage', label: 'Profile', icon: User },
    { path: '/pages/ArtistProfilePage', label: 'Artist', icon: Palette },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-700 to-blue-500 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">Current</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            {/* Connect Wallet Button */}
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                location.pathname === path
                  ? 'text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout