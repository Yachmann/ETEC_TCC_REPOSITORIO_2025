import React from 'react';
import './AssinarPlano.css'; // crie este arquivo se ainda não existir

const AssinarPlano = ({ profissionalId }) => {
  if (!profissionalId) {
    return <p className="alerta-assinatura">Profissional ID não fornecido.</p>;
  }

  const handleCheckout = async () => {
    try {
      const payload = {
        priceId: 'price_1RTuMACemoYFtpZyQtbjYQnw',
        profissionalId,
      };

      const response = await fetch('https://etectccrepositorio2025-production.up.railway.app/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Erro na resposta do backend: ${errorText}`);
        return;
      }

      const { url } = await response.json();
      window.location.href = url; // Redireciona para o Stripe Checkout
    } catch (error) {
      alert(`Erro ao criar sessão de checkout: ${error.message}`);
    }
  };

  return (
    <div className="assinatura-wrapper">
      <p className="alerta-assinatura">
        Você ainda não possui uma assinatura ativa. Assine um plano para começar a receber pedidos.
      </p>
      <button className="botao-assinar-plano" onClick={handleCheckout}>
        Assinar Plano
      </button>
    </div>
  );
};

export default AssinarPlano;
