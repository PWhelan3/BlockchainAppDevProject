// src/hooks/useGeolocation.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for geolocation functionality
 * Provides location data, error handling, and loading states
 */
export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    ...options
  };

  /**
   * Get current position
   */
  const getCurrentPosition = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      defaultOptions
    );
  }, [defaultOptions]);

  /**
   * Calculate distance between two points using Haversine formula
   */
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }, []);

  /**
   * Check if current location is within range of target location
   */
  const isWithinRange = useCallback((targetLat, targetLng, maxDistance = 100) => {
    if (!location) return false;
    
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      targetLat,
      targetLng
    );
    
    return distance <= maxDistance;
  }, [location, calculateDistance]);

  return {
    location,
    error,
    loading,
    getCurrentPosition,
    calculateDistance,
    isWithinRange
  };
};