// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiMap, FiBookOpen, FiUser, FiCompass } from "react-icons/fi";
import useAppStore from '../store/appStore'; // CORRIGIDO: de useSidebarStore para useAppStore
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  // CORRIGIDO: de useSidebarStore para useAppStore e de isOpen para isSidebarOpen
  const { isSidebarOpen, openSidebar, closeSidebar } = useAppStore();

  const activeLinkStyle = { 
    backgroundColor: 'rgba(204, 164, 59, 0.1)',
    color: '#CCA43B'
  };

  return (
    <motion.aside 
      className="glass-card h-screen flex flex-col font-inter fixed left-0 top-0 z-50 p-4"
      // CORRIGIDO: de isOpen para isSidebarOpen
      animate={{ width: isSidebarOpen ? '16rem' : '5rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onMouseEnter={openSidebar}
      onMouseLeave={closeSidebar}
    >
      <div className="flex items-center justify-center mb-12 h-[36px]">
        <AnimatePresence>
          {isSidebarOpen && ( // CORRIGIDO: de isOpen para isSidebarOpen
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              className="font-montserrat text-3xl font-bold text-accent-glow"
            >
              Sherloc
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex flex-col space-y-2">
        {[
          { to: "/explorar", icon: FiCompass, label: "Explorar" },
          { to: "/dashboard", icon: FiGrid, label: "Dashboard" },
          { to: "/mapa", icon: FiMap, label: "Mapa" },
          { to: "/roteiros", icon: FiBookOpen, label: "Roteiros" },
          { to: "/perfil", icon: FiUser, label: "Perfil" },
        ].map(item => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.to} 
              to={item.to} 
              style={({ isActive }) => isActive ? activeLinkStyle : {}} 
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-text-secondary hover:bg-white/5 transition-colors ${!isSidebarOpen && 'justify-center'}`}
              title={item.label}
            >
              <Icon size={isSidebarOpen ? 20 : 24} className="flex-shrink-0" />
              <AnimatePresence>
                {isSidebarOpen && ( // CORRIGIDO: de isOpen para isSidebarOpen
                  <motion.span 
                    className="whitespace-nowrap font-semibold"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;