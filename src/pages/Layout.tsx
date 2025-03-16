import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { AuthProvider } from '@/contexts/AuthContext';

const Layout = () => {
  return (
    <AuthProvider>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar className="hidden md:block" />
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
    </div>
    </AuthProvider>
  );
};

export default Layout;
