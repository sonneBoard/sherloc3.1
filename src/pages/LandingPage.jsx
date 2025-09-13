import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiBookOpen, FiAward, FiMessageSquare, FiChevronDown } from 'react-icons/fi'; 
import Footer from '../components/Footer';

const DarkVeilAnimation = () => (
  <div className="bg-animation">
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    <div id="stars4"></div>
  </div>
);

const testimonials = [
  { quote: "O Sherloc transformou a maneira como eu viajo. Planejar roteiros se tornou a parte mais divertida da viagem!", name: "Ana Clara", role: "Viajante Frequente" },
  { quote: "Finalmente uma ferramenta que entende o que um explorador precisa. O mapa interativo e as conquistas são geniais.", name: "Bruno G.", role: "Aventureiro" },
  { quote: "Usei para planejar uma viagem em família e foi um sucesso. Ter todos os locais organizados num só lugar não tem preço.", name: "Sofia M.", role: "Planejadora de Viagens" }
];

const featureHighlights = [
  {
    title: "Explore um Mundo de Possibilidades",
    description: "Navegue em um mapa interativo repleto de pontos de interesse, desde marcos históricos a restaurantes badalados. A descoberta da sua próxima aventura está na ponta dos seus dedos.",
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Crie Roteiros com a Sua Assinatura",
    description: "Arraste e solte locais, adicione notas pessoais, defina datas e organize o itinerário perfeito. O Sherloc oferece as ferramentas para que cada viagem seja unicamente sua.",
    image: "https://images.unsplash.com/photo-1542037104-924827d40573?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Compartilhe e Conquiste",
    description: "Torne seus roteiros públicos para inspirar outros viajantes, ou clone as melhores aventuras da comunidade para a sua própria coleção. Ganhe badges e suba de nível a cada nova descoberta.",
    image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1974&auto=format&fit=crop"
  }
];

const faqData = [
  { question: "O Sherloc é gratuito?", answer: "Sim! As funcionalidades principais do Sherloc, como a criação de roteiros e a descoberta de locais, são totalmente gratuitas. Planeamos introduzir funcionalidades 'Pro' opcionais no futuro." },
  { question: "Os meus roteiros são privados?", answer: "Por padrão, todos os roteiros que você cria são privados. Você tem a opção de torná-los públicos para que outros membros da comunidade possam se inspirar na sua viagem." },
  { question: "Posso usar o Sherloc em qualquer cidade?", answer: "Sim! Embora a nossa base de dados inicial esteja focada em algumas cidades, você pode adicionar qualquer local do mundo aos seus roteiros usando o nosso mapa interativo." }
];

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4"
      >
        <span className="font-semibold text-text-primary">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <FiChevronDown />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-text-secondary text-sm">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LandingPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0); // Novo estado para a imagem ativa

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallaxOffset = (strength) => ({
    x: (mousePosition.x - window.innerWidth / 2) * strength,
    y: (mousePosition.y - window.innerHeight / 2) * strength,
  });

  return (
    <div className="bg-primary text-text-primary font-inter">
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <DarkVeilAnimation />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent z-10"></div>
        
        <div className="relative z-10 p-8 flex flex-col items-center">
          <motion.div animate={{ translateX: parallaxOffset(-0.02).x, translateY: parallaxOffset(-0.02).y }}>
            <h1 className="font-montserrat text-5xl md:text-7xl font-bold text-accent-glow">
              Seu Mundo. Seus Roteiros.
            </h1>
          </motion.div>
          
          <motion.div animate={{ translateX: parallaxOffset(0.015).x, translateY: parallaxOffset(0.015).y }}>
            <p className="font-poppins text-lg md:text-xl text-text-primary mt-4 max-w-2xl mx-auto">
              Descubra lugares incríveis e planeje viagens inesquecíveis com Sherloc. A aventura da sua vida começa aqui.
            </p>
          </motion.div>
          
          <motion.div animate={{ translateX: parallaxOffset(-0.01).x, translateY: parallaxOffset(-0.01).y }}>
            <Link to="/login">
              <motion.button
                className="mt-8 font-inter font-semibold text-primary bg-accent-gold py-3 px-8 rounded-full shadow-lg shadow-accent-gold/20 hover:brightness-110"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                Começar a Explorar
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-poppins text-4xl font-bold text-text-primary mb-4">
            Uma Nova Forma de Viajar
          </h2>
          <p className="text-text-secondary mb-12 max-w-2xl mx-auto">
            Todas as ferramentas que você precisa para transformar uma simples viagem em uma jornada memorável.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
              <div className="bg-accent-gold/10 p-4 rounded-full mb-4">
                <FiMapPin size={32} className="text-accent-gold" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">Encontre Locais</h3>
              <p className="text-text-secondary text-sm">
                Descubra joias escondidas com nosso mapa interativo e avaliações da comunidade.
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
              <div className="bg-accent-gold/10 p-4 rounded-full mb-4">
                <FiBookOpen size={32} className="text-accent-gold" />
              </div>
              <h3 className="font-poppins font-bold text-xl mb-2 text-text-primary">Crie Roteiros</h3>
              <p className="text-text-secondary text-sm">
                Monte, salve e compartilhe roteiros personalizados de forma visual e intuitiva.
              </p>
            </div>
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

      <section id="testimonials" className="py-20 px-8">
        <div className="max-w-3xl mx-auto text-center relative h-48 flex items-center">
          <FiMessageSquare size={80} className="text-accent-gold/10 absolute top-0 left-1/2 -translate-x-1/2" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <p className="font-poppins text-2xl md:text-3xl leading-relaxed text-text-primary mb-6">
                "{testimonials[activeIndex].quote}"
              </p>
              <div>
                <p className="font-semibold text-accent-glow">{testimonials[activeIndex].name}</p>
                <p className="text-sm text-text-secondary">{testimonials[activeIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* --- SEÇÃO DE SCROLLYTELLING ATUALIZADA --- */}
      <section id="scrolly-features" className="py-24 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="lg:py-16">
            <h2 className="font-poppins text-4xl font-bold text-text-primary mb-12">
              Tudo o que Você Precisa para Viajar
            </h2>
            <div className="space-y-32">
              {featureHighlights.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col gap-4"
                  onViewportEnter={() => setActiveFeatureIndex(index)}
                  initial={{ opacity: 0.3 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ margin: "-200px 0px -200px 0px" }}
                >
                  <h3 className="font-poppins text-2xl font-bold text-accent-gold">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="h-[600px] sticky top-24">
            <AnimatePresence>
              <motion.img 
                key={activeFeatureIndex}
                src={featureHighlights[activeFeatureIndex].image} 
                alt="Visualização do Sherloc" 
                className="w-full h-full object-cover rounded-2xl shadow-2xl absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            </AnimatePresence>
          </div>
        </div>
      </section>
      
      <section id="faq" className="py-20 px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-poppins text-4xl font-bold text-text-primary text-center mb-12">Perguntas Frequentes</h2>
          <div className="glass-card p-6 rounded-2xl">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;