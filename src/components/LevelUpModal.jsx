import React from 'react';
import { FiAward } from 'react-icons/fi';

const LevelUpModal = ({ isOpen, onClose, newLevel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[3000]">
      <div className="bg-sherloc-dark-2 p-8 rounded-lg shadow-lg w-full max-w-sm text-center font-lexend text-sherloc-text">
        <FiAward size={60} className="mx-auto text-sherloc-yellow mb-4" />
        <h2 className="font-poppins text-3xl font-bold mb-2">LEVEL UP!</h2>
        <p className="text-gray-300 mb-6">Parabéns! Você alcançou o Nível</p>
        <p className="font-poppins text-6xl font-bold text-sherloc-yellow mb-6">{newLevel}</p>
        <button
          onClick={onClose}
          className="w-full text-black bg-sherloc-yellow hover:bg-yellow-400 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
        >
          Continuar Explorando
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;