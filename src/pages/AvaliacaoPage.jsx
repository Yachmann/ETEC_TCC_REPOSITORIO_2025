import React from 'react';
import { useLocation } from 'react-router-dom';
import RatingForm from '../components/RatingForm';
import useEvaluations from '../hooks/useEvaluations';
import { motion } from 'framer-motion';
import './AvaliacaoPage.css'
const AvaliacaoPage = () => {
  const location = useLocation();
  const { profissional } = location.state;
  const { HandleNewEvaluation, fetchEvaluations } = useEvaluations(profissional.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className='containerr'>
        <h1 className='tituloavaliacaoform'>Avaliar Profissional</h1>
        <RatingForm
          onNewEvaluation={HandleNewEvaluation}
          profissional={profissional}
          refreshEvaluations={fetchEvaluations} // Passando a função para atualizar a lista
        />
      </div>
    </motion.div>
  );
};

export default AvaliacaoPage;
