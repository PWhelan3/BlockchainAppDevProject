// src/pages/HomePage.jsx (Enhanced with comprehensive comments)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { 
  Map, 
  Zap, 
  User, 
  Palette, 
  TrendingUp, 
  Globe, 
  Users,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { WalletButton } from '../components/WalletButton';

/**
 * HomePage Component - Landing page for the Current NFT platform
 * 
 * Features:
 * - Hero section with main value proposition
 * - Feature showcase cards
 * - Platform statistics (mock data for demo)
 * - Call-to-action sections
 * - Responsive design with mobile-first approach
 */
const HomePage = () => {
  // Get wallet connection status
  const { isConnected } = useAccount();
  
  // State for animated statistics (for demo purposes)
  const [stats, setStats] = useState({
    nftsMinted: 0,
    activeArtists: 0,
    countries: 0
  });

  /**
   * Target statistics for animation
   * In production, these would come from your backend API
   */
  const targetStats = {
    nftsMinted: 1234,
    activeArtists: 567,
    countries: 89
  };

  /**
   * Animate statistics numbers on component mount
   * Creates a counting effect for better visual appeal
   */
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        nftsMinted: Math.floor(targetStats.nftsMinted * progress),
        activeArtists: Math.floor(targetStats.activeArtists * progress),
        countries: Math.floor(targetStats.countries * progress)
      });

      if (currentStep >= steps) {
        setStats(targetStats);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  /**
   * Feature cards configuration
   * Each card represents a core platform feature
   */
  const features = [
    {
      icon: Map,
      title: 'Explore Map',
      description: 'Discover art and artists from around the world on our interactive map.',
      link: '/map',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Mint NFTs',
      description: 'Create and mint your digital art as NFTs on the blockchain.',
      link: '/mint',
      color: 'purple'
    },
    {
      icon: Palette,
      title: 'Artist Profiles',
      description: 'Showcase your work and connect with other artists and collectors.',
      link: '/artist',
      color: 'pink'
    }
  ];

  /**
   * Get color classes for feature cards
   * @param {string} color - Color name (blue, purple, pink)
   * @returns {Object} - Object containing color classes
   */
  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        icon: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        hover: 'hover:border-blue-300'
      },
      purple: {
        icon: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        hover: 'hover:border-purple-300'
      },
      pink: {
        icon: 'text-pink-600',
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        hover: 'hover:border-pink-300'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            
            {/* Main heading with gradient text */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              <span className="block">Discover Art on the</span>
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Blockchain
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Connect with artists, explore NFT collections, and discover digital art from around the world. 
              Mint, trade, and showcase your creations.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {!isConnected ? (
                <>
                  <WalletButton 
                    size="lg"
                    variant="default"
                  />
                  <Link
                    to="/map"
                    className="flex items-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-purple-900 transition-all duration-300 font-medium"
                  >
                    <Map className="w-5 h-5" />
                    <span>Explore Map</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/mint"
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium transform hover:scale-105"
                >
                  <Zap className="w-5 h-5" />
                  <span>Start Creating</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Connection status indicator */}
            <p className="text-purple-200 text-sm">
              {isConnected ? (
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Wallet connected - Ready to create!</span>
                </span>
              ) : (
                "Connect your wallet to get started"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explore Platform Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, discover, and collect digital art on the blockchain
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description, link, color }) => {
              const colors = getColorClasses(color);
              
              return (
                <Link
                  key={title}
                  to={link}
                  className={`
                    group p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                    ${colors.bg} ${colors.border} ${colors.hover}
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300
                    ${colors.bg}
                  `}>
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex items-center mt-4 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span className={colors.icon}>Learn more</span>
                    <ArrowRight className={`w-4 h-4 ml-1 ${colors.icon}`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Statistics cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* NFTs Minted */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stats.nftsMinted.toLocaleString()}
              </div>
              <div className="text-purple-100 text-lg">
                NFTs Minted
              </div>
            </div>

            {/* Active Artists */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stats.activeArtists.toLocaleString()}
              </div>
              <div className="text-purple-100 text-lg">
                Active Artists
              </div>
            </div>

            {/* Countries */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stats.countries}
              </div>
              <div className="text-purple-100 text-lg">
                Countries
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            
            {/* CTA heading */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-gray-600">
                Join thousands of artists and collectors on the world's most innovative NFT platform
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {!isConnected ? (
                <WalletButton 
                  size="lg"
                  variant="default"
                />
              ) : (
                <>
                  <Link
                    to="/mint"
                    className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium transform hover:scale-105"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Create Your First NFT</span>
                  </Link>
                  <Link
                    to="/map"
                    className="flex items-center space-x-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-purple-500 hover:text-purple-600 transition-all duration-300 font-medium"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Explore Artworks</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;