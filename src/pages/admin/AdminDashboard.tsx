
import React from 'react';
import { DashboardCard } from '@/components/ui/dashboard/DashboardCard';
import { BarChart } from '@/components/ui/dashboard/BarChart';
import { PieChart } from '@/components/ui/dashboard/PieChart';
import { LineChart } from '@/components/ui/dashboard/LineChart';
import { getDashboardStats } from '@/lib/mock-data';
import { Users, FileCheck, Clock, AlertCircle, CheckCircle, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
  const stats = getDashboardStats();
  
  // Mock data for charts
  const monthlyData = [
    { name: 'Jan', pending: 4, approved: 10, rejected: 2, completed: 8 },
    { name: 'Feb', pending: 3, approved: 12, rejected: 1, completed: 10 },
    { name: 'Mar', pending: 5, approved: 15, rejected: 2, completed: 12 },
    { name: 'Apr', pending: 2, approved: 18, rejected: 3, completed: 14 },
    { name: 'May', pending: 6, approved: 14, rejected: 1, completed: 11 },
    { name: 'Jun', pending: 4, approved: 16, rejected: 2, completed: 13 },
  ];
  
  const departmentData = [
    { name: 'Engineering', permissions: 25 },
    { name: 'Marketing', permissions: 18 },
    { name: 'HR', permissions: 12 },
    { name: 'Finance', permissions: 15 },
    { name: 'Operations', permissions: 20 },
  ];
  
  const statusData = [
    { name: 'Pending', value: stats.pendingPermissions, color: '#FFC107' },
    { name: 'Approved', value: stats.approvedPermissions, color: '#2196F3' },
    { name: 'Rejected', value: stats.rejectedPermissions, color: '#F44336' },
    { name: 'Completed', value: stats.completedPermissions, color: '#4CAF50' },
  ];
  
  const typeData = [
    { name: 'Jan', sick: 5, vacation: 8, personal: 4, other: 2 },
    { name: 'Feb', sick: 7, vacation: 10, personal: 3, other: 1 },
    { name: 'Mar', sick: 4, vacation: 12, personal: 6, other: 3 },
    { name: 'Apr', sick: 6, vacation: 15, personal: 5, other: 2 },
    { name: 'May', sick: 8, vacation: 9, personal: 7, other: 1 },
    { name: 'Jun', sick: 5, vacation: 11, personal: 4, other: 3 },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all permissions and user activities.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Total Permissions"
          value={stats.totalPermissions}
          icon={<FileCheck className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Pending Permissions"
          value={stats.pendingPermissions}
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 5, isPositive: false }}
        />
        <DashboardCard
          title="Completed Permissions"
          value={stats.completedPermissions}
          icon={<CheckCircle className="h-4 w-4" />}
          trend={{ value: 20, isPositive: true }}
        />
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <BarChart
          title="Permission Status by Month"
          data={monthlyData}
          categories={[
            { key: 'pending', name: 'Pending', color: '#FFC107' },
            { key: 'approved', name: 'Approved', color: '#2196F3' },
            { key: 'rejected', name: 'Rejected', color: '#F44336' },
            { key: 'completed', name: 'Completed', color: '#4CAF50' },
          ]}
          xAxisDataKey="name"
        />
        <PieChart
          title="Permissions by Status"
          data={statusData}
        />
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <LineChart
          title="Permission Types by Month"
          data={typeData}
          categories={[
            { key: 'sick', name: 'Sick Leave', color: '#F44336' },
            { key: 'vacation', name: 'Vacation', color: '#2196F3' },
            { key: 'personal', name: 'Personal', color: '#9C27B0' },
            { key: 'other', name: 'Other', color: '#757575' },
          ]}
          xAxisDataKey="name"
        />
        <BarChart
          title="Permissions by Department"
          data={departmentData}
          categories={[
            { key: 'permissions', name: 'Permissions', color: '#4CAF50' },
          ]}
          xAxisDataKey="name"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
