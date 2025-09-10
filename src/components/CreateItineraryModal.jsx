// src/components/CreateItineraryModal.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTag, FiCalendar, FiGlobe, FiImage, FiType, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// O seu componente auxiliar InputField continua o mesmo
const InputField = ({ icon, label, value, onChange, placeholder, type = 'text', required = false, isTextArea = false }) => (
  <div>
    <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-300">{icon}{label}</label>
    {isTextArea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} rows="3" className="w-full bg-sherloc-dark p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sherloc-purple transition-all" />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full bg-sherloc-dark p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sherloc-purple transition-all" />
    )}
  </div>
);

// --- 1. O componente agora aceita a propriedade 'initialLocation' ---
const CreateItineraryModal = ({ isOpen, onClose, onItineraryCreated, initialLocation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- 2. A função de submissão foi atualizada ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const newItineraryData = {
        name,
        description,
        image_url: imageUrl,
        start_date: startDate || null,
        end_date: endDate || null,
        is_public: isPublic,
        created_by: user.id,
      };

      // Passo A: Insere o novo roteiro e pega o resultado de volta
      const { data: newItinerary, error: itineraryError } = await supabase
        .from('itineraries')
        .insert([newItineraryData])
        .select()
        .single(); // .single() para receber um objeto em vez de um array

      if (itineraryError) throw itineraryError;
      
      // Passo B: Se houver um local inicial, associa-o ao novo roteiro
      if (initialLocation && newItinerary) {
        const { error: locationError } = await supabase
          .from('itinerary_locations')
          .insert([{ itinerary_id: newItinerary.id, location_id: initialLocation.id }]);
        
        if (locationError) throw locationError;
      }
      
      toast.success("Roteiro criado com sucesso!");
      onItineraryCreated(newItinerary);
      onClose();

    } catch (error) {
      toast.error(error.message || "Erro ao criar o roteiro.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // O seu JSX continua o mesmo
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-y-auto flex flex-col"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* O seu JSX para o cabeçalho e formulário do modal continua aqui... */}
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="font-poppins text-2xl font-bold text-sherloc-text-bright">Criar Novo Roteiro</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <InputField icon={<FiType/>} label="Nome do Roteiro" value={name} onChange={setName} placeholder="Ex: Fim de Semana em Campos do Jordão" required />
              <InputField icon={<FiFileText/>} label="Descrição" value={description} onChange={setDescription} placeholder="Um resumo sobre a viagem..." isTextArea />
              <InputField icon={<FiImage/>} label="URL da Imagem de Capa" value={imageUrl} onChange={setImageUrl} placeholder="https://exemplo.com/imagem.jpg" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={<FiCalendar/>} label="Data de Início" value={startDate} onChange={setStartDate} type="date" />
                <InputField icon={<FiCalendar/>} label="Data de Fim" value={endDate} onChange={setEndDate} type="date" />
              </div>

              <div className="flex items-center justify-between bg-sherloc-dark/50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiGlobe className="text-sherloc-purple" />
                  <div>
                    <label htmlFor="isPublic" className="font-semibold">Roteiro Público</label>
                    <p className="text-xs text-gray-400">Outros usuários poderão ver este roteiro.</p>
                  </div>
                </div>
                <input type="checkbox" id="isPublic" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="bg-sherloc-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-500">
                  {loading ? 'Salvando...' : 'Salvar Roteiro'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateItineraryModal;