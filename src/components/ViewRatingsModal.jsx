import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiStar, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../supabaseClient';
import StarRating from './StarRating';
import { toast } from 'react-hot-toast';

const ViewRatingsModal = ({ isOpen, onClose, itineraryId, itineraryName }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!isOpen || !itineraryId) return;
      
      setLoading(true);
      try {
        // Buscar usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Primeiro, buscar as avaliações
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('itinerary_ratings')
          .select(`
            rating,
            comment,
            created_at,
            user_id
          `)
          .eq('itinerary_id', itineraryId)
          .order('created_at', { ascending: false });

        if (ratingsError) throw ratingsError;

        // Depois, buscar os usernames dos profiles para cada avaliação
        const ratingsWithProfiles = await Promise.all(
          (ratingsData || []).map(async (rating) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', rating.user_id)
              .single();
            
            return {
              ...rating,
              profiles: profileData
            };
          })
        );

        console.log('Ratings com profiles:', ratingsWithProfiles);
        setRatings(ratingsWithProfiles);
        
        // Calcular média
        if (ratingsWithProfiles && ratingsWithProfiles.length > 0) {
          const sum = ratingsWithProfiles.reduce((acc, r) => acc + r.rating, 0);
          const average = sum / ratingsWithProfiles.length;
          setAverageRating(average);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [isOpen, itineraryId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatUsername = (rating) => {
    // Debug: verificar estrutura dos dados
    console.log('Rating completo:', rating);
    console.log('Profiles:', rating.profiles);
    
    // Tentar diferentes caminhos para acessar o username
    let username = null;
    
    // Verificar se profiles é um objeto com username
    if (rating.profiles && typeof rating.profiles === 'object' && rating.profiles.username) {
      username = rating.profiles.username;
    }
    // Verificar se profiles é um array (caso de múltiplos profiles)
    else if (rating.profiles && Array.isArray(rating.profiles) && rating.profiles.length > 0) {
      username = rating.profiles[0].username;
    }
    // Verificar se username está diretamente no rating
    else if (rating.username) {
      username = rating.username;
    }
    // Verificar se user_id pode ser usado para buscar o username
    else if (rating.user_id) {
      // Como fallback, vamos usar o user_id como identificador
      username = `User_${rating.user_id.substring(0, 8)}`;
    }
    
    console.log('Username encontrado:', username);
    
    if (!username || username === 'undefined' || username === 'null') {
      return 'Usuário';
    }
    
    // Se contém @ (email), pegar apenas a parte antes do @
    if (typeof username === 'string' && username.includes('@')) {
      return username.split('@')[0];
    }
    
    return username;
  };

  const handleDeleteRating = async (ratingIndex) => {
    const rating = ratings[ratingIndex];
    if (!rating || !currentUser || rating.user_id !== currentUser.id) return;

    try {
      toast.loading('Excluindo avaliação...');
      
      const { error } = await supabase
        .from('itinerary_ratings')
        .delete()
        .eq('itinerary_id', itineraryId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      // Atualizar lista local
      const updatedRatings = ratings.filter((_, index) => index !== ratingIndex);
      setRatings(updatedRatings);

      // Recalcular média
      if (updatedRatings.length > 0) {
        const sum = updatedRatings.reduce((acc, r) => acc + r.rating, 0);
        const average = sum / updatedRatings.length;
        setAverageRating(average);
      } else {
        setAverageRating(0);
      }

      toast.dismiss();
      toast.success('Avaliação excluída com sucesso!');
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao excluir avaliação');
      console.error('Erro ao excluir avaliação:', error);
    }
  };

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
            className="glass-card w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <div>
                <h2 className="font-poppins text-xl font-bold text-text-primary">
                  Avaliações do Roteiro
                </h2>
                <p className="text-text-secondary text-sm mt-1">{itineraryName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {loading ? (
                <div className="text-center text-text-secondary py-8">
                  Carregando avaliações...
                </div>
              ) : ratings.length === 0 ? (
                <div className="text-center text-text-secondary py-8">
                  <FiStar size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">Nenhuma avaliação ainda</h3>
                  <p className="text-sm">Este roteiro ainda não recebeu avaliações.</p>
                </div>
              ) : (
                <>
                  {/* Resumo das avaliações */}
                  <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <StarRating rating={averageRating} readonly size={20} />
                      <span className="text-lg font-semibold text-text-primary">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-text-secondary">
                        ({ratings.length} {ratings.length === 1 ? 'avaliação' : 'avaliações'})
                      </span>
                    </div>
                  </div>

                  {/* Lista de avaliações */}
                  <div className="space-y-4">
                    {ratings.map((rating, index) => (
                      <div
                        key={index}
                        className="p-4 bg-secondary/20 rounded-lg border border-white/5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent-gold/20 rounded-full flex items-center justify-center">
                              <FiUser size={16} className="text-accent-gold" />
                            </div>
                            <div>
                              <p className="font-semibold text-text-primary">
                                {formatUsername(rating)}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {formatDate(rating.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={rating.rating} readonly size={14} />
                            {currentUser && rating.user_id === currentUser.id && (
                              <button
                                onClick={() => handleDeleteRating(index)}
                                className="p-1 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                title="Excluir minha avaliação"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {rating.comment && (
                          <p className="text-text-secondary text-sm leading-relaxed">
                            "{rating.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewRatingsModal;
