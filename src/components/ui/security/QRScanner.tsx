
import React, { useState, useRef, useEffect } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  // Mock scanning functionality
  const handleStartScan = () => {
    setIsScanning(true);
    
    // In a real app, this would use a QR code scanning library
    // For this mock, we'll simulate finding a code after a delay
    setTimeout(() => {
      const mockPermissionId = 'permission-1'; // This would come from the QR scan
      handleScanResult(mockPermissionId);
    }, 2000);
  };
  
  const handleScanResult = (permissionId: string) => {
    setIsScanning(false);
    
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
    
    // Determine if this is check-in or check-out
    // If the permission already has a checkInTime but no checkOutTime, it's a check-out
    if (permission.checkInTime && !permission.checkOutTime) {
      setIsCheckIn(false);
    } else {
      setIsCheckIn(true);
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
  
  // Mock camera access
  useEffect(() => {
    if (isScanning && videoRef.current) {
      // In a real app, we would access the camera here
      // For this mock, we'll just display a placeholder
      const ctx = (videoRef.current as any).getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 300, 300);
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.fillText('Camera preview would appear here', 70, 150);
        
        // Draw scanning animation
        let y = 0;
        let direction = 1;
        
        const animate = () => {
          if (!isScanning) return;
          
          ctx.clearRect(0, 0, 300, 300);
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, 300, 300);
          ctx.fillStyle = '#333';
          ctx.font = '14px Arial';
          ctx.fillText('Camera preview would appear here', 70, 150);
          
          // Draw scanning line
          ctx.strokeStyle = '#4CAF50';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(300, y);
          ctx.stroke();
          
          y += direction * 5;
          if (y >= 300) direction = -1;
          if (y <= 0) direction = 1;
          
          requestAnimationFrame(animate);
        };
        
        animate();
      }
    }
  }, [isScanning]);
  
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
                <canvas 
                  ref={videoRef as any} 
                  width={300} 
                  height={300} 
                  className="mx-auto border border-gray-300 rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 border-2 border-primary"></div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground animate-pulse">Scanning...</p>
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
