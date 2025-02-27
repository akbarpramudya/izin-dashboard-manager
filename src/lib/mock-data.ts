
import { Department, Permission, User, PermissionType, PermissionStatus } from "@/types";
import { generateQRCode } from "./utils";

// Mock Departments
export const departments: Department[] = [
  { id: "dept-1", name: "Human Resources" },
  { id: "dept-2", name: "Engineering" },
  { id: "dept-3", name: "Marketing" },
  { id: "dept-4", name: "Finance" },
  { id: "dept-5", name: "Operations" },
];

// Mock Users
export const users: User[] = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff",
  },
  {
    id: "user-2",
    name: "John Employee",
    email: "john@example.com",
    role: "employee",
    departmentId: "dept-2",
    profileImage: "https://ui-avatars.com/api/?name=John+Employee&background=27AE60&color=fff",
  },
  {
    id: "user-3",
    name: "Jane Employee",
    email: "jane@example.com",
    role: "employee",
    departmentId: "dept-3",
    profileImage: "https://ui-avatars.com/api/?name=Jane+Employee&background=8E44AD&color=fff",
  },
  {
    id: "user-4",
    name: "Security Guard",
    email: "security@example.com",
    role: "security",
    profileImage: "https://ui-avatars.com/api/?name=Security+Guard&background=E74C3C&color=fff",
  },
];

// Generate a list of permissions
const generatePermissions = (): Permission[] => {
  const types: PermissionType[] = ["sick", "vacation", "personal", "other"];
  const statuses: PermissionStatus[] = ["pending", "approved", "rejected", "completed"];
  
  const permissions: Permission[] = [];
  
  // Generate permissions for each employee
  for (let i = 0; i < 50; i++) {
    const userId = i % 3 === 0 ? "user-2" : "user-3";
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate dates
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - Math.floor(Math.random() * 30));
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + Math.floor(Math.random() * 72) + 1);
    
    const createdAt = new Date(startDate);
    createdAt.setDate(startDate.getDate() - Math.floor(Math.random() * 5));
    
    let approvedAt = undefined;
    let checkInTime = undefined;
    let checkOutTime = undefined;
    
    if (status === "approved" || status === "completed") {
      const approvalDate = new Date(createdAt);
      approvalDate.setHours(createdAt.getHours() + Math.floor(Math.random() * 48) + 1);
      approvedAt = approvalDate.toISOString();
    }
    
    if (status === "completed") {
      const checkIn = new Date(startDate);
      checkInTime = checkIn.toISOString();
      
      const checkOut = new Date(endDate);
      checkOutTime = checkOut.toISOString();
    }
    
    const qrCode = status === "approved" ? generateQRCode(`permission-${i + 1}`) : undefined;
    
    permissions.push({
      id: `permission-${i + 1}`,
      userId,
      type,
      reason: `${type} permission reason ${i + 1}`,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      status,
      createdAt: createdAt.toISOString(),
      approvedAt,
      approvedBy: approvedAt ? "user-1" : undefined,
      checkInTime,
      checkOutTime,
      qrCode,
    });
  }
  
  return permissions;
};

export const permissions: Permission[] = generatePermissions();

// Get a subset of the most recent permissions
export const getRecentPermissions = (count: number = 5): Permission[] => {
  return [...permissions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
};

// Get permissions by user ID
export const getPermissionsByUserId = (userId: string): Permission[] => {
  return permissions.filter(permission => permission.userId === userId);
};

// Get permissions by status
export const getPermissionsByStatus = (status: PermissionStatus): Permission[] => {
  return permissions.filter(permission => permission.status === status);
};

// Get dashboard stats
export const getDashboardStats = () => {
  return {
    totalUsers: users.filter(user => user.role === "employee").length,
    totalPermissions: permissions.length,
    pendingPermissions: permissions.filter(p => p.status === "pending").length,
    approvedPermissions: permissions.filter(p => p.status === "approved").length,
    rejectedPermissions: permissions.filter(p => p.status === "rejected").length,
    completedPermissions: permissions.filter(p => p.status === "completed").length,
  };
};

// Get user stats
export const getUserStats = (userId: string) => {
  const userPermissions = permissions.filter(p => p.userId === userId);
  
  return {
    totalPermissions: userPermissions.length,
    pendingPermissions: userPermissions.filter(p => p.status === "pending").length,
    approvedPermissions: userPermissions.filter(p => p.status === "approved").length,
    rejectedPermissions: userPermissions.filter(p => p.status === "rejected").length,
    completedPermissions: userPermissions.filter(p => p.status === "completed").length,
  };
};

// Get user by ID
export const getUserById = (userId: string): User | undefined => {
  return users.find(user => user.id === userId);
};

// Get department by ID
export const getDepartmentById = (departmentId: string): Department | undefined => {
  return departments.find(dept => dept.id === departmentId);
};

// Get permission by ID
export const getPermissionById = (permissionId: string): Permission | undefined => {
  return permissions.find(permission => permission.id === permissionId);
};

// Helper to get permissions with user data
export const getPermissionsWithUserData = (): (Permission & { user: User })[] => {
  return permissions.map(permission => {
    const user = getUserById(permission.userId);
    return {
      ...permission,
      user: user as User,
    };
  });
};
