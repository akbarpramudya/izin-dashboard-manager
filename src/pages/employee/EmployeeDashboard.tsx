
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionType, UserStats, Permission } from '@/types';
import { formatDate, getPermissionTypeLabel } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PermissionForm } from '@/components/ui/permissions/PermissionForm';
import { PermissionStatusBadge } from '@/components/ui/permissions/PermissionBadge';

// Mock employee stats
const mockStats: UserStats = {
  totalPermissions: 12,
  pendingPermissions: 2,
  approvedPermissions: 8,
  rejectedPermissions: 1,
  completedPermissions: 1,
};

// Mock employee permissions
const mockPermissions: Permission[] = [
  {
    id: 'perm-1',
    userId: 'user-2',
    type: 'sick',
    reason: 'Demam tinggi',
    startTime: new Date(2023, 5, 10, 9, 0).toISOString(),
    endTime: new Date(2023, 5, 12, 17, 0).toISOString(),
    status: 'completed',
    createdAt: new Date(2023, 5, 8, 10, 30).toISOString(),
    approvedAt: new Date(2023, 5, 8, 14, 0).toISOString(),
    approvedBy: 'user-1',
    checkInTime: new Date(2023, 5, 10, 9, 5).toISOString(),
    checkOutTime: new Date(2023, 5, 12, 16, 45).toISOString(),
  },
  {
    id: 'perm-2',
    userId: 'user-2',
    type: 'vacation',
    reason: 'Liburan keluarga',
    startTime: new Date(2023, 6, 1, 0, 0).toISOString(),
    endTime: new Date(2023, 6, 5, 23, 59).toISOString(),
    status: 'approved',
    createdAt: new Date(2023, 5, 15, 11, 0).toISOString(),
    approvedAt: new Date(2023, 5, 16, 9, 0).toISOString(),
    approvedBy: 'user-1',
  },
  {
    id: 'perm-3',
    userId: 'user-2',
    type: 'personal',
    reason: 'Urusan keluarga',
    startTime: new Date(2023, 6, 20, 9, 0).toISOString(),
    endTime: new Date(2023, 6, 20, 14, 0).toISOString(),
    status: 'pending',
    createdAt: new Date(2023, 6, 15, 16, 30).toISOString(),
  },
  {
    id: 'perm-4',
    userId: 'user-2',
    type: 'other',
    reason: 'Kegiatan amal',
    startTime: new Date(2023, 5, 25, 13, 0).toISOString(),
    endTime: new Date(2023, 5, 25, 17, 0).toISOString(),
    status: 'rejected',
    createdAt: new Date(2023, 5, 20, 10, 0).toISOString(),
    approvedAt: new Date(2023, 5, 21, 9, 30).toISOString(),
    approvedBy: 'user-1',
  },
];

const EmployeeDashboard = () => {
  const [stats, setStats] = useState<UserStats>(mockStats);
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // In a real app, this would load from an API
  useEffect(() => {
    // This would be an API call in a real app
    setStats(mockStats);
    setPermissions(mockPermissions);
  }, []);

  const handleNewPermission = (newPermission: Required<Omit<Permission, 'id' | 'userId' | 'createdAt' | 'status'>> & { qrCode?: string }) => {
    const permission: Permission = {
      ...newPermission,
      id: `perm-${permissions.length + 1}`,
      userId: 'user-2',
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setPermissions([permission, ...permissions]);
    setStats({
      ...stats,
      totalPermissions: stats.totalPermissions + 1,
      pendingPermissions: stats.pendingPermissions + 1,
    });

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Karyawan</h1>
          <p className="text-muted-foreground">
            Kelola permintaan izin dan pantau status
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              Permintaan Izin Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajukan Permintaan Izin</DialogTitle>
              <DialogDescription>
                Isi detail untuk mengajukan permintaan izin baru
              </DialogDescription>
            </DialogHeader>
            <PermissionForm onSubmit={handleNewPermission} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Izin</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPermissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPermissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedPermissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejectedPermissions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Permintaan Izin</CardTitle>
          <CardDescription>
            Daftar semua permintaan izin yang telah Anda ajukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="pending">Menunggu</TabsTrigger>
              <TabsTrigger value="approved">Disetujui</TabsTrigger>
              <TabsTrigger value="rejected">Ditolak</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {renderPermissionsList(permissions)}
            </TabsContent>
            <TabsContent value="pending">
              {renderPermissionsList(permissions.filter(p => p.status === 'pending'))}
            </TabsContent>
            <TabsContent value="approved">
              {renderPermissionsList(permissions.filter(p => p.status === 'approved'))}
            </TabsContent>
            <TabsContent value="rejected">
              {renderPermissionsList(permissions.filter(p => p.status === 'rejected'))}
            </TabsContent>
            <TabsContent value="completed">
              {renderPermissionsList(permissions.filter(p => p.status === 'completed'))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const renderPermissionsList = (permissions: Permission[]) => {
  if (permissions.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Tidak ada permintaan izin ditemukan
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {permissions.map(permission => (
        <Card key={permission.id} className="overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">
                    {getPermissionTypeLabel(permission.type as PermissionType)}
                  </h3>
                  <PermissionStatusBadge status={permission.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{permission.reason}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="font-normal">
                    Mulai: {formatDate(permission.startTime)}
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    Selesai: {formatDate(permission.endTime)}
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    Diajukan: {formatDate(permission.createdAt)}
                  </Badge>
                </div>
              </div>
              {permission.status === 'approved' && !permission.checkInTime && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Lihat QR Code</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>QR Code Izin</DialogTitle>
                      <DialogDescription>
                        Tunjukkan QR code ini kepada petugas keamanan saat masuk dan keluar
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${permission.id}`} 
                        alt="QR Code" 
                        className="h-60 w-60"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EmployeeDashboard;
