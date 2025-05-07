import { useEffect, useState } from "react";
import supabase from "../../../supabase";

const VerificarAssinatura = ({ profissionalId, children }) => {
  const [assinaturaAtiva, setAssinaturaAtiva] = useState(false);

  useEffect(() => {
    if (!profissionalId) {
      console.error('Erro: profissionalId não foi fornecido.');
      return;
    }

    const verificarAssinatura = async () => {
      try {
        const { data, error } = await supabase
          .from('assinaturas')
          .select('status')
          .eq('profissional_id', profissionalId);

        console.log('Dados retornados da tabela assinaturas:', data);

        if (error) {
          console.error('Erro ao verificar assinatura:', error.message);
        } else if (data && data.length > 0) {
          const assinaturaAtiva = data.some(assinatura => assinatura.status === 'active');
          console.log('Assinatura ativa:', assinaturaAtiva);
          setAssinaturaAtiva(assinaturaAtiva);
        } else {
          console.log('Nenhuma assinatura encontrada para este profissional.');
          setAssinaturaAtiva(false);
        }
      } catch (err) {
        console.error('Erro inesperado ao verificar assinatura:', err);
      }
    };

    verificarAssinatura();
  }, [profissionalId]);

  return (
    <div className="verificar-assinatura-container">
      {!assinaturaAtiva && (
        <p className="assinatura-inativa-msg">
          Você precisa assinar um plano para acessar os serviços e pedidos de serviço.
        </p>
      )}
      {assinaturaAtiva && (
        <div className="children-container">
          {children}
        </div>
      )}
    </div>
  );
};

export default VerificarAssinatura;
