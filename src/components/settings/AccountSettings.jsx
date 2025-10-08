import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const AccountSettings = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold font-poppins mb-1">Conta</h2>
      <p className="text-text-secondary mb-6">Gerencie suas informações de login e segurança.</p>
      
      <div className="space-y-4 mt-4">
        <p className="text-text-secondary">Funcionalidades de gestão de conta (alterar senha, etc.) serão adicionadas aqui no futuro.</p>
      </div>

      <div className="mt-8 pt-6 border-t border-red-500/30">
        <h3 className="text-lg font-bold text-red-400 font-poppins">Zona de Perigo</h3>
        <p className="text-text-secondary text-sm mt-2">Ações nesta área são permanentes e não podem ser desfeitas.</p>
        <button className="mt-4 bg-red-500/10 text-red-400 font-bold py-2 px-4 rounded-lg hover:bg-red-500/20 opacity-50 cursor-not-allowed">
          Apagar Minha Conta
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;