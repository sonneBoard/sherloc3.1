import React, { useState, useEffect, useRef } from 'react'; // 1. Importação corrigida
import { FiBell, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import useAppStore from '../store/appStore';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const clearUserSession = useAppStore(state => state.clearUserSession);
  // 2. Usamos os hooks diretamente, sem o prefixo 'React.'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();
          if (error) throw error;
          if (profileData) setProfile(profileData);
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearUserSession();
      navigate('/login');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="font-poppins text-3xl font-bold text-text-primary">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <FiBell size={20} />
        </button>

        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                {loading ? (
                    <div className="w-8 h-8 rounded-full bg-secondary/50 animate-pulse"></div>
                ) : (
                    <img 
                        src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username || 'U'}&background=2D2E37&color=E0E0E0`} 
                        alt="Avatar do usuário" 
                        className="w-8 h-8 rounded-full object-cover"
                    />
                )}
                <span className="text-sm text-text-secondary hidden sm:block font-semibold">
                    {loading ? 'Carregando...' : profile?.username || 'Usuário'}
                </span>
                <FiChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div 
                        className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl shadow-lg overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
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
        </div>
      </div>
    </header>
  );
};

export default Header;