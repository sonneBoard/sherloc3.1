// src/components/AddToItineraryModal.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AddToItineraryModal = ({ location, onClose, onNewItinerary }) => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  // A sua função para buscar os roteiros continua a mesma
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase.from('itineraries').select('id, name').eq('created_by', user.id).order('created_at', { ascending: false });
          if (error) throw error;
          setItineraries(data);
        }
      } catch (error) {
        toast.error("Erro ao buscar seus roteiros.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  // --- CORREÇÃO APLICADA AQUI ---
  const handleAddLocation = async (itineraryId) => {
    try {
      const { error } = await supabase.from('itinerary_locations').insert([
        { itinerary_id: itineraryId, location_id: location.id, visit_order: 0 }
      ]);

      if (error) {
        // Se o erro for de chave duplicada (código '23505'), mostramos a mensagem específica
        if (error.code === '23505') {
          toast.error("Este local já está neste roteiro.");
        } else {
          // Para qualquer outro erro, lançamos o erro para ser capturado pelo catch
          throw error;
        }
      } else {
        // Se não houver erro, mostramos a mensagem de sucesso
        toast.success(`'${location.name}' adicionado ao roteiro!`);

// --- CORREÇÃO E NOVA LÓGICA ---
      const { count, error: countError } = await supabase
        .from('itinerary_locations')
        .select('*', { count: 'exact', head: true })
        .eq('itinerary_id', itineraryId);
      
      if (countError) throw countError;

      if (count === 5) {
        // Buscamos o usuário AQUI, dentro da função
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Garante que temos um usuário antes de prosseguir

        const { error: badgeError } = await supabase
          .from('user_badges')
          .insert([{ user_id: user.id, badge_id: 2 }]); // ID 2 = Explorador Curioso
        
        if (badgeError && badgeError.code !== '23505') { throw badgeError; }

        if (!badgeError) {
          toast.success('✨ Conquista Desbloqueada: Explorador Curioso!', { icon: '🧭', duration: 4000 });
        }
      }
      // -----------------------------

      // NOVA LÓGICA: Badge "Planejador Mestre" (ID 3)
      if (count === 10) {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 3 }]);
        if (!badgeError) {
          toast.success('✨ Conquista Desbloqueada: Planejador Mestre!', { icon: '🗺️' });
        }
      }
      // ---------------------------------------------------

  

        onClose();
      }

    } catch (error) {
      // O catch agora mostra a mensagem de erro real vinda do Supabase
      toast.error(error.message || "Ocorreu um erro ao adicionar o local.");
      console.error("Erro detalhado ao adicionar local:", error);
    }
  };

  if (!location) return null;

  // O seu JSX continua exatamente o mesmo
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="font-poppins text-xl font-bold text-sherloc-text-bright mb-2">Adicionar "{location.name}"</h2>
            <p className="text-gray-400 text-sm mb-4">Selecione um roteiro existente ou crie um novo.</p>
            
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {loading ? <p className="text-sm text-gray-400">Carregando roteiros...</p> : itineraries.map(it => (
                <button 
                  key={it.id} 
                  onClick={() => handleAddLocation(it.id)}
                  className="w-full text-left bg-sherloc-dark/50 p-3 rounded-lg hover:bg-sherloc-purple/50 transition-colors"
                >
                  {it.name}
                </button>
              ))}
            </div>
            
            <button 
              onClick={onNewItinerary}
              className="w-full flex items-center justify-center gap-2 mt-4 bg-sherloc-purple text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiPlusCircle />
              Criar Novo Roteiro
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddToItineraryModal;