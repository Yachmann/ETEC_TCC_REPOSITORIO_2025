import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SuccessPage = () => {
  const [status, setStatus] = useState('');
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch(`http://localhost:4242/subscription-status/${sessionId}`);
        const data = await response.json();
        setStatus(data.status);
      } catch (error) {
        console.error('Erro ao verificar status da assinatura:', error);
      }
    };

    if (sessionId) {
      fetchSubscriptionStatus();
    }
  }, [sessionId]);

  if (!sessionId) {
    return <p>Erro: ID da sessão não encontrado.</p>;
  }
  navigate(`/`); // Redireciona para o painel profissional após verificar o status da assinatura
  return (
    <div>
      <h1>Pagamento Concluído</h1>
      {status ? (
        <p>Status da assinatura: {status}</p>
      ) : (
        <p>Verificando status da assinatura...</p>
      )}
    </div>
  );
};

export default SuccessPage;