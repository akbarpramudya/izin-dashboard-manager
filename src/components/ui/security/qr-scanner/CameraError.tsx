
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraErrorProps {
  errorMessage: string;
  onRetry: () => void;
  availableCameras: MediaDeviceInfo[];
  selectedCamera: string | null;
  onCameraChange: (cameraId: string) => void;
}

export const CameraError: React.FC<CameraErrorProps> = ({
  errorMessage,
  onRetry,
  availableCameras,
  selectedCamera,
  onCameraChange,
}) => {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-md text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
      <h3 className="text-red-800 font-medium">Camera Error</h3>
      <p className="text-red-600 mt-1 text-sm">{errorMessage}</p>
      <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
        {availableCameras.length > 1 && (
          <div className="mt-2 sm:mt-0">
            <select 
              className="px-3 py-2 border rounded-md" 
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
        )}
      </div>
    </div>
  );
};
