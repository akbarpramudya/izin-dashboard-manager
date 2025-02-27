
import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { UserRole } from '@/types';

interface MainLayoutProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  allowedRoles,
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20"></div>
          <div className="h-4 w-40 rounded bg-primary/20"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" />;
      case 'employee':
        return <Navigate to="/employee/dashboard" />;
      case 'security':
        return <Navigate to="/security/scan" />;
      default:
        return <Navigate to={redirectTo} />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} role={user.role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          onToggleSidebar={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="mx-auto max-w-7xl animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
