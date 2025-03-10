import './ServicoPedidoForm.css';
import React, { useState } from 'react';
import supabase from '../../../supabase';

const ServicoPedidoForm = ({ profissionalId, aoPedidoCriado }) => {
  const [detalhes, setDetalhes] = useState('');
  const [message, setMessage] = useState('');
  const [endereco, setEndereco] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
    if (sessionError || !sessionData.session) {
      setMessage('Usuário não está logado.');
      return;
    }
  
    const userId = sessionData.session.user.id;
  
    const { data, error } = await supabase
      .from('servicos_pedidos')
      .insert([{ user_id: userId, profissional_id: profissionalId, detalhes, endereco }])
      .select('*');
  
    if (error) {
      console.error('Erro ao criar pedido de serviço:', error);
      setMessage('Erro ao criar pedido de serviço: ' + error.message);
    } else if (data && data.length > 0) {
      console.log('criando pedido para o profissional de id = ', profissionalId);
      aoPedidoCriado(data[0]);
      setDetalhes('');
      setEndereco('');
      setMessage('Pedido de serviço criado com sucesso!');
    } else {
      setMessage('O pedido foi criado, mas nenhum dado foi retornado.');
      console.warn('Nenhum dado retornado pelo insert.');
    }
  };

  return (
    <form className="servico-pedido-form" onSubmit={handleSubmit}>
      <h3>Solicitar Serviço</h3>
      <label>
        <span>Detalhes do Serviço:</span>
        <textarea
          value={detalhes}
          onChange={(e) => setDetalhes(e.target.value)}
          placeholder="Descreva o serviço que você precisa..."
        />
      </label>
      <label>
        <span>Endereço:</span>
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Digite o endereço para o serviço"
        />
      </label>
      <button type="submit">Requerir Serviço</button>
      {message && <p className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>{message}</p>}
    </form>
  );
};

export default ServicoPedidoForm;