
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PermissionStatusBadge, PermissionTypeBadge } from '@/components/ui/permissions/PermissionBadge';
import { formatDateTime, calculateDuration } from '@/lib/utils';
import { getPermissionsWithUserData } from '@/lib/mock-data';
import { Permission, User } from '@/types';
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPermissions = () => {
  const [permissions, setPermissions] = useState(getPermissionsWithUserData());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<(Permission & { user: User }) | null>(null);
  const { toast } = useToast();
  
  const filteredPermissions = permissions.filter(p => 
    p.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewPermission = (permission: Permission & { user: User }) => {
    setSelectedPermission(permission);
  };
  
  const handleApprovePermission = (id: string) => {
    // In a real app, this would be an API call
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, status: 'approved', approvedAt: new Date().toISOString(), qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}` } : p
    ));
    
    toast({
      title: 'Permission Approved',
      description: 'The permission has been approved successfully.',
    });
    
    if (selectedPermission && selectedPermission.id === id) {
      setSelectedPermission({
        ...selectedPermission,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`
      });
    }
  };
  
  const handleRejectPermission = (id: string) => {
    // In a real app, this would be an API call
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, status: 'rejected', approvedAt: new Date().toISOString() } : p
    ));
    
    toast({
      title: 'Permission Rejected',
      description: 'The permission has been rejected.',
    });
    
    if (selectedPermission && selectedPermission.id === id) {
      setSelectedPermission({
        ...selectedPermission,
        status: 'rejected',
        approvedAt: new Date().toISOString(),
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Permissions</h1>
        <p className="text-muted-foreground">
          View and manage all permission requests from employees.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all permission requests.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No permissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.user.name}</TableCell>
                  <TableCell>
                    <PermissionTypeBadge type={permission.type} />
                  </TableCell>
                  <TableCell>{formatDateTime(permission.startTime)}</TableCell>
                  <TableCell>{calculateDuration(permission.startTime, permission.endTime)}</TableCell>
                  <TableCell>
                    <PermissionStatusBadge status={permission.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewPermission(permission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {permission.status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleApprovePermission(permission.id)}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRejectPermission(permission.id)}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={!!selectedPermission} onOpenChange={(open) => !open && setSelectedPermission(null)}>
        {selectedPermission && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Permission Details</DialogTitle>
              <DialogDescription>
                Request from {selectedPermission.user.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status:</span>
                <PermissionStatusBadge status={selectedPermission.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Type:</span>
                <PermissionTypeBadge type={selectedPermission.type} />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">Reason:</span>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {selectedPermission.reason}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Start Time:</span>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(selectedPermission.startTime)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">End Time:</span>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(selectedPermission.endTime)}
                  </p>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">Duration:</span>
                <p className="text-sm text-gray-600">
                  {calculateDuration(selectedPermission.startTime, selectedPermission.endTime)}
                </p>
              </div>
              {selectedPermission.approvedAt && (
                <div>
                  <span className="text-sm font-medium">
                    {selectedPermission.status === 'approved' || selectedPermission.status === 'completed' 
                      ? 'Approved At:' 
                      : 'Rejected At:'}
                  </span>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(selectedPermission.approvedAt)}
                  </p>
                </div>
              )}
              {selectedPermission.status === 'completed' && (
                <>
                  <div>
                    <span className="text-sm font-medium">Check In Time:</span>
                    <p className="text-sm text-gray-600">
                      {selectedPermission.checkInTime 
                        ? formatDateTime(selectedPermission.checkInTime) 
                        : 'Not checked in yet'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Check Out Time:</span>
                    <p className="text-sm text-gray-600">
                      {selectedPermission.checkOutTime 
                        ? formatDateTime(selectedPermission.checkOutTime) 
                        : 'Not checked out yet'}
                    </p>
                  </div>
                </>
              )}
              
              {selectedPermission.status === 'pending' && (
                <div className="flex space-x-2 justify-end mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleRejectPermission(selectedPermission.id)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApprovePermission(selectedPermission.id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AdminPermissions;
