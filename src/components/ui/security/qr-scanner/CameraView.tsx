
import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, RefreshCw } from 'lucide-react';

interface CameraViewProps {
  onScan: (result: any) => void;
  onError: (error: any) => void;
  selectedCamera: string | null;
  availableCameras: MediaDeviceInfo[];
  onCameraChange: (cameraId: string) => void;
  onCancel: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  onScan,
  onError,
  selectedCamera,
  availableCameras,
  onCameraChange,
  onCancel,
}) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);

  // Added timer to hide initializing state after a reasonable time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 5000); // 5 seconds should be enough
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {isInitializing && !cameraReady && (
        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center z-10 rounded-md">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-sm text-gray-600">Initializing camera...</p>
        </div>
      )}
    
      <div className={isInitializing && !cameraReady ? "opacity-0" : "opacity-100"}>
        <QrReader
          constraints={{
            facingMode: "environment",
            deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          }}
          onResult={(result, error) => {
            if (error) {
              // Don't pass every frame error to the parent
              if (error.name !== "NotFoundException") {
                onError(error);
              }
              return;
            }
            
            // Camera is working if we get here
            if (!cameraReady) {
              setCameraReady(true);
              setIsInitializing(false);
            }
            
            onScan(result);
          }}
          scanDelay={500}
          className="w-full aspect-square max-w-xs mx-auto border border-gray-300 rounded-md overflow-hidden"
          videoStyle={{ 
            objectFit: 'cover',
            width: '100%',
            height: '100%' 
          }}
          videoContainerStyle={{ 
            padding: 0,
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
          containerStyle={{ 
            borderRadius: '0.375rem',
            overflow: 'hidden'
          }}
        />
      </div>

      <div className="mt-4 space-y-3">
        {availableCameras.length > 1 && (
          <div className="text-center">
            <label className="block text-sm text-gray-600 mb-1">Select camera:</label>
            <div className="flex justify-center">
              <select 
                className="px-2 py-1 border rounded-md text-sm" 
                value={selectedCamera || ''} 
                onChange={(e) => onCameraChange(e.target.value)}
              >
                {availableCameras.map(camera => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${camera.deviceId.slice(0, 5)}...`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} className="flex items-center">
            Cancel
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setCameraReady(false);
              setIsInitializing(true);
              onCancel();
              // Allow a brief moment before restarting
              setTimeout(() => {
                onCameraChange(selectedCamera || '');
              }, 500);
            }}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Restart Camera
          </Button>
        </div>
      </div>
    </div>
  );
};
