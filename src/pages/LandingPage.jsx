import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Ícones consolidados para todas as seções
import { FiMapPin, FiBookOpen, FiAward, FiSearch, FiEdit, FiNavigation } from 'react-icons/fi';

// Seus componentes existentes
import DarkVeil from '../components/DarkVeil'; 

// A definição do DarkVeilAnimation que já tínhamos
const DarkVeilAnimation = () => (
  <div className="bg-animation">
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    <div id="stars4"></div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="bg-background text-text-primary">
      {/* --- Seção Hero (já finalizada) --- */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <DarkVeilAnimation />
        <motion.div
          className="relative z-10 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-montserrat text-5xl md:text-7xl font-bold text-white">
            Seu Mundo. Seus Roteiros.
          </h1>
          <p className="font-poppins text-lg md:text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
            Descubra lugares incríveis e planeje viagens inesquecíveis com Sherloc. A aventura da sua vida começa aqui.
          </p>
          <Link to="/login">
            <motion.button
              className="mt-8 font-inter font-semibold text-white bg-gold py-3 px-8 rounded-full shadow-lg hover:bg-coral transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Começar a Explorar
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* --- Seção de Funcionalidades (já finalizada) --- */}
      <section id="features" className="py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-poppins text-4xl font-bold text-text-primary mb-4">
            Uma Nova Forma de Viajar
          </h2>
          <p className="text-text-secondary mb-12 max-w-2xl mx-auto">
            Todas as ferramentas que você precisa para transformar uma simples viagem em uma jornada memorável, tudo em um só lugar.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Cards de Funcionalidade aqui... */}
            <div className="flex flex-col items-center">
              <div className="bg-gold/10 p-4 rounded-full mb-4"><FiMapPin size={32} className="text-gold" /></div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">Encontre Locais</h3>
              <p className="text-text-secondary">Descubra restaurantes, pontos turísticos e joias escondidas com base na sua localização e avaliações da comunidade.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gold/10 p-4 rounded-full mb-4"><FiBookOpen size={32} className="text-gold" /></div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">Crie Roteiros</h3>
              <p className="text-text-secondary">Monte, salve e compartilhe roteiros de viagem personalizados, organizando suas paradas de forma visual e intuitiva.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gold/10 p-4 rounded-full mb-4"><FiAward size={32} className="text-gold" /></div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">Ganhe Conquistas</h3>
              <p className="text-text-secondary">Transforme sua viagem em um jogo, ganhando XP e badges por cada novo lugar que você explora.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- NOVA SEÇÃO "COMO FUNCIONA" --- */}
      <section id="how-it-works" className="py-20 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-poppins text-4xl font-bold text-text-primary mb-4">
            Sua Aventura em 3 Passos Simples
          </h2>
          <p className="text-text-secondary mb-16 max-w-2xl mx-auto">
            Planejar sua próxima viagem nunca foi tão fácil e divertido.
          </p>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-border-light"></div>
            
            <div className="relative flex flex-col items-center">
              <div className="z-10 bg-white border-2 border-border-light w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <FiSearch size={32} className="text-coral" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">1. Descubra</h3>
              <p className="text-text-secondary">Explore nosso mapa interativo e encontre pontos de interesse avaliados pela comunidade.</p>
            </div>
            <div className="relative flex flex-col items-center">
               <div className="z-10 bg-white border-2 border-border-light w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <FiEdit size={32} className="text-coral" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">2. Planeje</h3>
              <p className="text-text-secondary">Crie roteiros personalizados, adicione locais, defina datas e organize sua viagem do seu jeito.</p>
            </div>
            <div className="relative flex flex-col items-center">
               <div className="z-10 bg-white border-2 border-border-light w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <FiNavigation size={32} className="text-coral" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">3. Viaje</h3>
              <p className="text-text-secondary">Acesse seus roteiros de qualquer lugar e transforme seu planejamento em uma aventura real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- NOVA SEÇÃO DE CTA FINAL --- */}
      <section id="cta" className="py-24 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-montserrat text-4xl font-bold text-text-primary">
            Pronto para Começar?
          </h2>
          <p className="font-poppins text-lg text-text-secondary mt-4 mb-8">
            Crie sua conta gratuita hoje mesmo. A sua próxima grande aventura está a apenas um clique de distância.
          </p>
          <Link to="/login">
            <motion.button
              className="font-inter font-semibold text-white bg-gold py-3 px-8 rounded-full shadow-lg hover:bg-coral transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Criar Roteiro Grátis
            </motion.button>
          </Link>
        </div>
      </section>
      
      {/* O Rodapé (Footer) virá aqui no próximo passo */}
    </div>
  );
};

export default LandingPage;