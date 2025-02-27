
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionBadge } from '@/components/ui/permissions/PermissionBadge';
import { QRCodeDisplay } from '@/components/ui/permissions/QRCodeDisplay';
import { formatDate, formatTime } from '@/lib/utils';
import { Permission } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ScanIcon, CheckCircle, Clock } from 'lucide-react';

// Mock permission data
const mockPermissions: Permission[] = [
  {
    id: 'perm-1',
    userId: 'user-2',
    user: {
      id: 'user-2',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'employee',
      departmentId: 'dept-1',
    },
    type: 'sick',
    reason: 'Demam tinggi',
    startTime: new Date(2023, 5, 10, 9, 0).toISOString(),
    endTime: new Date(2023, 5, 12, 17, 0).toISOString(),
    status: 'approved',
    createdAt: new Date(2023, 5, 8, 10, 30).toISOString(),
    approvedAt: new Date(2023, 5, 8, 14, 0).toISOString(),
    approvedBy: 'user-1',
  },
  {
    id: 'perm-2',
    userId: 'user-3',
    user: {
      id: 'user-3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'employee',
      departmentId: 'dept-2',
    },
    type: 'vacation',
    reason: 'Liburan keluarga',
    startTime: new Date(2023, 6, 1, 0, 0).toISOString(),
    endTime: new Date(2023, 6, 5, 23, 59).toISOString(),
    status: 'approved',
    createdAt: new Date(2023, 5, 15, 11, 0).toISOString(),
    approvedAt: new Date(2023, 5, 16, 9, 0).toISOString(),
    approvedBy: 'user-1',
    checkInTime: new Date(2023, 6, 1, 8, 45).toISOString(),
  },
];

const SecurityScan = () => {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [scanMode, setScanMode] = useState(false);
  const [scannedPermission, setScannedPermission] = useState<Permission | null>(null);
  const { toast } = useToast();

  // In a real application, this would use a real QR code scanner
  const handleScan = (data: string) => {
    // Simulate QR code scanning
    setScanMode(false);
    
    // Find the permission by ID
    const permission = permissions.find(p => p.id === data);
    
    if (permission) {
      setScannedPermission(permission);
    } else {
      toast({
        title: "Permintaan izin tidak ditemukan",
        description: "QR code tidak valid atau izin tidak ditemukan.",
        variant: "destructive",
      });
    }
  };

  const simulateScan = () => {
    setScanMode(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      // Randomly select a permission
      const randomIndex = Math.floor(Math.random() * permissions.length);
      handleScan(permissions[randomIndex].id);
    }, 2000);
  };

  const handleCheckIn = (permissionId: string) => {
    // Update permission with check-in time
    setPermissions(permissions.map(p => {
      if (p.id === permissionId) {
        return {
          ...p,
          checkInTime: new Date().toISOString(),
        };
      }
      return p;
    }));
    
    setScannedPermission(null);
    
    toast({
      title: "Check-in berhasil",
      description: "Karyawan telah berhasil check-in.",
    });
  };

  const handleCheckOut = (permissionId: string) => {
    // Update permission with check-out time
    setPermissions(permissions.map(p => {
      if (p.id === permissionId) {
        return {
          ...p,
          checkOutTime: new Date().toISOString(),
          status: 'completed',
        };
      }
      return p;
    }));
    
    setScannedPermission(null);
    
    toast({
      title: "Check-out berhasil",
      description: "Karyawan telah berhasil check-out.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pemindai QR Keamanan</h1>
          <p className="text-muted-foreground">
            Pindai QR code untuk memverifikasi izin karyawan
          </p>
        </div>
        <Button onClick={simulateScan} className="flex items-center gap-2">
          <ScanIcon className="h-4 w-4" />
          Pindai QR
        </Button>
      </div>

      {scanMode && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-center">Pemindaian QR</CardTitle>
            <CardDescription className="text-center">
              Arahkan QR code ke kamera
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
              <div className="animate-pulse text-primary">
                <ScanIcon className="h-24 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {scannedPermission && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Detail Izin</CardTitle>
            <CardDescription>
              Informasi permintaan izin yang dipindai
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Nama Karyawan</p>
                <p>{scannedPermission.user?.name || 'Tidak diketahui'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Email</p>
                <p>{scannedPermission.user?.email || 'Tidak diketahui'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Jenis Izin</p>
                <p>{scannedPermission.type}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <PermissionBadge status={scannedPermission.status} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Mulai</p>
                <p>{formatDate(scannedPermission.startTime)} {formatTime(scannedPermission.startTime)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Selesai</p>
                <p>{formatDate(scannedPermission.endTime)} {formatTime(scannedPermission.endTime)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Alasan</p>
                <p>{scannedPermission.reason}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              {!scannedPermission.checkInTime ? (
                <Button onClick={() => handleCheckIn(scannedPermission.id)} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Check-In
                </Button>
              ) : !scannedPermission.checkOutTime ? (
                <Button onClick={() => handleCheckOut(scannedPermission.id)} className="gap-2">
                  <Clock className="h-4 w-4" />
                  Check-Out
                </Button>
              ) : (
                <Button disabled>Izin Selesai</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pemindaian Hari Ini</CardTitle>
          <CardDescription>
            Daftar karyawan yang telah dipindai hari ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="checkin">Check-In</TabsTrigger>
              <TabsTrigger value="checkout">Check-Out</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {renderScanHistory(permissions)}
            </TabsContent>
            <TabsContent value="checkin">
              {renderScanHistory(permissions.filter(p => p.checkInTime && !p.checkOutTime))}
            </TabsContent>
            <TabsContent value="checkout">
              {renderScanHistory(permissions.filter(p => p.checkOutTime))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const renderScanHistory = (permissions: Permission[]) => {
  if (permissions.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Tidak ada riwayat pemindaian
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {permissions.map(permission => (
        <Card key={permission.id}>
          <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-semibold">{permission.user?.name || 'Karyawan'}</h3>
                <p className="text-sm text-muted-foreground">{permission.type} - {permission.reason}</p>
              </div>
              <div className="flex items-center gap-2">
                <PermissionBadge status={permission.status} />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Detail</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detail Izin</DialogTitle>
                      <DialogDescription>
                        Informasi lengkap permintaan izin
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Nama Karyawan</p>
                        <p>{permission.user?.name || 'Tidak diketahui'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Email</p>
                        <p>{permission.user?.email || 'Tidak diketahui'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Jenis Izin</p>
                        <p>{permission.type}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Status</p>
                        <PermissionBadge status={permission.status} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Mulai</p>
                        <p>{formatDate(permission.startTime)} {formatTime(permission.startTime)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Selesai</p>
                        <p>{formatDate(permission.endTime)} {formatTime(permission.endTime)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Check-In</p>
                        <p>{permission.checkInTime ? formatDate(permission.checkInTime) + ' ' + formatTime(permission.checkInTime) : 'Belum'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Check-Out</p>
                        <p>{permission.checkOutTime ? formatDate(permission.checkOutTime) + ' ' + formatTime(permission.checkOutTime) : 'Belum'}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex mt-2 text-xs text-muted-foreground">
              {permission.checkInTime && (
                <div className="flex items-center gap-1 mr-4">
                  <CheckCircle className="h-3 w-3" />
                  <span>Check-In: {formatTime(permission.checkInTime)}</span>
                </div>
              )}
              {permission.checkOutTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Check-Out: {formatTime(permission.checkOutTime)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SecurityScan;
