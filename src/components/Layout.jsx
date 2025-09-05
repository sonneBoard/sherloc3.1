import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex bg-sherloc-dark min-h-screen">
      <Sidebar />
      <main className="flex-1">
        {/* O Outlet é o placeholder onde as páginas (Mapa, Dashboard, etc.) serão renderizadas */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;