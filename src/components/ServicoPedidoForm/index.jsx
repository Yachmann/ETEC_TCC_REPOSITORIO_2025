import './ServicoPedidoForm.css';
import { useState, useEffect } from 'react';
import supabase from '../../../supabase';
import emailjs from 'emailjs-com';
import DatePicker from 'react-datepicker';
const ServicoPedidoForm = ({ profissionalId, aoPedidoCriado }) => {
  const [detalhes, setDetalhes] = useState('');
  const [message, setMessage] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataServico, setDataServico] = useState('');
  const [diasIndisponiveis, setDiasIndisponiveis] = useState([]);
  const [sucesso, setSucesso] = useState(null)
  const [loading, setLoading] = useState(false)
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

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        setMessage('Usuário não está logado.');
        return;
      }

      if (!dataServico) {
        setMessage('Por favor, selecione uma data válida.');
        return;
      }

      const dataISO = dataServico.toISOString().split('T')[0];
      const userId = sessionData.session.user.id;

      // 1. Cria o pedido no banco
      setLoading(true)
      const { data, error } = await supabase
        .from('servicos_pedidos')
        .insert([{ user_id: userId, profissional_id: profissionalId, detalhes, endereco, data_servico: dataISO }])
        .select('*');

      if (error) throw new Error(error.message);

      // 2. Busca o e-mail do profissional
      const { data: profissionalData, error: profError } = await supabase
        .from('profissionais')
        .select('email, nome')
        .eq('id', profissionalId)
        .single(); // já retorna um objeto direto

      if (profError) throw new Error('Erro ao buscar e-mail do profissional.');

      // 3. Envia o e-mail via EmailJS
      const emailParams = {
        to_email: profissionalData.email,
        to_name: profissionalData.nome || 'Profissional',
        message: `Você recebeu um novo pedido de serviço!\n\nDetalhes: ${detalhes}\nEndereço: ${endereco}\nData: ${dataISO}`,
        data_servico: dataISO,
        endereco: endereco,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // 4. Feedback para o usuário
      if (data && data.length > 0) {
        aoPedidoCriado(data[0]);
        setDetalhes('');
        setEndereco('');
        setMessage('');
        setSucesso('Criado Com Sucesso! Aguarde Resposta Profissional');
        setTimeout(() => setSucesso(null), 3000);
      } else {
        setMessage('O pedido foi criado, mas nenhum dado foi retornado.');
      }

    } catch (err) {
      console.error('Erro no pedido:', err);
      setMessage('Erro ao criar pedido ou enviar e-mail: ' + err.message);
    }
    setLoading(false)
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
        <DatePicker className='react-datepicker'
          selected={dataServico}
          onChange={(date) => setDataServico(date)}
          filterDate={(date) => !isDayBlocked(date)} // bloqueia datas indisponíveis
          placeholderText="Selecione a data do serviço"
          dateFormat="dd/MM/yyyy"
          required
        />
      </label>
      <button disabled={loading} className='servicoformbutton' type="submit">
        {loading ? 'Carregando...' : 'Requerir Serviço'}
      </button>
      {message.includes('Erro') && <p className={`message error'`}>{message}</p>}
      {sucesso && (
        <div className="mensagem-sucesso">
          {sucesso}
        </div>
      )}
    </form>
  );
};

export default ServicoPedidoForm;