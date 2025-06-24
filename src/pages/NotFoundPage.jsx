// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Map, Search } from 'lucide-react';

/**
 * NotFoundPage Component - 404 error page
 * 
 * Provides helpful navigation options when users hit a non-existent route
 * Includes links to main sections and a search suggestion
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-purple-600">404</div>
          <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-lg text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>

          <Link
            to="/map"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-purple-500 hover:text-purple-600 transition-colors font-medium"
          >
            <Map className="w-5 h-5" />
            <span>Explore Map</span>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-col space-y-2">
            <Link to="/profile" className="text-purple-600 hover:text-purple-700 text-sm">
              View Your Profile
            </Link>
            <Link to="/mint" className="text-purple-600 hover:text-purple-700 text-sm">
              Create New NFT
            </Link>
            <Link to="/artist" className="text-purple-600 hover:text-purple-700 text-sm">
              Browse Artists
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;