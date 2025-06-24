// src/components/QRGenerator.jsx
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Share2, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * QRGenerator Component - Generates QR codes for NFT claiming
 * 
 * Creates QR codes that link to the claim page for a specific NFT
 * Includes functionality to download, copy, and share QR codes
 * 
 * @param {Object} props - Component props
 * @param {string} props.tokenId - The NFT token ID
 * @param {Object} props.geoData - Geographic data for the NFT
 * @param {string} props.size - QR code size ('small', 'medium', 'large')
 */
export const QRGenerator = ({ tokenId, geoData, size = 'medium' }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Size configurations for QR codes
  const sizeConfig = {
    small: { width: 150, margin: 2 },
    medium: { width: 256, margin: 4 },
    large: { width: 400, margin: 6 }
  };

  /**
   * Generate the claim URL for this NFT
   * In production, this would be your deployed domain
   */
  const generateClaimUrl = () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000';
    
    return `${baseUrl}/claim/${tokenId}?lat=${geoData.latitude}&lng=${geoData.longitude}`;
  };

  /**
   * Generate QR code when component mounts or dependencies change
   */
  useEffect(() => {
    const generateQRCode = async () => {
      setIsGenerating(true);
      try {
        const claimUrl = generateClaimUrl();
        const qrDataUrl = await QRCode.toDataURL(claimUrl, {
          ...sizeConfig[size],
          color: {
            dark: '#7c3aed', // Purple color matching app theme
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M' // Medium error correction
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
        toast.error('Failed to generate QR code');
      } finally {
        setIsGenerating(false);
      }
    };

    if (tokenId && geoData) {
      generateQRCode();
    }
  }, [tokenId, geoData, size]);

  /**
   * Download QR code as PNG file
   */
  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `nft-${tokenId}-qr-code.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR code downloaded successfully');
  };

  /**
   * Copy claim URL to clipboard
   */
  const handleCopyUrl = async () => {
    try {
      const claimUrl = generateClaimUrl();
      await navigator.clipboard.writeText(claimUrl);
      toast.success('Claim URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL');
    }
  };

  /**
   * Share claim URL using Web Share API (if available)
   */
  const handleShare = async () => {
    const claimUrl = generateClaimUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Claim NFT #${tokenId}`,
          text: `Check out this geo-tagged NFT at ${geoData.location}`,
          url: claimUrl
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback to copying URL
      handleCopyUrl();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          QR Code for Claiming
        </h3>
        <p className="text-sm text-gray-600">
          Place this QR code at the artwork location for visitors to scan
        </p>
      </div>

      {/* QR Code Display */}
      <div className="flex justify-center">
        {isGenerating ? (
          <div className="flex items-center justify-center w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-500">Generating QR code...</p>
            </div>
          </div>
        ) : qrCodeUrl ? (
          <div className="relative">
            <img 
              src={qrCodeUrl} 
              alt={`QR code for NFT #${tokenId}`}
              className="rounded-lg shadow-sm"
            />
            
            {/* Location overlay */}
            <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1 flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{geoData.location}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">Failed to generate QR code</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleDownload}
          disabled={!qrCodeUrl}
          className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>

        <button
          onClick={handleCopyUrl}
          disabled={!qrCodeUrl}
          className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span>Copy URL</span>
        </button>

        <button
          onClick={handleShare}
          disabled={!qrCodeUrl}
          className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          How to use this QR code:
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Download and print the QR code</li>
          <li>• Place it at the artwork's physical location</li>
          <li>• Visitors can scan to claim a proof-of-presence NFT</li>
          <li>• Claims are verified using GPS coordinates</li>
        </ul>
      </div>
    </div>
  );
};