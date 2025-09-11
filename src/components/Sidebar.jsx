import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiMap, FiBookOpen, FiUser } from "react-icons/fi";
import useSidebarStore from '../store/sidebarStore';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { isOpen, openSidebar, closeSidebar } = useSidebarStore();

  // Novo estilo para o link ativo no tema claro
  const activeLinkStyle = { 
    backgroundColor: '#FBBF24', // Dourado
    color: '#FFFFFF' 
  };

  return (
    <motion.aside 
      className="h-screen bg-background text-text-primary p-5 flex flex-col font-inter fixed left-0 top-0 z-50 border-r border-border-light"
      animate={{ width: isOpen ? '16rem' : '5rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onMouseEnter={openSidebar}
      onMouseLeave={closeSidebar}
    >
      <div className="flex items-center justify-center mb-12 h-[36px]">
        <AnimatePresence>
          {isOpen && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              className="font-montserrat text-3xl font-bold text-text-primary"
            >
              Sherloc
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex flex-col space-y-3">
        {[
          { to: "/dashboard", icon: FiGrid, label: "Dashboard" },
          { to: "/mapa", icon: FiMap, label: "Mapa" },
          { to: "/roteiros", icon: FiBookOpen, label: "Meus Roteiros" },
          { to: "/perfil", icon: FiUser, label: "Perfil" },
        ].map(item => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.to} 
              to={item.to} 
              style={({ isActive }) => isActive ? activeLinkStyle : {}} 
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-text-secondary hover:bg-gray-100 transition-colors ${!isOpen && 'justify-center'}`}
              title={item.label} // Adiciona um tooltip para quando a sidebar estiver fechada
            >
              <Icon size={isOpen ? 20 : 24} className="flex-shrink-0 transition-all duration-300" />
              <AnimatePresence>
                {isOpen && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto', transition: { delay: 0.2 } }}
                    exit={{ opacity: 0, width: 0, transition: { duration: 0.1 } }}
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