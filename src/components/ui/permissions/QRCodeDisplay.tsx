
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Printer, Share2 } from 'lucide-react';

interface QRCodeDisplayProps {
  permissionId: string;
  userName: string;
  startTime: string;
  endTime: string;
  qrCodeUrl: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  permissionId,
  userName,
  startTime,
  endTime,
  qrCodeUrl,
}) => {
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Permission QR Code</CardTitle>
        <CardDescription>
          Show this to the security personnel when entering and leaving
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <img 
            src={qrCodeUrl} 
            alt="Permission QR Code" 
            className="w-64 h-64 object-contain"
          />
        </div>
        <div className="w-full space-y-2 text-center">
          <p className="text-sm text-muted-foreground">Permission ID: {permissionId}</p>
          <p className="text-sm font-medium">{userName}</p>
          <div className="text-sm">
            <div>From: {formatDate(startTime)} {formatTime(startTime)}</div>
            <div>To: {formatDate(endTime)} {formatTime(endTime)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};
