
import React from 'react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="flex flex-col items-center gap-4">
      <Button 
        onClick={onStartScan}
        disabled={isDisabled}
      >
        Start Scanning
      </Button>
      {cameraAttempted && cameraError && (
        <div className="text-sm text-red-500 mt-2 text-center">
          <p>{cameraError}</p>
          <Button 
            variant="link" 
            className="text-sm p-0 h-auto mt-1 text-red-600" 
            onClick={onRetry}
          >
            Try again
          </Button>
        </div>
      )}
      {noCamerasDetected && !cameraAttempted && (
        <p className="text-sm text-amber-600">No cameras detected. Please ensure your device has a camera and you've granted permission.</p>
      )}
    </div>
  );
};
