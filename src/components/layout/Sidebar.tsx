
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Users,
  QrCode,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, role }) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { to: '/admin/permissions', label: 'Permissions', icon: <ClipboardList className="h-5 w-5" /> },
    { to: '/admin/reports', label: 'Reports', icon: <FileText className="h-5 w-5" /> },
    { to: '/admin/users', label: 'User Management', icon: <Users className="h-5 w-5" /> },
  ];
  
  const employeeLinks = [
    { to: '/employee/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { to: '/employee/permissions', label: 'My Permissions', icon: <ClipboardList className="h-5 w-5" /> },
  ];
  
  const securityLinks = [
    { to: '/security/scan', label: 'Scan QR', icon: <QrCode className="h-5 w-5" /> },
  ];
  
  const links = role === 'admin' 
    ? adminLinks 
    : role === 'employee' 
      ? employeeLinks 
      : securityLinks;
  
  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-gray-200 h-16">
        {!collapsed && (
          <span className="font-semibold text-lg text-gray-900">Izin Manager</span>
        )}
        {collapsed && (
          <span className="font-bold text-lg text-primary mx-auto">IM</span>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === link.to ? "bg-gray-100" : "text-gray-700 hover:text-gray-900"
                )}
              >
                <span className={cn(collapsed ? "mx-auto" : "mr-3")}>{link.icon}</span>
                {!collapsed && <span>{link.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 text-gray-700 hover:text-gray-900",
            collapsed && "justify-center"
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};
