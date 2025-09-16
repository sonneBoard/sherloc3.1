import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiMap, FiBookOpen, FiUser, FiCompass, FiLogOut, FiPlus, FiChevronsRight, FiChevronsLeft, FiChevronDown } from "react-icons/fi";
import useAppStore from '../store/appStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// 1. Nova estrutura de dados para a navegação, dividida em seções
const navSections = [
  {
    title: 'Principal',
    links: [
      { to: "/dashboard", icon: FiGrid, label: "Dashboard" },
      { to: "/mapa", icon: FiMap, label: "Mapa" },
      { to: "/roteiros", icon: FiBookOpen, label: "Meus Roteiros" },
    ]
  },
  {
    title: 'Comunidade',
    links: [
      { to: "/explorar", icon: FiCompass, label: "Explorar" },
    ]
  },
  {
    title: 'Minha Conta',
    links: [
      { to: "/perfil", icon: FiUser, label: "Perfil" },
    ]
  }
];

// Componente auxiliar para renderizar cada item de link
const NavLinkItem = ({ link, isExpanded }) => {
  const Icon = link.icon;
  const activeLinkStyle = { 
    backgroundColor: 'rgba(204, 164, 59, 0.1)',
    color: '#CCA43B'
  };

  return (
    <NavLink 
      to={link.to} 
      style={({ isActive }) => isActive ? activeLinkStyle : {}} 
      className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-text-secondary hover:bg-white/5 transition-colors ${!isExpanded && 'justify-center'}`}
      title={link.label}
    >
      <Icon size={isExpanded ? 20 : 24} className="flex-shrink-0" />
      <AnimatePresence>
        {isExpanded && (
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="whitespace-nowrap font-semibold"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};


const Sidebar = () => {
  const navigate = useNavigate();
  const { 
    isSidebarOpen, 
    openSidebar, 
    closeSidebar, 
    isSidebarPinned, 
    toggleSidebarPin,
    logoutUser
  } = useAppStore();
  
  // 2. Novo estado para controlar quais seções estão abertas
  const [openSections, setOpenSections] = useState({ 'Principal': true });

  const handleToggleSection = (title) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    try {
      await logoutUser(navigate);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout.');
    }
  };

  const isExpanded = isSidebarOpen || isSidebarPinned;

  return (
    <motion.aside 
      className="glass-card h-screen flex flex-col font-inter fixed left-0 top-0 z-50 p-4"
      animate={{ width: isExpanded ? '16rem' : '5rem' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={!isSidebarPinned ? openSidebar : undefined}
      onMouseLeave={!isSidebarPinned ? closeSidebar : undefined}
    >
      <div className="flex items-center justify-between mb-8 h-[36px]">
        <AnimatePresence>
          {isExpanded && (
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
        <button 
          onClick={toggleSidebarPin} 
          className="p-1 text-text-secondary hover:text-text-primary"
          title={isSidebarPinned ? 'Desafixar' : 'Fixar sidebar'}
        >
          {isSidebarPinned ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={20} />}
        </button>
      </div>
      
      <button 
        onClick={() => navigate('/mapa')}
        className="w-full flex items-center justify-center gap-2 bg-accent-gold text-primary font-semibold py-3 rounded-lg mb-6 hover:brightness-110 transition-transform hover:scale-105"
      >
        <FiPlus />
        <AnimatePresence>
          {isExpanded && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Criar Roteiro
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* 3. A navegação agora é renderizada com base nas seções */}
      <nav className="flex flex-col space-y-1 overflow-y-auto flex-grow">
        {navSections.map(section => (
          <div key={section.title}>
            {isExpanded ? (
              <button 
                onClick={() => handleToggleSection(section.title)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-text-secondary/50 uppercase tracking-wider"
              >
                <span>{section.title}</span>
                <FiChevronDown className={`transition-transform duration-200 ${openSections[section.title] ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <div className="h-4" /> // Espaçador para separar ícones quando a sidebar está fechada
            )}
            
            <AnimatePresence>
              {(isExpanded && openSections[section.title]) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {section.links.map(link => (
                    <li key={link.to}>
                      <NavLinkItem link={link} isExpanded={isExpanded} />
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
             {!isExpanded && section.links.map(link => (
                <NavLinkItem key={link.to} link={link} isExpanded={isExpanded} />
             ))}
          </div>
        ))}
      </nav>

      <button 
        onClick={handleLogout} 
        className="mt-auto w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 flex-shrink-0"
      >
        <FiLogOut size={20} className="flex-shrink-0" />
        <AnimatePresence>
          {isExpanded && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="whitespace-nowrap font-semibold"
            >
              Logout
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.aside>
  );
};

export default Sidebar;