
import React, { useState } from 'react';
import { QRScanner } from '@/components/ui/security/QRScanner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getPermissionById, getUserById } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { PermissionStatusBadge } from '@/components/ui/permissions/PermissionBadge';
import { formatDate, formatTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { PermissionStatus } from '@/types';

const SecurityScan = () => {
  const { toast } = useToast();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  
  // Handle scan complete
  const handleScanComplete = (permissionId: string, isCheckIn: boolean) => {
    setScannedCode(permissionId);
    toast({
      title: "QR Code Scanned",
      description: `Successfully scanned permission: ${permissionId}`,
    });
    
    if (isCheckIn) {
      handleCheckIn();
    } else {
      handleCheckOut();
    }
  };
  
  // Get permission data from scanned code
  const permissionData = scannedCode ? getPermissionById(scannedCode) : null;
  const userData = permissionData?.userId ? getUserById(permissionData.userId) : null;
  
  // Handle check in
  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    toast({
      title: "Checked In",
      description: `Employee checked in at ${formatTime(now)}`,
    });
  };
  
  // Handle check out
  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(now);
    toast({
      title: "Checked Out",
      description: `Employee checked out at ${formatTime(now)}`,
    });
  };
  
  // Reset scan
  const handleReset = () => {
    setScannedCode(null);
    setCheckInTime(null);
    setCheckOutTime(null);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Scanner</h1>
        <p className="text-muted-foreground">
          Scan employee permission QR codes for check-in and check-out
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>
              Point the camera at the employee's permission QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!scannedCode ? (
              <QRScanner onScanComplete={handleScanComplete} />
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-100 rounded-md">
                <p className="text-center text-gray-500">Code scanned successfully</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={handleReset}>Reset Scanner</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Permission Details</CardTitle>
            <CardDescription>
              {scannedCode ? "View scanned permission details" : "Scan a QR code to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {permissionData && userData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Employee Information</h3>
                  <p className="text-sm">{userData.name}</p>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Permission Information</h3>
                  <div className="flex items-center gap-2 my-1">
                    <span className="text-sm">Status:</span>
                    <PermissionStatusBadge status={permissionData.status as PermissionStatus} />
                  </div>
                  <p className="text-sm"><span className="font-medium">Type:</span> {permissionData.type}</p>
                  <p className="text-sm"><span className="font-medium">Reason:</span> {permissionData.reason}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">
                      Start: {formatDate(permissionData.startTime)}
                    </Badge>
                    <Badge variant="outline">
                      End: {formatDate(permissionData.endTime)}
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button 
                    onClick={handleCheckIn} 
                    disabled={!!checkInTime || permissionData.status !== 'approved'}
                    className="flex-1"
                  >
                    {checkInTime ? `Checked In: ${formatTime(checkInTime)}` : 'Check In'}
                  </Button>
                  <Button 
                    onClick={handleCheckOut} 
                    disabled={!checkInTime || !!checkOutTime}
                    variant="outline"
                    className="flex-1"
                  >
                    {checkOutTime ? `Checked Out: ${formatTime(checkOutTime)}` : 'Check Out'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-center text-muted-foreground">
                  {scannedCode 
                    ? "Invalid permission code scanned" 
                    : "Scan a permission QR code to view details"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityScan;
