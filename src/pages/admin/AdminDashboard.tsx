
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardCard } from '@/components/ui/dashboard/DashboardCard';
import { BarChart } from '@/components/ui/dashboard/BarChart';
import { PieChart } from '@/components/ui/dashboard/PieChart';
import { LineChart } from '@/components/ui/dashboard/LineChart';
import { getDashboardStats } from '@/lib/mock-data';
import { 
  Users, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  LayoutDashboard, 
  ClipboardList, 
  FileText, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const stats = getDashboardStats();
  const [collapsed, setCollapsed] = useState(false);
  
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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {!collapsed && <span className="font-semibold text-lg">Admin Panel</span>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="ml-auto"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin/dashboard" 
                className="flex items-center p-2 rounded-md text-gray-900 bg-gray-100"
              >
                <LayoutDashboard size={20} />
                {!collapsed && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/permissions" 
                className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <ClipboardList size={20} />
                {!collapsed && <span className="ml-3">Permissions</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/reports" 
                className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <FileText size={20} />
                {!collapsed && <span className="ml-3">Reports</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <Users size={20} />
                {!collapsed && <span className="ml-3">Users</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
