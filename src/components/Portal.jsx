// src/components/Portal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Limpa o estado ao desmontar
    return () => setMounted(false);
  }, []);

  // O portal só é criado depois de o componente ser "montado" no cliente
  return mounted 
    ? createPortal(children, document.getElementById('portal-root')) 
    : null;
};

export default Portal;