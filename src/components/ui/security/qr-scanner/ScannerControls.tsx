
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Camera, Smartphone } from 'lucide-react';
import { isCameraSupported } from './cameraUtils';

interface ScannerControlsProps {
  onStartScan: () => void;
  isDisabled: boolean;
  cameraError: string | null;
  cameraAttempted: boolean;
  onRetry: () => void;
  noCamerasDetected: boolean;
}

export const ScannerControls: React.FC<ScannerControlsProps> = ({
  onStartScan,
  isDisabled,
  cameraError,
  cameraAttempted,
  onRetry,
  noCamerasDetected,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStartScan = async () => {
    setIsLoading(true);
    // Add a small delay to ensure UI updates before starting camera
    setTimeout(() => {
      onStartScan();
      setIsLoading(false);
    }, 500);
  };
  
  const cameraSupported = isCameraSupported();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  return (
    <div className="flex flex-col items-center gap-4">
      {!cameraSupported ? (
        <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-md">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <h3 className="font-medium text-amber-800">Camera Not Supported</h3>
          <p className="text-sm text-amber-700 mt-1">
            Your browser doesn't support camera access. Please try a different browser like Chrome or Safari.
          </p>
        </div>
      ) : (
        <>
          <Button 
            onClick={handleStartScan}
            disabled={isDisabled || isLoading}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isLoading ? "Initializing Camera..." : (
              <>
                <Camera className="mr-2 h-4 w-4" /> Start Scanning
              </>
            )}
          </Button>
          
          {isMobile && (
            <div className="text-sm text-blue-600 mt-1 mb-2 text-center">
              <Smartphone className="inline-block mr-1 h-4 w-4" />
              <span>You may need to grant camera permissions in your device settings</span>
            </div>
          )}
          
          {cameraAttempted && cameraError && (
            <div className="text-sm text-red-500 mt-2 text-center p-4 bg-red-50 border border-red-100 rounded-md w-full">
              <p>{cameraError}</p>
              <Button 
                variant="link" 
                className="text-sm p-0 h-auto mt-1 text-red-600" 
                onClick={onRetry}
              >
                Try again
              </Button>
              
              {(cameraError.includes("denied") || cameraError.includes("permission")) && (
                <p className="mt-2 text-xs">
                  Try opening your browser settings and enabling camera access for this site.
                  <br />
                  On iOS: Settings → Safari → Camera → Allow
                  <br />
                  On Android: Settings → Site Settings → Camera → Allow
                </p>
              )}
            </div>
          )}
          
          {noCamerasDetected && !cameraAttempted && (
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-100">
              No cameras detected. Please ensure your device has a camera and you've granted permission.
            </p>
          )}
        </>
      )}
    </div>
  );
};
