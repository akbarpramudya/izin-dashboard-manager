
import React, { useState, useEffect, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Permission } from '@/types';
import { getPermissionById } from '@/lib/mock-data';
import { formatDate, formatTime } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react'; 

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
    async function checkCameras() {
      try {
        // Check if the MediaDevices API is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.error("MediaDevices API not supported in this browser");
          setCameraError("Camera access is not supported in this browser. Try updating your browser or using Chrome/Firefox.");
          return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        console.log("Available cameras:", videoDevices);
        setAvailableCameras(videoDevices);
        
        // If there are cameras available, select the first one by default
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        } else {
          setCameraError("No cameras detected on your device.");
        }
      } catch (error) {
        console.error("Error accessing camera devices:", error);
        setCameraError("Unable to access camera devices. Please check your permissions.");
      }
    }
    
    checkCameras();
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
    let errorMessage = "An error occurred while accessing the camera.";
    
    if (error?.name === "NotAllowedError") {
      errorMessage = "Camera access was denied. Please allow camera access in your browser settings.";
    } else if (error?.name === "NotFoundError") {
      errorMessage = "No camera was found on your device.";
    } else if (error?.name === "NotReadableError") {
      errorMessage = "The camera is already in use by another application.";
    } else if (error?.name === "OverconstrainedError") {
      errorMessage = "The requested camera does not meet the required constraints.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
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
      // Request camera permission explicitly before starting scan
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ 
          video: selectedCamera 
            ? { deviceId: { exact: selectedCamera } }
            : true 
        });
        
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
  
  const renderCameraOrError = () => {
    if (cameraError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-red-800 font-medium">Camera Error</h3>
          <p className="text-red-600 mt-1 text-sm">{cameraError}</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={handleRetryScan}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
            {availableCameras.length > 1 && (
              <div className="mt-2 sm:mt-0">
                <select 
                  className="px-3 py-2 border rounded-md" 
                  value={selectedCamera || ''} 
                  onChange={(e) => setSelectedCamera(e.target.value)}
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
    }
    
    return (
      <div className="relative">
        <QrReader
          constraints={{
            facingMode: 'environment', // Use the back camera by default
            deviceId: selectedCamera ? selectedCamera : undefined,
            aspectRatio: 1 // Force a square aspect ratio for better scanning
          }}
          onResult={(result, error) => {
            if (error) {
              handleError(error);
              return;
            }
            handleScan(result);
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
              onChange={(e) => setSelectedCamera(e.target.value)}
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
          <Button variant="outline" onClick={() => setIsScanning(false)}>Cancel Scanning</Button>
        </div>
      </div>
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
        {!permissionData ? (
          <div className="space-y-4">
            {isScanning ? (
              renderCameraOrError()
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Button 
                  onClick={handleStartScan}
                  disabled={availableCameras.length === 0}
                >
                  Start Scanning
                </Button>
                {cameraAttempted && cameraError && (
                  <div className="text-sm text-red-500 mt-2 text-center">
                    <p>{cameraError}</p>
                    <Button 
                      variant="link" 
                      className="text-sm p-0 h-auto mt-1 text-red-600" 
                      onClick={handleRetryScan}
                    >
                      Try again
                    </Button>
                  </div>
                )}
                {availableCameras.length === 0 && !cameraAttempted && (
                  <p className="text-sm text-amber-600">No cameras detected. Please ensure your device has a camera and you've granted permission.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-md">
              <h3 className="font-medium text-lg">{isCheckIn ? 'Check In' : 'Check Out'}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Employee:</span>
                  <span className="text-sm font-medium">{permissionData.user?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Permission ID:</span>
                  <span className="text-sm font-medium">{permissionData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valid From:</span>
                  <span className="text-sm font-medium">
                    {formatDate(permissionData.startTime)} {formatTime(permissionData.startTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valid Until:</span>
                  <span className="text-sm font-medium">
                    {formatDate(permissionData.endTime)} {formatTime(permissionData.endTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
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
