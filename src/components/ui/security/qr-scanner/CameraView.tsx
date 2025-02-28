
import React from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="relative">
      <QrReader
        constraints={{
          facingMode: 'environment',
          deviceId: selectedCamera ? selectedCamera : undefined,
          aspectRatio: 1
        }}
        onResult={(result, error) => {
          if (error) {
            onError(error);
            return;
          }
          onScan(result);
        }}
        scanDelay={500}
        className="w-full aspect-square max-w-xs mx-auto border border-gray-300 rounded-md overflow-hidden"
        videoStyle={{ objectFit: 'cover' }}
        videoContainerStyle={{ padding: 0 }}
        containerStyle={{ borderRadius: '0.375rem' }}
      />
      {availableCameras.length > 1 && (
        <div className="mt-2 text-center">
          <label className="block text-sm text-gray-600 mb-1">Select camera:</label>
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
      )}
      <div className="mt-4 text-center">
        <Button variant="outline" onClick={onCancel}>Cancel Scanning</Button>
      </div>
    </div>
  );
};
