import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiUser, FiLock, FiBell, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';

const tabs = [
  { name: 'Perfil', to: 'perfil', icon: FiUser },
  { name: 'Conta', to: 'conta', icon: FiLock },
  { name: 'Aparência', to: 'aparencia', icon: FiSun, disabled: true },
  { name: 'Notificações', to: 'notificacoes', icon: FiBell, disabled: true },
];

const SettingsPage = () => {
  const activeClass = 'bg-secondary text-text-primary';
  const inactiveClass = 'text-text-secondary hover:bg-secondary/50 hover:text-text-primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-poppins text-4xl font-bold text-text-primary mb-8">Configurações</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64">
          <nav className="flex flex-col gap-2">
            {tabs.map(tab => (
              <NavLink
                key={tab.name}
                to={tab.to}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors ${isActive ? activeClass : inactiveClass} ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                }
                onClick={(e) => tab.disabled && e.preventDefault()}
              >
                <tab.icon />
                <span>{tab.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 glass-card p-8 rounded-2xl min-h-[400px]">
          <Outlet />
        </main>
      </div>
    </motion.div>
  );
};

export default SettingsPage;