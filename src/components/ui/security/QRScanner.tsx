
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Permission } from '@/types';
import { getPermissionById } from '@/lib/mock-data';
import { formatDate, formatTime } from '@/lib/utils';

interface QRScannerProps {
  onScanComplete: (permissionId: string, isCheckIn: boolean) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanComplete }) => {
  const [permissionData, setPermissionData] = useState<Permission | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(true);
  const { toast } = useToast();
  
  // Handle QR code scan result
  const handleScan = (result: any) => {
    if (result && !permissionData) {
      const permissionId = result?.text;
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
    toast({
      title: 'Scan Error',
      description: error?.message || 'An error occurred while scanning',
      variant: 'destructive',
    });
    setIsScanning(false);
  };
  
  const handleStartScan = () => {
    setIsScanning(true);
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
              <div className="relative">
                <QrReader
                  constraints={{
                    facingMode: 'environment' // Use the back camera
                  }}
                  onResult={handleScan}
                  scanDelay={500}
                  className="w-full aspect-square max-w-xs mx-auto border border-gray-300 rounded-md overflow-hidden"
                  videoStyle={{ objectFit: 'cover' }}
                  videoContainerStyle={{ padding: 0 }}
                />
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setIsScanning(false)}>Cancel Scanning</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button onClick={handleStartScan}>Start Scanning</Button>
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
