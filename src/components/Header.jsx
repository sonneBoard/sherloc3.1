// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiUser, FiLogOut, FiChevronDown, FiSearch, FiCompass, FiPlus } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import useAppStore from '../store/appStore';
import { motion, AnimatePresence } from 'framer-motion';
import Portal from './Portal';

const Header = () => {
  const navigate = useNavigate();
  const logoutUser = useAppStore(state => state.logoutUser);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerRef = useRef(null);
  const [dropdownStyles, setDropdownStyles] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownStyles({
        top: `${rect.bottom + 8}px`,
        right: `${window.innerWidth - rect.right}px`,
      });
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const portal = document.getElementById('portal-root');
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && portal && !portal.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, headerRef]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await logoutUser(navigate);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout.');
    }
  };

  return (
    <motion.header 
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      ref={headerRef}
      className="max-w-3xl mx-auto glass-card rounded-full p-2 flex items-center gap-2 shadow-lg"
    >
      <motion.div layout className="flex-shrink-0 pl-4">
        <h1 className="font-montserrat text-xl font-bold text-accent-glow">Sherloc</h1>
      </motion.div>

      <motion.div layout className="relative flex-grow flex items-center">
        <button onClick={() => setIsSearchOpen(true)} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary z-10">
          <FiSearch />
        </button>
        <AnimatePresence>
          {isSearchOpen && (
            <motion.input 
              key="search-input"
              type="text"
              placeholder="Buscar roteiros ou locais..."
              className="w-full bg-secondary/50 rounded-full py-2 pl-12 pr-4 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-gold"
              initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
              exit={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              autoFocus
              onBlur={() => setIsSearchOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div layout className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Criar Novo Roteiro">
            <FiPlus size={20} />
        </button>
        <Link to="/explorar" className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Explorar">
            <FiCompass size={20} />
        </Link>
        
        <div className="relative">
            <button 
                ref={dropdownRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
                <img 
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username || 'U'}&background=2D2E37&color=E0E0E0`} 
                    alt="Avatar do usuário" 
                    className="w-8 h-8 rounded-full object-cover"
                />
            </button>
            
            <Portal>
              <AnimatePresence>
                  {isDropdownOpen && (
                      <motion.div 
                          className="fixed w-56 glass-card rounded-xl shadow-lg z-[1000]"
                          style={dropdownStyles}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          style-transformorigin="top right"
                      >
                          <div className="p-3">
                              <p className="text-xs text-text-secondary">Olá,</p>
                              <p className="font-semibold text-text-primary truncate">{loading ? 'Carregando...' : (profile?.username || 'Usuário')}</p>
                          </div>
                          <hr className="border-white/10" />
                          <ul>
                              <li>
                                  <Link to="/perfil" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-white/5 transition-colors">
                                      <FiUser size={16} />
                                      <span>Meu Perfil</span>
                                  </Link>
                              </li>
                              <li>
                                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors">
                                      <FiLogOut size={16} />
                                      <span>Logout</span>
                                  </button>
                              </li>
                          </ul>
                      </motion.div>
                  )}
              </AnimatePresence>
            </Portal>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;