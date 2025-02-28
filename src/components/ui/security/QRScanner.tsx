
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Permission } from '@/types';
import { getPermissionById } from '@/lib/mock-data';

import { CameraError } from './qr-scanner/CameraError';
import { CameraView } from './qr-scanner/CameraView';
import { PermissionDetails } from './qr-scanner/PermissionDetails';
import { ScannerControls } from './qr-scanner/ScannerControls';
import { checkAvailableCameras, requestCameraPermission, getCameraErrorMessage } from './qr-scanner/cameraUtils';

interface QRScannerProps {
  onScanComplete: (permissionId: string, isCheckIn: boolean) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanComplete }) => {
  const [permissionData, setPermissionData] = useState<Permission | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraAttempted, setCameraAttempted] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Reset camera error when starting scan
  useEffect(() => {
    if (isScanning) {
      setCameraError(null);
    }
  }, [isScanning]);

  // Check for available cameras when component mounts
  useEffect(() => {
    async function initCameras() {
      const cameras = await checkAvailableCameras();
      setAvailableCameras(cameras);
      
      if (cameras.length > 0) {
        setSelectedCamera(cameras[0].deviceId);
      } else {
        setCameraError("No cameras detected on your device.");
      }
    }
    
    initCameras();
  }, []);
  
  // Handle QR code scan result
  const handleScan = (result: any) => {
    if (result && !permissionData) {
      const permissionId = result?.text;
      console.log("QR scan successful:", permissionId);
      
      if (permissionId) {
        // Get permission data
        const permission = getPermissionById(permissionId);
        
        if (!permission) {
          toast({
            title: 'Invalid QR Code',
            description: 'The scanned QR code is not valid.',
            variant: 'destructive',
          });
          return;
        }
        
        if (permission.status !== 'approved' && permission.status !== 'completed') {
          toast({
            title: 'Permission Not Approved',
            description: 'This permission has not been approved yet.',
            variant: 'destructive',
          });
          return;
        }
        
        setPermissionData(permission);
        setIsScanning(false);
        
        // Determine if this is check-in or check-out
        if (permission.checkInTime && !permission.checkOutTime) {
          setIsCheckIn(false);
        } else {
          setIsCheckIn(true);
        }
      }
    }
  };
  
  const handleError = (error: any) => {
    console.error("QR Scanner Error:", error);
    setCameraAttempted(true);
    
    // Set a user-friendly error message based on the error
    const errorMessage = getCameraErrorMessage(error);
    
    setCameraError(errorMessage);
    
    toast({
      title: 'Camera Error',
      description: errorMessage,
      variant: 'destructive',
    });
    
    setIsScanning(false);
  };
  
  const handleStartScan = async () => {
    try {
      const hasPermission = await requestCameraPermission(selectedCamera);
      
      if (hasPermission) {
        setCameraError(null);
        setIsScanning(true);
        setCameraAttempted(true);
      } else {
        throw new Error("Camera access is not supported in this browser");
      }
    } catch (error) {
      console.error("Error when requesting camera permission:", error);
      handleError(error);
    }
  };
  
  const handleConfirm = () => {
    if (permissionData) {
      onScanComplete(permissionData.id, isCheckIn);
      setPermissionData(null);
    }
  };
  
  const handleCancel = () => {
    setPermissionData(null);
  };

  const handleRetryScan = () => {
    setCameraError(null);
    setCameraAttempted(false);
    setIsScanning(false);
  };
  
  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
  };
  
  const renderScannerContent = () => {
    if (!permissionData) {
      if (isScanning) {
        if (cameraError) {
          return (
            <CameraError 
              errorMessage={cameraError}
              onRetry={handleRetryScan}
              availableCameras={availableCameras}
              selectedCamera={selectedCamera}
              onCameraChange={handleCameraChange}
            />
          );
        }
        
        return (
          <CameraView 
            onScan={handleScan}
            onError={handleError}
            selectedCamera={selectedCamera}
            availableCameras={availableCameras}
            onCameraChange={handleCameraChange}
            onCancel={() => setIsScanning(false)}
          />
        );
      }
      
      return (
        <ScannerControls 
          onStartScan={handleStartScan}
          isDisabled={availableCameras.length === 0}
          cameraError={cameraError}
          cameraAttempted={cameraAttempted}
          onRetry={handleRetryScan}
          noCamerasDetected={availableCameras.length === 0}
        />
      );
    }
    
    return (
      <PermissionDetails 
        permissionData={permissionData}
        isCheckIn={isCheckIn}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>
          Scan employee permission QR codes for check-in and check-out
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderScannerContent()}
        </div>
      </CardContent>
      {permissionData && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>
            Confirm {isCheckIn ? 'Check In' : 'Check Out'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
