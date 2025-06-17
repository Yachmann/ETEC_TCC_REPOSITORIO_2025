import React, { useEffect, useState } from 'react';
import './PainelProfissional.css';
import { useNavigate, useParams } from 'react-router-dom';
import Backbutton from '../Backbutton';
import supabase from '../../../supabase';
import ServicoForm from '../ServicoForm';
import Servico from '../Servico';
import AssinarPlano from '../AssinarPlano';
import VerificarAssinatura from '../VerificarAssinatura';
import emailjs from 'emailjs-com';
import CalendarioIndisponiveis from '../CalendarioIndisponiveis'; // ajuste o caminho se necessário
import { motion } from 'framer-motion';
const PainelProfissional = ({ profissional }) => {
  const [usuarios, setUsuarios] = useState({});
  const [formData, setFormData] = useState(profissional);
  const [isEditing, setIsEditing] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [pedidosServicos, setPedidosServicos] = useState([])
  const [assinaturaAtiva, setAssinaturaAtiva] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingService, setLoadingService] = useState(false)
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedProfissional = localStorage.getItem('profissional');
        if (!storedProfissional) {
          navigate('/loginprofissional');
          return;
        }
        const parsedProfissional = JSON.parse(storedProfissional);
        if (!parsedProfissional?.id) {
          navigate('/loginprofissional');
          return;
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        navigate('/loginprofissional');
      }
    };

    checkAuth();
  }, [navigate]); // Adicionamos navigate como dependência


  useEffect(() => {
    const verificarAssinatura = async () => {
      const ativa = await checkAssinaturaAtiva();
      setAssinaturaAtiva(ativa);
    };
    verificarAssinatura().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchServicos();
    fetchServicosPedidos();
    fetchAvaliacoes();
  }, []);

  useEffect(() => {
    if (servicos.length > 0 || pedidosServicos.length > 0) {
      fetchUsuarios();
    }
  }, [servicos, pedidosServicos]);


  const fetchUsuarios = async () => {
    const userIds = [
      ...new Set([
        ...servicos.map(s => s.usuario_id),
        ...pedidosServicos.map(p => p.user_id)
      ])
    ];

    if (userIds.length === 0) return;

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, telefone')
      .in('id', userIds);

    if (error) {
      console.error('Erro ao buscar dados dos usuários:', error);
    } else {
      const usuariosMap = {};
      data.forEach(u => usuariosMap[u.id] = u);
      setUsuarios(usuariosMap);
    }
  };

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
      .eq('profissional_id', profissional.id)
    if (error) {
      console.error('Erro ao Buscar Avaliacoes:', error);
    }
    else {
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
    try {
      // Criar o serviço
      setLoadingService(true)
      const { data, error } = await supabase
        .from('servicos')
        .insert([novoServico])
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {

        // Buscar o pedido original para saber o ID do usuário
        const pedido = pedidosServicos.find(p => p.id === pedidoId);
        if (!pedido) {
          console.warn('Pedido não encontrado.');
          return;
        }

        const usuario = usuarios[pedido.user_id];
        if (!usuario || !usuario.email) {
          console.warn('Usuário não encontrado ou sem e-mail.');
          return;
        }

        const emailParams = {
          to_name: usuario.nome,
          to_email: usuario.email,
          message: `Seu pedido foi aceito pelo profissional ${profissional.nome}! Ele entrará em contato com você em breve.`,
          data_servico: novoServico.data_servico,
          endereco: novoServico.endereco,
        };

        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE2_ID,
          emailParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        setServicos([...servicos, data[0]]);
        setPedidosServicos(pedidosServicos.filter(pedido => pedido.id !== pedidoId));
        console.log('E-mail enviado ao usuário com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao criar serviço ou enviar e-mail:', err.message || err);
    }
    setLoadingService(false)
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
        .eq('status', 'active');

      if (error) {
        console.error('Erro ao verificar assinatura:', error.message);
        return false;
      }

      const assinaturaEstaAtiva = data && data.length > 0;
      console.log('Assinatura ativa?', assinaturaEstaAtiva, data);
      return assinaturaEstaAtiva;

    } catch (err) {
      console.error('Erro inesperado ao verificar assinatura:', err.message);
      return false;
    }
  };

  const HandleLogout = () => {
    localStorage.removeItem('profissional');
    navigate('/');
  };

  if (Number(id) !== profissional.id) {
    navigate('/')
  }
  if (loading) {
    return <div><h2>Carregando Seus Dados. Aguarde um momento...</h2></div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div>
        <div className='headerbotao'>
          <Backbutton rota={'/'} />
          <button className='botao-logout' onClick={HandleLogout}>Logout</button>
        </div>
        {console.log('Renderização do componente. Assinatura ativa:', assinaturaAtiva)}
        {assinaturaAtiva ? null : (
          <AssinarPlano
            profissionalId={profissional.id}
            onAssinaturaAtivada={() => setAssinaturaAtiva(true)}
          />
        )}


        <div className={`painel-profissional ${appear ? 'appear' : ''}`}>
          <h1>Painel do Profissional</h1>

          <div className="profile-section">
            <div className='header-section'>
              <h2 className='dados-title'>Dados Pessoais</h2>
              {assinaturaAtiva && (
                <button
                  className='planner-button'
                  onClick={() => navigate(`/planner/${profissional.id}`)}
                >
                  <span className="icon">📋</span> Acessar Planner
                </button>
              )}
            </div>
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
              {loading ? (<Spinner />)
                : !assinaturaAtiva ?
                  (<h3>Assine nosso plano para obter acesso às avaliações de seus Clientes</h3>)
                  : (avaliacoes.map(avaliacao => (
                    <div key={avaliacao.id} className="avaliacao-item">

                      <p><strong>Nota:</strong> {avaliacao.nota}</p>
                      <p><strong>Comentário:</strong> {avaliacao.comentario}</p>
                    </div>

                  ))

                  )}




            </div>
            <div className='service-pedidos-section' style={{ marginTop: '40%' }}>
              {loading ? (<Spinner />)
                : !assinaturaAtiva ?
                  (<h3>Assine nosso plano para obter acesso às avaliações de seus Clientes</h3>)
                  :
                  <div className="indisponibilidade-section">
                    <h2>Definir Dias Indisponíveis</h2>
                    <CalendarioIndisponiveis profissionalId={profissional.id} />
                  </div>
              }




            </div>


            <VerificarAssinatura profissionalId={profissional.id}>
              <div className="servicos-section">
                <h2>Serviços Requeridos</h2>
                <ul>
                  {servicos.map(servico => (
                    <Servico
                      key={servico.id}
                      servico={servico}
                      usuario={usuarios[servico.usuario_id]}
                      aoAlterarStatus={HandleStatusMudado}
                    />
                  ))}
                </ul>
              </div>
              <div className="service-pedidos-section">
                <h2>Pedidos de Serviço</h2>
                <ul className='pedido_servico_container'>
                  {pedidosServicos.map(pedido => {
                    const jaCriado = servicos.some(servico => servico.usuario_id === pedido.user_id && servico.detalhes === pedido.detalhes);

                    return (
                      <li className='pedido_servico' key={pedido.id}>
                        <p ><strong>User ID:</strong> {pedido.user_id}</p>
                        <p><strong>Detalhes:</strong> {pedido.detalhes}</p>
                        <p><strong>Endereço:</strong> {pedido.endereco}</p>
                        <p><strong>Data:</strong> {pedido.data_servico}</p>

                        {jaCriado && (
                          <h4 className='jacriado'>Já Criado</h4>
                        )}

                        {!jaCriado && (
                          <button disabled={loadingService} onClick={() => HandleServicoCriado({
                            profissional_id: profissional.id,
                            usuario_id: pedido.user_id,
                            status: 'Pendente',
                            detalhes: pedido.detalhes,
                            endereco: pedido.endereco,
                            data_servico: pedido.data_servico
                          }, pedido.id)}>
                            {loadingService ? 'Carregando...' : 'Criar Serviço'}
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
      </div>
    </motion.div>
  );
};

export default PainelProfissional;