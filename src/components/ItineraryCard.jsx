<<<<<<< HEAD
import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCopy } from 'react-icons/fi';
=======
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCopy } from 'react-icons/fi';
import StarRating from './StarRating';
import RatingCommentModal from './RatingCommentModal';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
>>>>>>> master


// O card agora aceita uma nova prop: 'variant' ('my-itineraries' ou 'explore')
const ItineraryCard = ({ itinerary, onViewMore, onEdit, onClone, variant = 'my-itineraries' }) => {
<<<<<<< HEAD
=======
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [isOwnItinerary, setIsOwnItinerary] = useState(false);

>>>>>>> master
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

<<<<<<< HEAD
=======
  // Buscar avaliações do roteiro
  useEffect(() => {
    const fetchRatings = async () => {
      if (variant !== 'explore') return;
      
      try {
        // Buscar média das avaliações
        const { data: ratings, error } = await supabase
          .from('itinerary_ratings')
          .select('rating')
          .eq('itinerary_id', itinerary.id);

        if (error) throw error;

        if (ratings && ratings.length > 0) {
          const total = ratings.length;
          const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
          const average = sum / total;
          
          setAverageRating(average);
          setTotalRatings(total);
        }

        // Buscar avaliação do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Verificar se é o próprio roteiro
          setIsOwnItinerary(itinerary.created_by === user.id);
          
          const { data: userRatingData } = await supabase
            .from('itinerary_ratings')
            .select('rating')
            .eq('itinerary_id', itinerary.id)
            .eq('user_id', user.id)
            .single();

          if (userRatingData) {
            setUserRating(userRatingData.rating);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      }
    };

    fetchRatings();
  }, [itinerary.id, variant]);

  // Função para avaliar roteiro
  const handleRating = async (rating) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Você precisa estar logado para avaliar');
      return;
    }

    // Impedir autoavaliação
    if (itinerary.created_by === user.id) {
      toast.error('Você não pode avaliar seu próprio roteiro');
      return;
    }

    setPendingRating(rating);
    setShowCommentModal(true);
  };

  // Função para submeter avaliação com comentário
  const handleSubmitRating = async (comment) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Você precisa estar logado para avaliar');
        return;
      }
      
      const { error } = await supabase
        .from('itinerary_ratings')
        .upsert({
          itinerary_id: itinerary.id,
          user_id: user.id,
          rating: pendingRating,
          comment: comment || null
        }, {
          onConflict: 'itinerary_id,user_id'
        });

      if (error) throw error;

      setUserRating(pendingRating);
      toast.success('Avaliação salva com sucesso!');

      // Recalcular média
      const { data: ratings } = await supabase
        .from('itinerary_ratings')
        .select('rating')
        .eq('itinerary_id', itinerary.id);

      if (ratings && ratings.length > 0) {
        const total = ratings.length;
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        const average = sum / total;
        
        setAverageRating(average);
        setTotalRatings(total);
      }
    } catch (error) {
      toast.error('Erro ao salvar avaliação');
      console.error('Erro ao avaliar:', error);
    }
  };

>>>>>>> master
  return (
    <motion.div
      variants={cardVariants}
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full hover:border-white/20 transition-colors duration-300"
    >
      <img 
        src={itinerary.image_url || 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318'} 
        alt={`Imagem de ${itinerary.name}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-poppins text-xl font-bold text-text-primary mb-2">{itinerary.name}</h3>
        <p className="text-text-secondary text-sm mb-4 flex-grow">{itinerary.description || 'Uma aventura inesquecível espera por você.'}</p>
        
        {variant === 'explore' && itinerary.profiles && (
          <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
            <div className="flex items-center gap-2">
              <FiUser />
              <span>Criado por {itinerary.profiles.username}</span>
            </div>
            {/* --- NOVO CONTADOR DE POPULARIDADE --- */}
            <div className="flex items-center gap-1.5" title={`${itinerary.clone_count || 0} vezes salvo`}>
              <FiCopy />
              <span>{itinerary.clone_count || 0}</span>
            </div>
          </div>
        )}

<<<<<<< HEAD
=======
        {/* Sistema de Avaliação para página Explorar */}
        {variant === 'explore' && (
          <div className="mb-4 space-y-2">
            {/* Avaliação média */}
            {averageRating > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} readonly size={14} />
                <span className="text-xs text-text-secondary">
                  ({totalRatings} {totalRatings === 1 ? 'avaliação' : 'avaliações'})
                </span>
              </div>
            )}
            
            {/* Avaliação do usuário - só mostra se não for o próprio roteiro */}
            {!isOwnItinerary && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">
                  {userRating > 0 ? 'Editar avaliação:' : 'Sua avaliação:'}
                </span>
                <StarRating 
                  rating={userRating} 
                  onRatingChange={handleRating}
                  size={14}
                />
              </div>
            )}
          </div>
        )}

>>>>>>> master
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
          {/* Renderização condicional dos botões */}
          {variant === 'my-itineraries' ? (
            <>
              <button onClick={() => onViewMore(itinerary.id)} className="flex-1 bg-accent-gold text-primary font-inter font-semibold text-sm py-2 px-4 rounded-lg hover:brightness-110">Ver Mais</button>
<<<<<<< HEAD
              <button onClick={() => onEdit(itinerary.id)} className="flex-1 bg-secondary/70 text-text-secondary font-inter font-semibold text-sm py-2 px-4 rounded-lg border border-white/10 hover:bg-secondary">Editar</button>
            </>
          ) : (
            <>
              <button onClick={() => onViewMore(itinerary.id)} className="flex-1 bg-secondary/70 text-text-secondary font-inter font-semibold text-sm py-2 px-4 rounded-lg border border-white/10 hover:bg-secondary">Ver Detalhes</button>
=======
              <button 
         onClick={() => onEdit(itinerary.id)} 
         className="flex-1 bg-white/5 text-text-primary font-inter font-semibold text-sm py-2 px-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
        >
        Editar
         </button>
            </>
          ) : (
            <>
             <button onClick={() => onViewMore(itinerary.id)} className="flex-1 bg-white/5 text-text-primary font-inter font-semibold text-sm py-2 px-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">Ver Detalhes</button>
>>>>>>> master
              <button onClick={() => onClone(itinerary.id)} className="flex-1 bg-accent-gold text-primary font-inter font-semibold text-sm py-2 px-4 rounded-lg hover:brightness-110">Salvar Roteiro</button>
            </>
          )}
        </div>
      </div>
<<<<<<< HEAD
=======
      
      <RatingCommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSubmit={handleSubmitRating}
        rating={pendingRating}
      />
>>>>>>> master
    </motion.div>
  );
};

export default ItineraryCard;