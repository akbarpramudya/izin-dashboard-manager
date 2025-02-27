
export type UserRole = 'admin' | 'employee' | 'security';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  profileImage?: string;
}

export interface Department {
  id: string;
  name: string;
}

export type PermissionStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type PermissionType = 'sick' | 'vacation' | 'personal' | 'other';

export interface Permission {
  id: string;
  userId: string;
  user?: User;
  type: PermissionType;
  reason: string;
  startTime: string;
  endTime: string;
  status: PermissionStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  checkInTime?: string;
  checkOutTime?: string;
  qrCode?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalPermissions: number;
  pendingPermissions: number;
  approvedPermissions: number;
  rejectedPermissions: number;
  completedPermissions: number;
}

export interface UserStats {
  totalPermissions: number;
  pendingPermissions: number;
  approvedPermissions: number;
  rejectedPermissions: number;
  completedPermissions: number;
}
