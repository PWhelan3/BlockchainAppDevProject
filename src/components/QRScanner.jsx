// src/components/QRScanner.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * QRScanner Component - Scans QR codes for NFT claiming
 * 
 * Uses HTML5 QR code scanner to detect QR codes from camera
 * Extracts claim URLs and validates them before processing
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onScan - Callback when QR code is successfully scanned
 * @param {Function} props.onClose - Callback to close the scanner
 * @param {boolean} props.isOpen - Whether scanner is open/active
 */
export const QRScanner = ({ onScan, onClose, isOpen }) => {
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const scannerRef = useRef(null);

  /**
   * Initialize QR code scanner when component opens
   */
  useEffect(() => {
    if (isOpen && !scanner) {
      initializeScanner();
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [isOpen]);

  /**
   * Set up HTML5 QR code scanner
   */
  const initializeScanner = async () => {
    try {
      // Check camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately after permission check
      setHasPermission(true);

      const qrScanner = new Html5QrcodeScanner(
        "qr-scanner-container",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
        },
        false // verbose logging
      );

      qrScanner.render(
        (decodedText) => handleScanSuccess(decodedText),
        (errorMessage) => handleScanError(errorMessage)
      );

      setScanner(qrScanner);
      setIsScanning(true);
    } catch (error) {
      console.error('Camera permission denied:', error);
      setHasPermission(false);
      toast.error('Camera permission is required to scan QR codes');
    }
  };

  /**
   * Handle successful QR code scan
   * @param {string} decodedText - The decoded QR code text (URL)
   */
  const handleScanSuccess = (decodedText) => {
    try {
      // Validate that this is a claim URL
      const url = new URL(decodedText);
      
      // Check if it's a valid claim URL from our domain
      const isValidClaimUrl = url.pathname.startsWith('/claim/');
      
      if (!isValidClaimUrl) {
        toast.error('This QR code is not for NFT claiming');
        return;
      }

      // Extract token ID from URL
      const tokenId = url.pathname.split('/claim/')[1];
      
      // Extract coordinates from query parameters
      const lat = url.searchParams.get('lat');
      const lng = url.searchParams.get('lng');

      if (!tokenId || !lat || !lng) {
        toast.error('Invalid claim QR code format');
        return;
      }

      // Stop scanning and pass data to parent
      setIsScanning(false);
      onScan({
        tokenId,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        claimUrl: decodedText
      });

      toast.success('QR code scanned successfully!');
      
    } catch (error) {
      console.error('Invalid QR code URL:', error);
      toast.error('Invalid QR code format');
    }
  };

  /**
   * Handle scan errors (mostly can be ignored as they're frequent during scanning)
   * @param {string} errorMessage - Error message from scanner
   */
  const handleScanError = (errorMessage) => {
    // Most scan "errors" are just failed attempts while scanning
    // Only log actual errors, not "No QR code found" messages
    if (!errorMessage.includes('No QR code found')) {
      console.warn('QR scan error:', errorMessage);
    }
  };

  /**
   * Close scanner and clean up resources
   */
  const handleClose = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
      setScanner(null);
    }
    setIsScanning(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Scan QR Code
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scanner Content */}
        <div className="p-4">
          {hasPermission === false ? (
            // Permission denied state
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Camera Permission Required
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Please allow camera access to scan QR codes. You may need to refresh the page and try again.
                </p>
                <button
                  onClick={initializeScanner}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : hasPermission === null ? (
            // Loading state
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-600">
                Requesting camera permission...
              </p>
            </div>
          ) : (
            // Scanner active state
            <div className="space-y-4">
              {/* Scanner container */}
              <div id="qr-scanner-container" className="w-full"></div>
              
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Scanning Instructions:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Point your camera at the QR code</li>
                      <li>• Ensure good lighting and steady hands</li>
                      <li>• QR code should fill most of the scan area</li>
                      <li>• Allow camera to focus automatically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};