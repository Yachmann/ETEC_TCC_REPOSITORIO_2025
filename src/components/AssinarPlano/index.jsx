import React, { useState } from 'react';
import supabase from '../../../supabase'; // ajuste o caminho se precisar
import './AssinarPlano.css';
import { useNavigate } from 'react-router-dom';

const AssinarPlano = ({ profissionalId, onAssinaturaAtivada }) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate()
  if (!profissionalId) {
    return <p className="alerta-assinatura">Profissional ID não fornecido.</p>;
  }

  const handleSimularAssinatura = async () => {
    setLoading(true);
    setErro(null);
    try {
      // Atualiza a assinatura para "active" ou cria uma nova com status active
      const { data, error } = await supabase
        .from('assinaturas')
        .upsert(
          { profissional_id: profissionalId, status: 'active' },
          { onConflict: 'profissional_id' }

        );
      navigate(`/assinaturapage`, {state: {profissionalId: profissionalId}})

      if (error) {
        setErro('Erro ao ativar assinatura: ' + error.message);
        setLoading(false);
        return;
      }

      // Opcional: avisa o componente pai que a assinatura foi ativada
      if (onAssinaturaAtivada) onAssinaturaAtivada();

    } catch (err) {
      setErro('Erro inesperado: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="assinatura-wrapper">
      <p className="alerta-assinatura">
        Você ainda não possui uma assinatura ativa. Clique para simular assinatura.
      </p>
      {erro && <p className="erro">{erro}</p>}
      <button
        className="botao-assinar-plano"
        onClick={handleSimularAssinatura}
        disabled={loading}
      >
        {loading ? 'Ativando...' : 'Ativar Assinatura'}
      </button>
    </div>
  ); c
};

export default AssinarPlano;
