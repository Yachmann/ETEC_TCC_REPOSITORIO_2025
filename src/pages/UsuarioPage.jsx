import { useState, useEffect } from "react";
import supabase from "../../supabase";
import { Link, useNavigate } from "react-router-dom";
import Backbutton from '../components/Backbutton';
import Spinner from '../components/Spinner';
import './UsuarioPage.css';
import { motion } from 'framer-motion';
const UsuarioPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [estaEditando, setEstaEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nome: "", email: "", telefone: "", dataNascimento: "", endereco: "" });
  const [sucesso, setSucesso] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAll() {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) return navigate("/logincliente");

      // 1️⃣ Buscar dados do usuário
      const { data: u, error: errU } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .single();
      if (errU) console.error(errU);
      else {
        setUsuario(u);
        setFormData({ nome: u.nome, email: u.email, telefone: u.telefone, dataNascimento: u.dataNascimento, endereco: u.endereco });
      }

      // 2️⃣ Buscar serviços
      const { data: s, error: errS } = await supabase
        .from("servicos")
        .select(`
    *,
    profissionais:profissional_id (
      id,
      nome,
      email,
      telefone
    )
  `)
        .eq("usuario_id", userId);
      console.log('data:', s)
      if (errS) console.error(errS);
      else setServicos(s);

      // 3️⃣ Buscar favoritos com join em profissionais
      const { data: favs, error: errF } = await supabase
        .from("favoritos")
        .select(`
          id,
          profissionais (
            id, nome, profissao, telefone, email, anosExperiencia, localizacao
          )
        `)
        .eq("usuario_id", userId);
      if (errF) console.error(errF);
      else {

        setFavoritos(favs.map(f => f.profissionais));
        console.log('favoritos: ', favs)
      }

      setLoading(false);
    }
    fetchAll();
  }, [navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true)
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    const { error } = await supabase.from("usuarios").update(formData).eq("id", userId);
    if (error) console.error(error);
    else {
      setUsuario(u => ({ ...u, ...formData }));
      setSucesso('Alterado Com Sucesso!')
      setTimeout(() => {
        setSucesso(null)
      }, 3000)
      setEstaEditando(false);

    }
    setLoading(false)
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/logincliente");
  };
  const HandleDirecionar = (profissionalid) => {
    navigate(`/profissional/${profissionalid}`, { state: { userId: usuario.id, vindoDeFavoritos: true } })
  }
  if (loading) {
    return (
      <div className="loading">
        <Spinner />
        <h2>Carregando suas informações...</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="usuario-container">
        <div className="usuario-header">
          <Backbutton rota={'/buscar'} />
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>

        <h1 className="titleuser">Olá, {formData.nome.toUpperCase()}</h1>

        {/* Dados Pessoais */}
        <section className="perfil-secao">
          <h2>Dados Pessoais</h2>
          {estaEditando ? (
            <div className="form">
              {["nome", "email", "telefone", "dataNascimento", "endereco"].map(field => (
                <label key={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                  <input
                    type={field === "dataNascimento" ? "date" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </label>
              ))}
              <button onClick={handleSave}>Salvar</button>
              <button onClick={() => setEstaEditando(false)}>Cancelar</button>
            </div>
          ) : (
            <div className="detalhes">
              {Object.entries(formData).map(([key, val]) => (
                <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {val}</p>
              ))}
              <button onClick={() => setEstaEditando(true)}>Editar</button>
            </div>
          )}
          {sucesso && (
            <div class="mensagem-sucesso">
              {sucesso}
            </div>
          )}
        </section>
        {/* FAVORITOS */}
        <section className="favoritos-secao">
          <h2>Seus Favoritos</h2>
          {favoritos.length === 0 ? (
            <p>Você ainda não favoritou nenhum profissional.</p>
          ) : (
            <div className="favoritos-cards">
              {favoritos.map(p => (
                <div key={p.id} className="card-favorito">
                  <h3>{p.nome}</h3>
                  <p>{p.profissao}</p>
                  <p>{p.localizacao}</p>
                  <button className="ver-mais" onClick={() => HandleDirecionar(p.id)} >
                    Ver Mais</button>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Serviços */}
        <section className="servicos-secao">
          <h2>Serviços</h2>
          <ul>
            {servicos.map(s => (
              <li key={s.id} className="servico-item">
                <p><strong>Detalhes:</strong> {s.detalhes}</p>
                <p className={`status ${s.status.toLowerCase()}`}>
                  <strong>Status:</strong> {s.status}
                </p>
                {s.profissionais && (
                  <>
                    <p><strong>Profissional:</strong> {s.profissionais.nome}</p>

                    <div className="botoes-servico">
                      <a
                        href={`https://wa.me/55${s.profissionais.telefone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="botao-contato"
                      >
                        WhatsApp
                      </a>

                      <a
                        href={`mailto:${s.profissionais.email}`}
                        className="botao-contato"
                      >
                        Email
                      </a>

                      <button
                        onClick={() => HandleDirecionar(s.profissionais.id)}
                        className="botao-ver-mais"
                      >
                        Ver Perfil
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>


      </div>
    </motion.div>
  );
};

export default UsuarioPage;
