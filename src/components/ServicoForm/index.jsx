import React, { useState } from 'react';
import supabase from '../../../supabase';

const ServicoForm = ({ profissionalId, aoServicoCriado }) => {
  const [userId, setUserId] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('servicos')
      .insert([{ 
        profissional_id: profissionalId, 
        usuario_id: userId, 
        status: 'Pendente', 
        detalhes: details 
      }])
      .select();  // <- Adicionando .select() para garantir que retorna os dados
  
    console.log('Resposta do Supabase:', { data, error });
  
    if (error) {
      console.error('Erro ao criar serviço:', error.message, error.details);
    } else if (data && data.length > 0) {
      aoServicoCriado(data[0]);
      setUserId('');
      setDetails('');
    } else {
      console.error('Resposta inesperada do Supabase:', data);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <label>
        User ID:
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </label>
      <label>
        Details:
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </label>
      <button type="submit">Create Service</button>
    </form>
  );
};

export default ServicoForm;