
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PermissionStatus, PermissionType } from '@/types';
import { getPermissionTypeLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PermissionStatusBadgeProps {
  status: PermissionStatus;
}

export const PermissionStatusBadge: React.FC<PermissionStatusBadgeProps> = ({ status }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let label: string = status;
  
  switch (status) {
    case "pending":
      variant = "outline";
      label = "Pending";
      break;
    case "approved":
      variant = "secondary";
      label = "Approved";
      break;
    case "rejected":
      variant = "destructive";
      label = "Rejected";
      break;
    case "completed":
      variant = "default";
      label = "Completed";
      break;
  }
  
  return (
    <Badge variant={variant} className={cn(
      status === "pending" && "border-yellow-500 bg-yellow-50 text-yellow-700",
      status === "approved" && "border-blue-500 bg-blue-50 text-blue-700",
      status === "rejected" && "border-red-500 bg-red-50 text-red-700",
      status === "completed" && "border-green-500 bg-green-50 text-green-700",
    )}>
      {label}
    </Badge>
  );
};

interface PermissionTypeBadgeProps {
  type: PermissionType;
}

export const PermissionTypeBadge: React.FC<PermissionTypeBadgeProps> = ({ type }) => {
  let bgClass = "bg-gray-100 text-gray-800";
  
  switch (type) {
    case "sick":
      bgClass = "bg-red-100 text-red-800";
      break;
    case "vacation":
      bgClass = "bg-blue-100 text-blue-800";
      break;
    case "personal":
      bgClass = "bg-purple-100 text-purple-800";
      break;
    case "other":
      bgClass = "bg-gray-100 text-gray-800";
      break;
  }
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgClass}`}>
      {getPermissionTypeLabel(type)}
    </div>
  );
};
