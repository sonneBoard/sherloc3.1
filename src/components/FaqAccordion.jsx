import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

// O componente recebe as 'perguntas e respostas' como uma propriedade (prop)
const FaqAccordion = ({ data }) => {
  // Este estado controla qual item do acordeão está aberto no momento
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    // Se o item clicado já estiver aberto, fecha-o. Senão, abre-o.
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {data.map((item, index) => (
        <div key={index} className="border-b border-gray-700">
          {/* Cabeçalho da Pergunta (Clicável) */}
          <button
            className="w-full flex justify-between items-center text-left py-4 px-2"
            onClick={() => toggleAccordion(index)}
          >
            <span className="font-poppins font-semibold">{item.question}</span>
            {activeIndex === index ? <FiMinus /> : <FiPlus />}
          </button>

          {/* Corpo da Resposta (Aparece e desaparece) */}
          {activeIndex === index && (
            <div className="px-2 pb-4 text-gray-400">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;