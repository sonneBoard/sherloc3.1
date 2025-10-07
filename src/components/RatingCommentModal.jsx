import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMessageSquare } from 'react-icons/fi';
import ErrorNotification from './ErrorNotification';

const RatingCommentModal = ({ isOpen, onClose, onSubmit, rating }) => {
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  
  const showErrorNotification = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  const handleSubmit = () => {
    onSubmit(comment.trim());
    setComment('');
    onClose();
  };

  const handleSkip = () => {
    onSubmit('');
    setComment('');
    onClose();
  };

  return (
    <>
      <ErrorNotification 
        isVisible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
      <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            className="glass-card w-full max-w-md rounded-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="font-poppins text-xl font-bold text-text-primary">
                Avaliação de {rating} estrela{rating !== 1 ? 's' : ''}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary">
                  <FiMessageSquare />
                  Tem algo a dizer sobre este roteiro? (Opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Compartilhe sua experiência ou dicas sobre este roteiro..."
                  className="w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all text-text-primary placeholder:text-text-secondary resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-text-secondary mt-1 text-right">
                  {comment.length}/500
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-white/5 text-text-primary font-semibold py-2 px-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  Pular
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-accent-gold text-primary font-semibold py-2 px-4 rounded-lg hover:brightness-110 transition-colors"
                >
                  Enviar Avaliação
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default RatingCommentModal;
