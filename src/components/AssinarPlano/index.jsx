import React from 'react';

const AssinarPlano = ({ profissionalId }) => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1RBKa62REZNadT9sFEymMXxo', // Substitua pelo ID do preço do plano
          profissionalId, // Envia o ID do profissional
        }),
      });

      const { url } = await response.json();
      window.location.href = url; // Redireciona para o Stripe Checkout
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
    }
  };

  return <button onClick={handleCheckout}>Assinar Plano</button>;
};

export default AssinarPlano;