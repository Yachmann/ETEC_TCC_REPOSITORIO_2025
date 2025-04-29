import React, { useEffect, useState } from 'react';
import './PainelProfissional.css';
import { useNavigate } from 'react-router-dom';
import Backbutton from '../Backbutton';
import supabase from '../../../supabase';
import ServicoForm from '../ServicoForm';
import Servico from '../Servico';
import AssinarPlano from '../AssinarPlano';
import VerificarAssinatura from '../VerificarAssinatura';

const PainelProfissional = ({ profissional }) => {
  const [formData, setFormData] = useState(profissional);
  const [isEditing, setIsEditing] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [pedidosServicos, setPedidosServicos] = useState([])
  const [assinaturaAtiva, setAssinaturaAtiva] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    const verificarAssinatura = async () => {
      setAssinaturaAtiva(await checkAssinaturaAtiva());
    }
    verificarAssinatura();
    fetchServicos();
    fetchServicosPedidos();
    fetchAvaliacoes();
  }, []);

  const fetchServicos = async () => {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('profissional_id', profissional.id);

    if (error) {
      console.error('Erro ao Buscar Servicos:', error);
    } else {
      setServicos(data);
    }
  };
  const fetchAvaliacoes = async () => {
    const { data, error } = await supabase
      .from(`avaliacoes`)
      .select('*')
      .eq('profissional_id',profissional.id)
      if (error) {
        console.error('Erro ao Buscar Avaliacoes:', error);
      }
      else{
        console.log(data)
        setAvaliacoes(data)
      }
  }

  const fetchServicosPedidos = async () => {
    const { data, error } = await supabase
      .from('servicos_pedidos')
      .select('*')
      .eq('profissional_id', profissional.id);

    if (error) {
      console.error('Erro ao Buscar Pedidos de Serviço:', error);
    } else {
      setPedidosServicos(data);
    }
  };


  const HandleServicoCriado = async (novoServico, pedidoId) => {
    const { data, error } = await supabase
      .from('servicos')
      .insert([novoServico])
      .select('*')

    if (error) {
      console.error('Erro ao criar serviço:', error);
    } else if (data && data.length > 0) {
      setServicos([...servicos, data[0]]);
      setPedidosServicos(pedidosServicos.filter(pedido => pedido.id !== pedidoId))

    } else {
      console.warn('O serviço foi criado, mas nenhum dado foi retornado.');
    }

  };

  const HandleStatusMudado = (servicoId, statusNovo) => {
    setServicos(servicos.map(servico => servico.id === servicoId ? { ...servico, status: statusNovo } : servico));
    console.log(statusNovo)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    // Save the updated data to the database
    await supabase.from('profissionais').update(formData).eq('id', profissional.id);
    setIsEditing(false);
  };

  const [appear, setAppear] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAppear(true);
    }, 100);
  }, []);
  const checkAssinaturaAtiva = async () => {
    try {
      const { data, error } = await supabase
        .from('assinaturas')
        .select('id')
        .eq('profissional_id', profissional.id)
        .eq('status', 'ativo')


      if (error) {
        console.error('Erro ao verificar assinatura:', error.message);
        return false;
      }

      if (data) {
        console.log('Assinatura ativa encontrada:', data);
        return true;
      } else {
        console.log('Nenhuma assinatura ativa encontrada.');
        return false;
      }
    } catch (err) {
      console.error('Erro inesperado ao verificar assinatura:', err.message);
      return false;
    }
  };
  const HandleLogout = () => {
    localStorage.removeItem('profissional');
    navigate('/');
  };

  return (
    <div>
      <div className='headerbotao'>
        <Backbutton rota={'/'} />
        <button className='botao-logout' onClick={HandleLogout}>Logout</button>
      </div>
      {assinaturaAtiva ? null : (<AssinarPlano profissionalId={profissional.id} />)}


      <div className={`painel-profissional ${appear ? 'appear' : ''}`}>
        <h1>Painel do Profissional</h1>
        <div className="profile-section">
          <h2>Dados Pessoais</h2>
          {isEditing ? (
            <div className="form">
              <label>
                Nome:
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </label>
              <label>
                Profissão:
                <input
                  type="text"
                  name="profissao"
                  value={formData.profissao}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Telefone:
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </label>
              <label>
                Localização:
                <input
                  type="text"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                />
              </label>
              <label>
                Anos de Experiência:
                <input
                  type="number"
                  name="anosExperiencia"
                  value={formData.anosExperiencia}
                  onChange={handleChange}
                />
              </label>
              <label>
                Sobre:
                <textarea
                  name="sobre"
                  value={formData.sobre}
                  onChange={handleChange}
                />
              </label>
              <button onClick={handleSave}>Salvar</button>
              <button onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          ) : (
            <div className="detalhes">
              <p><strong>Nome:</strong> {formData.nome}</p>
              <p><strong>Profissão:</strong> {formData.profissao}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Telefone:</strong> {formData.telefone}</p>
              <p><strong>Localização:</strong> {formData.localizacao}</p>
              <p><strong>Anos de Experiência:</strong> {formData.anosExperiencia}</p>
              <p><strong>Sobre:</strong> {formData.sobre}</p>
              <button onClick={() => setIsEditing(true)}>Editar</button>
            </div>
          )}
        </div>
        <div className="avaliacao-section">
          <h2>Avaliações</h2>
          <div className='avaliacoes-container'>
          {avaliacoes.map(avaliacao => (
            <div key={avaliacao.id} className="avaliacao-item">
             
              <p><strong>Nota:</strong> {avaliacao.nota}</p>
              <p><strong>Comentário:</strong> {avaliacao.comentario}</p>
            </div>
          ))}
          </div>
        </div>
        <VerificarAssinatura profissionalId={profissional.id}>
          <div className="servicos-section">
            <h2>Serviços Requeridos</h2>
            <ul>
              {servicos.map(servico => (
                <Servico key={servico.id} servico={servico} aoAlterarStatus={HandleStatusMudado} />
              ))}
            </ul>
          </div>
          <div className="service-pedidos-section">
            <h2>Pedidos de Serviço</h2>
            <ul className='pedido_servico_container'>
              {pedidosServicos.map(pedido => {
                // Verifica se existe um serviço associado a este pedido
                const jaCriado = servicos.some(servico => servico.usuario_id === pedido.user_id && servico.detalhes === pedido.detalhes);

                return (
                  
                  <li className='pedido_servico' key={pedido.id}>
                    <p>User ID: {pedido.user_id}</p>
                    <p>Detalhes: {pedido.detalhes}</p>
                    <p>Endereço: {pedido.endereco}</p>
                    {jaCriado && (
                      <h4 className='jacriado'>Ja Criado</h4>
                    )}

                    {!jaCriado && (
                      <button onClick={() => HandleServicoCriado({
                        profissional_id: profissional.id,
                        usuario_id: pedido.user_id,
                        status: 'Pendente',
                        detalhes: pedido.detalhes,
                        endereco: pedido.endereco
                      }, pedido.id)}>
                        Criar Serviço
                      </button>
                    )}
                  </li>
                  
                );
              })}
            </ul>
          </div>
        </VerificarAssinatura>
      </div>
    </div>
  );
};

export default PainelProfissional;