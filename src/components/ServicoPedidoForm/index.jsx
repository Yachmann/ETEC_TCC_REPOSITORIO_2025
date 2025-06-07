import './ServicoPedidoForm.css';
import React, { useState, useEffect } from 'react';
import supabase from '../../../supabase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const ServicoPedidoForm = ({ profissionalId, aoPedidoCriado }) => {
  const [detalhes, setDetalhes] = useState('');
  const [message, setMessage] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataServico, setDataServico] = useState('');
  const [diasIndisponiveis, setDiasIndisponiveis] = useState([]);
  useEffect(() => {
    const carregarDiasIndisponiveis = async () => {
      const { data, error } = await supabase
        .from('dias_indisponiveis')
        .select('data')
        .eq('profissional_id', profissionalId);

      if (error) {
        console.error('Erro ao carregar dias indisponíveis:', error);
      } else {
        // Extrai só as datas em string para facilitar comparação
        const datas = data.map(d => d.data);
        setDiasIndisponiveis(datas);
      }
    };

    carregarDiasIndisponiveis();
  }, [profissionalId]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      setMessage('Usuário não está logado.');
      return;
    }
    if (!dataServico) {
      setMessage('Por favor, selecione uma data válida.');
      return;
    }
    const dataISO = dataServico.toISOString().split('T')[0]; // "2025-06-10"
    const userId = sessionData.session.user.id;

    const { data, error } = await supabase
      .from('servicos_pedidos')
      .insert([{ user_id: userId, profissional_id: profissionalId, detalhes, endereco, data_servico: dataISO }])
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
  // Função para bloquear datas no calendário
  const isDayBlocked = (date) => {
    return diasIndisponiveis.some(diaIndisponivel => {
      const dia = new Date(diaIndisponivel);
      return dia.toDateString() === date.toDateString();
    });
  };

  return (
    <form className="servico-pedido-form" onSubmit={handleSubmit}>
      <h3>Solicitar Serviço</h3>
      <label>
        <span >Detalhes do Serviço:</span>
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
      <label>
        <span>Data do Serviço:</span>
        <DatePicker
          selected={dataServico}
          onChange={(date) => setDataServico(date)}
          filterDate={(date) => !isDayBlocked(date)} // bloqueia datas indisponíveis
          placeholderText="Selecione a data do serviço"
          dateFormat="dd/MM/yyyy"
          required
        />
      </label>
      <button type="submit">Requerir Serviço</button>
      {message && <p className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>{message}</p>}
    </form>
  );
};

export default ServicoPedidoForm;