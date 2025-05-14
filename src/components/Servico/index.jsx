import supabase from "../../../supabase";
import { useState, useEffect } from "react";
import './Servico.css'
const Servico = ({ servico, aoAlterarStatus, usuario }) => {

  const [statusAtual, setStatusAtual] = useState(servico.status);
    const [usuarioBuscado, setUsuario] = useState(null);
  const handleStatusChange = async (statusNovo) => {
    const { data, error } = await supabase
      .from("servicos")
      .update({ status: statusNovo })
      .eq("id", servico.id);

    if (error) {
      console.error("Error updating service status:", error);
    } else {
      aoAlterarStatus(servico.id, statusNovo);
      setStatusAtual(statusNovo); // Atualiza o status localmente para esconder os botões
    }
  };
  useEffect(() => {
    const fetchUsuario = async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", servico.usuario_id)


      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUsuario(data[0]);
        console.log('usuario do servico:',data[0])
      }
    };

    fetchUsuario();
  }, [servico.usuario_id]);



  const DefinirEstiloFundo = (status) => {
    switch (status) {
      case "Completo":
        return "linear-gradient(to right top, #b1ffd3, #91febc, #71fca2, #4df984, #13f662)";
      case "EmProgresso":
        return "linear-gradient(to right top, #ffda87, #fec76c, #feb353, #fe9e3c, #ff8629)";
      case "Pendente":
      default:
        return "linear-gradient(to right top, #ffb3b3, #ff9999, #ff8080, #ff6666, #ff4d4d)";
    }
  };

  return (
    <li key={servico.id}>
      <p className="paragrafo"> <div className="servico-item-titulo">Nome:</div> {usuarioBuscado?.nome.toUpperCase()}</p>
      <p className="paragrafo"> <div className="servico-item-titulo">User ID:</div> {servico.usuario_id}</p>
      <p className="paragrafo"> <div className="servico-item-titulo">Details:</div> {servico.detalhes}</p>
      <p className="paragrafo"> <div className="servico-item-titulo">Endereço:</div> {servico.endereco}</p>
      {usuario && (
        <div>
          <p className="contato-titulo"><strong>Contato do Usuário:</strong></p>
        <div className="contato-usuario">
          <a
            href={`mailto:${usuario.email}`}
            className="botao-contatar"
          >
            Enviar Email
          </a>
          <a
            href={`tel:${usuario.telefone}`}
            className="botao-contatar"
          >
            Ligar
          </a>
          <a
            href={`https://wa.me/55${usuario.telefone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="botao-contatar"
          >
            WhatsApp
          </a>
        </div>
        </div>
      )}


      <p style={{ background: DefinirEstiloFundo(statusAtual) }}>
        <div className="status">Status:  </div>{statusAtual}
      </p>
      {statusAtual !== "Completo" && (
        <> <div className="botoes-servico">
          {statusAtual !== "EmProgresso" && (

            <button className="botao-servico" onClick={() => handleStatusChange("EmProgresso")}>
              Começar Serviço
            </button >)}
          <button className="botao-servico" onClick={() => handleStatusChange("Completo")}>
            Completar Serviço
          </button>
        </div>
        </>
      )}
    </li>
  );
};

export default Servico;
