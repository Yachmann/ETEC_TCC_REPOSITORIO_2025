import { useState, useEffect } from "react";
import supabase from "../../supabase";
import { useNavigate } from "react-router-dom";
import Backbutton from '../components/Backbutton';
import './UsuarioPage.css';

const UsuarioPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [estaEditando, setEstaEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (session) {
        const { data, error } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        } else {
          setUsuario(data);
          setFormData({
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            dataNascimento: data.dataNascimento,
            endereco: data.endereco,
          });
        }
      } else {
        navigate("/login");
      }
    };

    const fetchUserServices = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (session) {
        const { data, error } = await supabase
          .from("servicos")
          .select("*")
          .eq("usuario_id", session.user.id);

        if (error) {
          console.error("Erro ao buscar serviços do usuário", error);
        } else {
          setServicos(data);
        }
      }
    };

    fetchUserData();
    fetchUserServices();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    if (session) {
      const { error } = await supabase
        .from("usuarios")
        .update(formData)
        .eq("id", session.user.id);

      if (error) {
        console.error("Erro ao atualizar dados do usuário:", error);
      } else {
        setUsuario({ ...usuario, ...formData });
        setEstaEditando(false);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/logincliente");
  };

  return (
    <div className="usuario-container">
      <div className="usuario-header">
        <Backbutton rota={'/buscar'} />  
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
      {usuario && (
        <>
          <h1>{`Olá ${formData.nome.toUpperCase()}`}</h1>
          <div className="perfil-secao">
            <h2>Dados Pessoais</h2>
            {estaEditando ? (
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
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Data de Nascimento:
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Endereço:
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                  />
                </label>

                <button onClick={handleSave}>Salvar</button>
                <button onClick={() => setEstaEditando(false)}>Cancelar</button>
              </div>
            ) : (
              <div className="detalhes">
                <p><strong>Nome:</strong> {usuario.nome}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Telefone:</strong> {usuario.telefone}</p>
                <p><strong>Data de Nascimento:</strong> {usuario.dataNascimento}</p>
                <p><strong>Endereço:</strong> {usuario.endereco}</p>
                <button onClick={() => setEstaEditando(true)}>Editar</button>
              </div>
            )}
          </div>

          <div className="servicos-secao">
            <h2>Serviços</h2>
            <ul>
              {servicos.map((servico) => (
                <li key={servico.id}>
                  <p >Detalhes: {servico.detalhes}</p>
                  <p className={servico.status.toLowerCase()}>Status: {servico.status}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default UsuarioPage;