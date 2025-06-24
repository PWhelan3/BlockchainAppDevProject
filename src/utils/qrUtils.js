// src/utils/qrUtils.js
/**
 * Utility functions for QR code operations
 */

import QRCode from 'qrcode';

/**
 * Generate QR code data URL
 * @param {string} text - Text to encode in QR code
 * @param {Object} options - QR code generation options
 * @returns {Promise<string>} - Data URL of the QR code image
 */
export const generateQRCode = async (text, options = {}) => {
  const defaultOptions = {
    width: 256,
    margin: 4,
    color: {
      dark: '#7c3aed',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  };

  try {
    const qrDataUrl = await QRCode.toDataURL(text, {
      ...defaultOptions,
      ...options
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Parse claim URL from QR code data
 * @param {string} qrText - Text decoded from QR code
 * @returns {Object|null} - Parsed claim data or null if invalid
 */
export const parseClaimUrl = (qrText) => {
  try {
    const url = new URL(qrText);
    
    // Validate claim URL format
    if (!url.pathname.startsWith('/claim/')) {
      return null;
    }

    const tokenId = url.pathname.split('/claim/')[1];
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');

    if (!tokenId || !lat || !lng) {
      return null;
    }

    return {
      tokenId,
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      claimUrl: qrText
    };
  } catch (error) {
    console.error('Error parsing claim URL:', error);
    return null;
  }
};

/**
 * Generate claim URL for an NFT
 * @param {string} tokenId - NFT token ID
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {string} baseUrl - Base URL for the application
 * @returns {string} - Complete claim URL
 */
export const generateClaimUrl = (tokenId, latitude, longitude, baseUrl = window.location.origin) => {
  return `${baseUrl}/claim/${tokenId}?lat=${latitude}&lng=${longitude}`;
};

/**
 * Validate QR code content for NFT claiming
 * @param {string} qrText - Text decoded from QR code
 * @param {string} expectedDomain - Expected domain for security
 * @returns {boolean} - Whether QR code is valid for claiming
 */
export const validateClaimQR = (qrText, expectedDomain = window.location.hostname) => {
  try {
    const url = new URL(qrText);
    
    // Check domain matches (security check)
    if (url.hostname !== expectedDomain) {
      return false;
    }

    // Check URL format
    if (!url.pathname.startsWith('/claim/')) {
      return false;
    }

    // Check required parameters
    const tokenId = url.pathname.split('/claim/')[1];
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');

    return !!(tokenId && lat && lng);
  } catch (error) {
    return false;
  }
};