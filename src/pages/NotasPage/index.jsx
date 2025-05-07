

// NotasPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../../../supabase';
import Calendario from '../../components/Calendario';
import './NotasPage.css';
import Backbutton from '../../components/Backbutton';

const NotasPage = () => {
  const { profissionalId } = useParams();
  const [notas, setNotas] = useState([]);
  const [novaNota, setNovaNota] = useState({ titulo: '', conteudo: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

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
    fetchNotas();
    fetchAssinatura();
  }, [profissionalId]);

  const fetchAssinatura = async () => {
    const {data,error } = await supabase
    .from('assinaturas')
    .select('*')
    .eq('profissional_id',profissionalId)
    .eq('status','active')

    if(!data){
      console.log('assinatura nao ativa')
      navigate(`/logged/${profissionalId}`)
    }
    else if(data){
      console.log(data)
    }
  }
  const fetchNotas = async () => {
    setLoading(true);
    const { data } = await supabase.from('notas_profissional').select('*').eq('profissional_id', profissionalId).order('data_criacao', { ascending: false });
    setNotas(data || []);
    setLoading(false);
  };

  const adicionarNota = async () => {
    if (!novaNota.titulo) return;
    await supabase.from('notas_profissional').insert([{ ...novaNota, profissional_id: profissionalId }]);
    setNovaNota({ titulo: '', conteudo: '' });
    fetchNotas();
  };

  const toggleConcluida = async (id, current) => {
    await supabase.from('notas_profissional').update({ concluida: !current }).eq('id', id);
    fetchNotas();
  };

  const apagarNota = async id => {
    await supabase.from('notas_profissional').delete().eq('id', id);
    fetchNotas();
  };

  return (
    <div className="notas-container">
      <Backbutton rota={`/logged/${profissionalId}`} />
      <h2>Planner</h2>

      <div className="form-nota">
        <input type="text" placeholder="Título" value={novaNota.titulo} onChange={e => setNovaNota({ ...novaNota, titulo: e.target.value })} />
        <textarea placeholder="Conteúdo" value={novaNota.conteudo} onChange={e => setNovaNota({ ...novaNota, conteudo: e.target.value })} />
        <button onClick={adicionarNota} disabled={loading}>Adicionar Nota</button>
      </div>

      {loading ? <div className="loading">Carregando notas...</div> : (
        <ul className="lista-notas">
          {notas.map(n => (
            <li key={n.id} className={n.concluida ? 'nota concluida' : 'nota'}>
              <div>
                <h3>{n.titulo}</h3>
                <p>{n.conteudo}</p>
                <small>{new Date(n.data_criacao).toLocaleString()}</small>
              </div>
              <div className="acoes">
                <button className='concluir' onClick={() => toggleConcluida(n.id, n.concluida)}>{n.concluida ? 'Reabrir' : 'Concluir'}</button>
                <button className='apagar' onClick={() => apagarNota(n.id)}>Apagar</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Calendario profissional_id={profissionalId} />
    </div>
  );
};

export default NotasPage;
