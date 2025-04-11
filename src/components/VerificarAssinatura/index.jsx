import React, { useEffect, useState } from 'react';
import supabase from '../../../supabase';

const VerificarAssinatura = ({ profissionalId }) => {
  const [assinaturaAtiva, setAssinaturaAtiva] = useState(false);

  useEffect(() => {
    if (!profissionalId) {
      console.error('Erro: profissionalId não foi fornecido.');
      return;
    }

    const verificarAssinatura = async () => {
      const { data, error } = await supabase
        .from('assinaturas')
        .select('status')
        .eq('profissional_id', profissionalId);

      if (error) {
        console.error('Erro ao verificar assinatura:', error.message);
      } else if (data && data.length > 0) {
        // Verifica se há alguma assinatura com status "active"
        const assinaturaAtiva = data.some(assinatura => assinatura.status === 'active');
        setAssinaturaAtiva(assinaturaAtiva);
      } else {
        console.log('Nenhuma assinatura encontrada para este profissional.');
      }
    };

    verificarAssinatura();
  }, [profissionalId]);

  if (!assinaturaAtiva) {
    return <p>Você precisa assinar um plano para acessar os pedidos.</p>;
  }

  return <p>Bem-vindo! Você tem acesso aos pedidos.</p>;
};

export default VerificarAssinatura;