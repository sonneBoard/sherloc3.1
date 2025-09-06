import React from 'react';
// MUDANÇA: Trocamos a importação de 'si' para 'fi' (Feather Icons)
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-sherloc-dark-2 text-gray-400 font-lexend">
      <div className="max-w-5xl mx-auto py-12 px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1 */}
          <div>
            <h4 className="font-poppins font-bold text-white mb-3">Sherloc</h4>
            <p className="text-sm">Sua próxima viagem começa aqui.</p>
          </div>
          {/* Coluna 2 */}
          <div>
            <h4 className="font-poppins font-bold text-white mb-3">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-sherloc-yellow">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-sherloc-yellow">Templates</a></li>
            </ul>
          </div>
          {/* Coluna 3 */}
          <div>
            <h4 className="font-poppins font-bold text-white mb-3">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-sherloc-yellow">Blog</a></li>
              <li><a href="#" className="hover:text-sherloc-yellow">Ajuda</a></li>
            </ul>
          </div>
          {/* Coluna 4 */}
          <div>
            <h4 className="font-poppins font-bold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-sherloc-yellow">Privacidade</a></li>
              <li><a href="#" className="hover:text-sherloc-yellow">Termos</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2025 Sherloc. Todos os direitos reservados.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            {/* MUDANÇA: Usamos os ícones Fi... */}
            <a href="#" className="hover:text-sherloc-yellow"><FiTwitter size={20} /></a>
            <a href="#" className="hover:text-sherloc-yellow"><FiGithub size={20} /></a>
            <a href="#" className="hover:text-sherloc-yellow"><FiLinkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;