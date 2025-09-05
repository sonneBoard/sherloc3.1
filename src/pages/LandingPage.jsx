import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiBookOpen, FiAward } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="bg-sherloc-dark text-sherloc-text font-lexend">
      {/* Seção Principal (Hero) */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center p-8">
        <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-4">
          A Sua Próxima Viagem Começa Aqui.
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mb-8">
          O Sherloc é a plataforma definitiva para turistas. Encontre locais, planeje roteiros
          e transforme sua exploração em um jogo.
        </p>
        <div className="flex space-x-4">
          <Link to="/login" className="bg-sherloc-yellow text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-transform hover:scale-105">
            Começar Agora
          </Link>
        </div>
      </section>

      {/* --- NOVA SEÇÃO DE FUNCIONALIDADES --- */}
      <section className="bg-sherloc-dark-2 py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-poppins text-4xl font-bold mb-4">O Sherloc te Ajuda a Viajar Melhor</h2>
          <p className="text-gray-400 mb-12">Todas as ferramentas que você precisa, em um só lugar.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-sherloc-dark p-6 rounded-lg">
              <FiMapPin size={40} className="mx-auto text-sherloc-yellow mb-4" />
              <h3 className="font-poppins font-bold text-xl mb-2">Encontre Locais</h3>
              <p className="text-gray-400">Descubra restaurantes, pontos turísticos e serviços com base na sua localização e avaliações da comunidade.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-sherloc-dark p-6 rounded-lg">
              <FiBookOpen size={40} className="mx-auto text-sherloc-yellow mb-4" />
              <h3 className="font-poppins font-bold text-xl mb-2">Crie Roteiros</h3>
              <p className="text-gray-400">Monte, salve e compartilhe roteiros de viagem personalizados, organizando suas paradas de forma fácil.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-sherloc-dark p-6 rounded-lg">
              <FiAward size={40} className="mx-auto text-sherloc-yellow mb-4" />
              <h3 className="font-poppins font-bold text-xl mb-2">Ganhe Conquistas</h3>
              <p className="text-gray-400">Transforme sua viagem em um jogo, ganhando XP e badges por cada novo lugar que você explora.</p>
            </div>

          </div>
        </div>
      </section>
      {/* ------------------------------------ */}

    </div>
  );
};

export default LandingPage;