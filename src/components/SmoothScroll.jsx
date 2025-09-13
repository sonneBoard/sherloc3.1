// src/components/SmoothScroll.jsx
import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Inicializa o Lenis
    const lenis = new Lenis();
    lenisRef.current = lenis;

    // Sincroniza o Lenis com o scroll a cada frame
    const animate = (time) => {
      lenis.raf(time);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Limpa a instância ao desmontar o componente
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;