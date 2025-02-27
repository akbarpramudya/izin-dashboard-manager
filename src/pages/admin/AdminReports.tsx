
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PermissionStatusBadge, PermissionTypeBadge } from '@/components/ui/permissions/PermissionBadge';
import { formatDateTime, calculateDuration } from '@/lib/utils';
import { getPermissionsWithUserData } from '@/lib/mock-data';
import { Permission, User } from '@/types';
import { Search, Download, Filter, Calendar } from 'lucide-react';
import { PieChart } from '@/components/ui/dashboard/PieChart';
import { BarChart } from '@/components/ui/dashboard/BarChart';

const AdminReports = () => {
  const [permissions] = useState(getPermissionsWithUserData());
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all'); // 'all', 'week', 'month', 'year'
  
  // Filter permissions based on search term and date range
  const filteredPermissions = permissions.filter(p => {
    // Search term filter
    const matchesSearch = 
      p.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange !== 'all') {
      const permissionDate = new Date(p.createdAt);
      const now = new Date();
      
      if (dateRange === 'week') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        matchesDateRange = permissionDate >= oneWeekAgo;
      } else if (dateRange === 'month') {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        matchesDateRange = permissionDate >= oneMonthAgo;
      } else if (dateRange === 'year') {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        matchesDateRange = permissionDate >= oneYearAgo;
      }
    }
    
    return matchesSearch && matchesDateRange;
  });
  
  // Calculate stats for charts
  const statusCounts = {
    pending: filteredPermissions.filter(p => p.status === 'pending').length,
    approved: filteredPermissions.filter(p => p.status === 'approved').length,
    rejected: filteredPermissions.filter(p => p.status === 'rejected').length,
    completed: filteredPermissions.filter(p => p.status === 'completed').length,
  };
  
  const typeCounts = {
    sick: filteredPermissions.filter(p => p.type === 'sick').length,
    vacation: filteredPermissions.filter(p => p.type === 'vacation').length,
    personal: filteredPermissions.filter(p => p.type === 'personal').length,
    other: filteredPermissions.filter(p => p.type === 'other').length,
  };
  
  // Prepare chart data
  const statusData = [
    { name: 'Pending', value: statusCounts.pending, color: '#FFC107' },
    { name: 'Approved', value: statusCounts.approved, color: '#2196F3' },
    { name: 'Rejected', value: statusCounts.rejected, color: '#F44336' },
    { name: 'Completed', value: statusCounts.completed, color: '#4CAF50' },
  ];
  
  const typeData = [
    { name: 'Sick Leave', value: typeCounts.sick, color: '#F44336' },
    { name: 'Vacation', value: typeCounts.vacation, color: '#2196F3' },
    { name: 'Personal', value: typeCounts.personal, color: '#9C27B0' },
    { name: 'Other', value: typeCounts.other, color: '#757575' },
  ];
  
  // Group permissions by department for chart
  const departmentMap = new Map<string, number>();
  filteredPermissions.forEach(p => {
    const deptName = p.user.departmentId || 'Unknown';
    departmentMap.set(deptName, (departmentMap.get(deptName) || 0) + 1);
  });
  
  const departmentData = Array.from(departmentMap.entries()).map(([name, count]) => ({
    name,
    permissions: count,
  }));
  
  // Handle download report
  const handleDownloadReport = () => {
    // In a real app, this would generate a CSV or PDF report
    alert('Report download functionality would be implemented here');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and view reports of permission activities.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="join">
            <Button 
              variant={dateRange === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setDateRange('all')}
            >
              All Time
            </Button>
            <Button 
              variant={dateRange === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setDateRange('week')}
            >
              This Week
            </Button>
            <Button 
              variant={dateRange === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setDateRange('month')}
            >
              This Month
            </Button>
            <Button 
              variant={dateRange === 'year' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setDateRange('year')}
            >
              This Year
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
          <Button onClick={handleDownloadReport} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Permission Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b pb-2">
                <span>Total Permissions:</span>
                <span className="font-bold">{filteredPermissions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending:</span>
                <span>{statusCounts.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Approved:</span>
                <span>{statusCounts.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rejected:</span>
                <span>{statusCounts.rejected}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Completed:</span>
                <span>{statusCounts.completed}</span>
              </div>
              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between items-center">
                  <span>Sick Leave:</span>
                  <span>{typeCounts.sick}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vacation:</span>
                  <span>{typeCounts.vacation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Personal:</span>
                  <span>{typeCounts.personal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Other:</span>
                  <span>{typeCounts.other}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <PieChart
          title="Permissions by Status"
          data={statusData}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart
          title="Permissions by Type"
          data={typeData}
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
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>Complete permissions report</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No permissions found for the selected criteria
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
                  <TableCell>{formatDateTime(permission.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminReports;
