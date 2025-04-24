import React from 'react';

const AssinarPlano = ({ profissionalId }) => {
  if (!profissionalId) {
    return <p>Profissional ID não fornecido.</p>;
  }
  console.log('Profissional ID recebido no componente:', profissionalId);
  const handleCheckout = async () => {
    try {
      const payload = {
        priceId: 'price_1RHUr5CemoYFtpZyec8tdm8f',
        profissionalId,
      };
      alert(`Enviando para o backend: ${JSON.stringify(payload)}`);
  
      const response = await fetch('http://localhost:4242/create-checkout-session', {
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
      alert(`URL recebida do backend: ${url}`);
      window.location.href = url; // Redireciona para o Stripe Checkout
    } catch (error) {
      alert(`Erro ao criar sessão de checkout: ${error.message}`);
    }
  };
  return <button onClick={handleCheckout}>Assinar Plano</button>;
};

export default AssinarPlano;