import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiBookOpen, FiAward } from 'react-icons/fi';
import { SiReact, SiTailwindcss, SiVite, SiSupabase, SiPostgresql, SiLeaflet } from 'react-icons/si';
import FaqAccordion from '../components/FaqAccordion';
import Footer from '../components/Footer';
import { useFadeIn } from '../hooks/useFadeIn';
import DarkVeil from '../components/DarkVeil';
import StarBorder from '@/components/ui/StarBorder'; // 1. IMPORTAÇÃO DO NOVO BOTÃO
import BlurText from '@/components/ui/BlurText'; // 1. IMPORTAÇÃO DO NOVO COMPONENTE


const AnimatedSection = ({ children, className, id }) => {
  const [ref, isVisible] = useFadeIn({ threshold: 0.1, triggerOnce: true });
  return (
    <section id={id} ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''} ${className}`}>
      {children}
    </section>
  );
};

const technologies = [
  { name: 'React', icon: <SiReact size={40} className="mx-auto" /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss size={40} className="mx-auto" /> },
  { name: 'Vite', icon: <SiVite size={40} className="mx-auto" /> },
  { name: 'Supabase', icon: <SiSupabase size={40} className="mx-auto" /> },
  { name: 'PostgreSQL', icon: <SiPostgresql size={40} className="mx-auto" /> },
  { name: 'Leaflet.js', icon: <SiLeaflet size={40} className="mx-auto" /> },
];

const faqData = [
  { question: 'O Sherloc é gratuito?', answer: 'Sim! O Sherloc é um projeto de TCC e é totalmente gratuito para uso pessoal e exploração.' },
  { question: 'Como os locais são adicionados ao mapa?', answer: 'Os locais são adicionados e avaliados pela própria comunidade de viajantes. No futuro, você também poderá adicionar seus próprios pontos de interesse.' },
  { question: 'Posso compartilhar meus roteiros com amigos?', answer: 'Sim! Uma das principais funcionalidades do Sherloc é a capacidade de criar, customizar e compartilhar seus roteiros de viagem com outros usuários.' }
];

const LandingPage = () => {
  return (
    <div className="bg-sherloc-dark text-sherloc-text font-lexend">
      {/* --- SEÇÃO PRINCIPAL (HERO) REESTRUTURADA --- */}
      <section className="relative min-h-screen flex items-center justify-center text-center p-8 overflow-hidden">
        {/* Camada de Fundo (z-0) */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <DarkVeil />
        </div>
        
        {/* Camada do Cabeçalho (z-20, o mais alto) */}
        <header className="absolute top-0 left-0 right-0 p-6 z-20">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="font-poppins text-2xl font-bold text-sherloc-purple">Sherloc</div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm font-semibold hover:text-sherloc-purple transition-colors">Funcionalidades</a>
              <a href="#tech" className="text-sm font-semibold hover:text-sherloc-purple transition-colors">Tecnologias</a>
              <a href="#faq" className="text-sm font-semibold hover:text-sherloc-purple transition-colors">FAQ</a>
            </nav>
           {/* --- BOTÃO "ENTRAR" ESTILIZADO --- */}
            <Link 
              to="/login" 
              className="bg-sherloc-dark-2 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Entrar
            </Link>
          </div>
        </header>

        <div className="relative z-10 flex flex-col items-center">
          {/* 2. TÍTULO ANTIGO SUBSTITUÍDO PELO COMPONENTE ANIMADO */}
          <BlurText
            text="A Sua Próxima Viagem Começa Aqui."
            className="font-poppins text-5xl md:text-7xl font-bold mb-4"
            animateBy="words"
            direction="top"
            delay={100}
          />

          <p className="text-lg text-gray-300 max-w-2xl mb-8">
            O Sherloc é a plataforma definitiva para turistas. Encontre locais, planeje roteiros
            e transforme sua exploração em um jogo.
          </p>
          <div className="flex space-x-4 justify-center">
            <Link to="/login">
            <StarBorder
              color="#C778DD" // Usando nossa cor roxa
              speed="5s"
              thickness={2}
            >
              Começar Agora
            </StarBorder>
          </Link>
        </div>
      </div>
    </section>


      
      {/* As outras seções (Funcionalidades, FAQ, etc.) continuam abaixo */}
      <AnimatedSection id="features" className="bg-sherloc-dark-2 py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-poppins text-4xl font-bold mb-4">O Sherloc te Ajuda a Viajar Melhor</h2>
          <p className="text-gray-400 mb-12">Todas as ferramentas que você precisa, em um só lugar.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-sherloc-dark p-6 rounded-lg">
              <FiMapPin size={40} className="mx-auto text-sherloc-yellow mb-4" />
              <h3 className="font-poppins font-bold text-xl mb-2">Encontre Locais</h3>
              <p className="text-gray-400">Descubra restaurantes, pontos turísticos e serviços com base na sua localização e avaliações da comunidade.</p>
            </div>
            <div className="bg-sherloc-dark p-6 rounded-lg">
              <FiBookOpen size={40} className="mx-auto text-sherloc-yellow mb-4" />
              <h3 className="font-poppins font-bold text-xl mb-2">Crie Roteiros</h3>
              <p className="text-gray-400">Monte, salve e compartilhe roteiros de viagem personalizados, organizando suas paradas de forma fácil.</p>
            </div>
            <div className="bg-sherloc-dark p-6 rounded-lg">
              <FiAward size={40} className="mx-auto text-sherloc-yellow mb-4" />
              <h3 className="font-poppins font-bold text-xl mb-2">Ganhe Conquistas</h3>
              <p className="text-gray-400">Transforme sua viagem em um jogo, ganhando XP e badges por cada novo lugar que você explora.</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="tech" className="bg-sherloc-dark py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-poppins text-4xl font-bold mb-12">Construído com Tecnologia de Ponta</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {technologies.map((tech) => (
              <div key={tech.name} className="text-center text-gray-400">
                <div className="text-sherloc-yellow hover:text-white transition-colors">{tech.icon}</div>
                <p className="mt-2 font-semibold">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
      
      <AnimatedSection id="faq" className="bg-sherloc-dark-2 py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-poppins text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-gray-400 mb-12">Tudo o que você precisa saber para começar sua jornada.</p>
          <FaqAccordion data={faqData} />
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-sherloc-dark py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-poppins text-4xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Crie sua conta gratuita hoje mesmo e comece a planejar sua próxima aventura com o Sherloc.</p>
          <Link to="/login" className="bg-sherloc-yellow text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-transform hover:scale-105 text-lg">
            Criar Roteiro
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default LandingPage;