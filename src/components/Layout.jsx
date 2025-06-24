// src/components/Layout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Map, Home, User, Palette, Zap } from 'lucide-react';
import { WalletButton } from './WalletButton';

/**
 * Layout Component - Main application layout wrapper
 *
 * Features:
 * - Responsive navigation header with mobile menu
 * - Consistent styling across all pages
 * - Wallet connection integration
 * - Active route highlighting
 * - Mobile-first responsive design
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in main content area
 */
const Layout = ({ children }) => {
  // State for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get current location for active link highlighting
  const location = useLocation();

  /**
   * Navigation items configuration
   * Each item contains path, label, and icon for consistent rendering
   */
  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/mint', label: 'Mint', icon: Zap },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/artist', label: 'Artist', icon: Palette },
  ];

  /**
   * Toggle mobile menu visibility
   * Prevents body scroll when menu is open on mobile
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Prevent body scroll when mobile menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  /**
   * Check if a navigation path is currently active
   * Handles exact matching for home route and partial matching for others
   * 
   * @param {string} path - The navigation path to check
   * @returns {boolean} - Whether the path is currently active
   */
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  /**
   * Close mobile menu when clicking outside or on a link
   * Used for better UX on mobile devices
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
                onClick={closeMobileMenu}
              >
                {/* Brand icon with lightning bolt representing blockchain energy */}
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span>Current</span>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActiveRoute(path)
                      ? 'text-purple-600 bg-purple-50 border border-purple-200'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            {/* Right side: Wallet button and mobile menu toggle */}
            <div className="flex items-center space-x-4">
              {/* Wallet connection button */}
              <WalletButton size="sm" variant="default" />

              {/* Mobile menu toggle button - Only visible on mobile */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
                data-testid="mobile-menu-button"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - Slides down from header */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            data-testid="mobile-menu"
          >
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                    ${isActiveRoute(path)
                      ? 'text-purple-600 bg-purple-50 border border-purple-200'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 
          Render child components passed to Layout
          This is where page-specific content will appear
        */}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Footer brand and description */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-500 rounded flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span>Current</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Discover art on the blockchain
              </p>
            </div>

            {/* Footer links */}
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-purple-600 transition-colors">
                About
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors">
                Support
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-500">
              © 2025 Current. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;