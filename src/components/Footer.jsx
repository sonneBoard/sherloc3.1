import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    // O rodapé agora tem um fundo cinza claro e uma borda superior
    <footer className="bg-gray-50 border-t border-border-light">
      <div className="max-w-7xl mx-auto py-12 px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        
        {/* Seção da marca e copyright */}
        <div className="mb-6 md:mb-0">
          <h3 className="font-poppins text-2xl font-bold text-text-primary">Sherloc</h3>
          <p className="text-sm text-text-secondary mt-1">
            © {new Date().getFullYear()} Sherloc. Todos os direitos reservados.
          </p>
        </div>
        
        {/* Ícones de redes sociais com a nova paleta de cores */}
        <div className="flex space-x-6">
          <a href="#" className="text-text-secondary hover:text-gold transition-colors">
            <FiGithub size={24} />
          </a>
          <a href="#" className="text-text-secondary hover:text-gold transition-colors">
            <FiTwitter size={24} />
          </a>
          <a href="#" className="text-text-secondary hover:text-gold transition-colors">
            <FiInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;