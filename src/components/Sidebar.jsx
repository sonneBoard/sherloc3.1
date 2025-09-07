import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiMap, FiBookOpen, FiUser } from "react-icons/fi";
import useSidebarStore from '../store/sidebarStore';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { isOpen, openSidebar, closeSidebar } = useSidebarStore();

  const activeLinkStyle = { backgroundColor: '#1A1B26', color: '#C778DD' };

  return (
    // Adicionamos os eventos onMouseEnter e onMouseLeave
    <motion.aside 
      className="h-screen bg-sherloc-dark-2 text-sherloc-text p-5 flex flex-col font-lexend fixed left-0 top-0 z-50"
      animate={{ width: isOpen ? '16rem' : '5rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onMouseEnter={openSidebar}
      onMouseLeave={closeSidebar}
    >
      <div className="flex items-center justify-center mb-12">
        <AnimatePresence>
          {isOpen && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-poppins text-3xl font-bold text-sherloc-purple"
            >
              Sherloc
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex flex-col space-y-3">
        {[
          { to: "/dashboard", icon: <FiGrid size={20} />, label: "Dashboard" },
          { to: "/mapa", icon: <FiMap size={20} />, label: "Mapa" },
          { to: "/roteiros", icon: <FiBookOpen size={20} />, label: "Meus Roteiros" },
          { to: "/perfil", icon: <FiUser size={20} />, label: "Perfil" },
        ].map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => isActive ? activeLinkStyle : {}} className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            {item.icon}
            <AnimatePresence>
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto', transition: { delay: 0.1 } }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>
      {/* ... (rodapé) */}
    </motion.aside>
  );
};

export default Sidebar;