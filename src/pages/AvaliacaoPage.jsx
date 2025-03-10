import React from 'react';
import { useLocation } from 'react-router-dom';
import RatingForm from '../components/RatingForm';
import useEvaluations from '../hooks/useEvaluations';

const AvaliacaoPage = () => {
  const location = useLocation();
  const { profissional } = location.state;
  const { HandleNewEvaluation, fetchEvaluations } = useEvaluations(profissional.id);

  return (
    <div>
      <h1>Avaliar Profissional</h1>
      <RatingForm 
        onNewEvaluation={HandleNewEvaluation} 
        profissional={profissional} 
        refreshEvaluations={fetchEvaluations} // Passando a função para atualizar a lista
      />
    </div>
  );
};

export default AvaliacaoPage;
