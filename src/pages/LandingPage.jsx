import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiBookOpen, FiAward, FiSearch, FiEdit, FiNavigation } from 'react-icons/fi';
import Footer from '../components/Footer';

// A animação DarkVeil é perfeita para este tema
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
    <div className="bg-primary text-text-primary font-inter">
      {/* --- Seção Hero com o Tema Cinematográfico --- */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <DarkVeilAnimation />
        {/* Adicionamos um gradiente escuro na parte de baixo para uma transição mais suave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent z-10"></div>
        
        <motion.div
          className="relative z-10 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-montserrat text-5xl md:text-7xl font-bold text-accent-glow">
            Seu Mundo. Seus Roteiros.
          </h1>
          <p className="font-poppins text-lg md:text-xl text-text-primary mt-4 max-w-2xl mx-auto">
            Descubra lugares incríveis e planeje viagens inesquecíveis com Sherloc. A aventura da sua vida começa aqui.
          </p>
          <Link to="/login">
            <motion.button
              className="mt-8 font-inter font-semibold text-primary bg-accent-gold py-3 px-8 rounded-full shadow-lg shadow-accent-gold/20 hover:brightness-110 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Começar a Explorar
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* --- Seção de Funcionalidades com Efeito Glass --- */}
      <section id="features" className="py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-poppins text-4xl font-bold text-text-primary mb-4">
            Uma Nova Forma de Viajar
          </h2>
          <p className="text-text-secondary mb-12 max-w-2xl mx-auto">
            Todas as ferramentas que você precisa para transformar uma simples viagem em uma jornada memorável.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
              <div className="bg-accent-gold/10 p-4 rounded-full mb-4">
                <FiMapPin size={32} className="text-accent-gold" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">Encontre Locais</h3>
              <p className="text-text-secondary text-sm">
                Descubra joias escondidas com nosso mapa interativo e avaliações da comunidade.
              </p>
            </div>
            {/* Card 2 */}
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
              <div className="bg-accent-gold/10 p-4 rounded-full mb-4">
                <FiBookOpen size={32} className="text-accent-gold" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">Crie Roteiros</h3>
              <p className="text-text-secondary text-sm">
                Monte, salve e compartilhe roteiros personalizados de forma visual e intuitiva.
              </p>
            </div>
            {/* Card 3 */}
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
              <div className="bg-accent-gold/10 p-4 rounded-full mb-4">
                <FiAward size={32} className="text-accent-gold" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">Ganhe Conquistas</h3>
              <p className="text-text-secondary text-sm">
                Transforme sua viagem em um jogo, ganhando XP e badges por cada novo lugar que explora.
              </p>
            </div>
          </div>
        </div>
      </section>
      
       {/* --- ADICIONAMOS O RODAPÉ NO FINAL DA PÁGINA --- */}
      <Footer />
    </div>
  );
};

export default LandingPage;