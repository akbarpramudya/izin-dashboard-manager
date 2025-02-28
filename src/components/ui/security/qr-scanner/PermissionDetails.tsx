
import React from 'react';
import { Button } from '@/components/ui/button';
import { Permission } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';

interface PermissionDetailsProps {
  permissionData: Permission;
  isCheckIn: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PermissionDetails: React.FC<PermissionDetailsProps> = ({
  permissionData,
  isCheckIn,
  onConfirm,
  onCancel,
}) => {
  return (
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
  );
};
