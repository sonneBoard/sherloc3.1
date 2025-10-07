import React from 'react';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    // Fundo cinza-chumbo e borda superior sutil
    <footer className="bg-secondary border-t border-white/10">
      <div className="max-w-7xl mx-auto py-8 px-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        
        <div className="mb-4 sm:mb-0">
          <h3 className="font-poppins text-2xl font-bold text-accent-glow">Sherloc</h3>
          <p className="text-sm text-text-secondary mt-1">
            © {new Date().getFullYear()} Sherloc. Todos os direitos reservados.
          </p>
        </div>
        
        <div className="flex space-x-6">
          <a href="#" className="text-text-secondary hover:text-accent-gold transition-colors">
            <FiGithub size={24} />
          </a>
          <a href="#" className="text-text-secondary hover:text-accent-gold transition-colors">
            <FiTwitter size={24} />
          </a>
          <a href="#" className="text-text-secondary hover:text-accent-gold transition-colors">
            <FiInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;