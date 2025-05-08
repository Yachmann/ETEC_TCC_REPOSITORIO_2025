import { Link } from 'react-router-dom';
import './ProfissionalProfile.css';
import { useState } from "react";
import { FaRegStar } from "react-icons/fa";
import Backbutton from '../Backbutton';
import useEvaluations from '../../hooks/useEvaluations';
import { useEffect } from 'react';
import StarRating from '../RatingStars';

const ProfissionalProfile = ({ profissional }) => {
  const [contactOptions, setContactOptions] = useState(false);
  const { evaluations, avaliacaoMedia, fetchEvaluations } = useEvaluations(profissional.id);

  const toggleContactOptions = () => {
    setContactOptions(!contactOptions);
  };
  useEffect(() => {
    if (profissional.id) {
      fetchEvaluations();
    }
  }, [profissional.id]);


  return (
    <div className="profissionalProfile">
      <Backbutton rota={'/buscar'}/>
      <div className="info">
        <h1>{profissional.nome}</h1>
        <h3>{profissional.profissao.toUpperCase()}</h3>
        <h2>CONTATO</h2>
        <div className='contact-info'>
          <p>{profissional.email}</p>
          <p>{profissional.telefone}</p>
        </div>
        <p className='experiencia'>{profissional.anosExperiencia.toUpperCase()} ANOS DE EXPERIENCIA</p>
        <p className='localizacao'>{profissional.localizacao.toUpperCase()}</p>
      </div>
      <div className="sobre">
        <h2>Sobre</h2>
        <p>{profissional.sobre}</p>
      </div>

      <div className="servicos">
        <h2>Serviços</h2>
        <div className="avaliacao">
          <h2>Avaliação</h2>
          <StarRating avaliacao={avaliacaoMedia}></StarRating>
          <p>{avaliacaoMedia.toFixed(1)}</p>
        </div>
      </div>
      <div className="contact-buttons">
        <button onClick={toggleContactOptions}>{contactOptions ? "Fechar" : "Contatar"}</button>
        {contactOptions ? (
          <div className="contact-options">
            <button
              onClick={() => window.location.href = `mailto:${profissional.email}?subject=Interesse em seus serviços&body=Olá ${profissional.nome},%0D%0A%0D%0AEstou interessado em seus serviços. Por favor, entre em contato comigo.%0D%0A%0D%0AObrigado.`}
            >
              Mandar Email
            </button>
            <button
              onClick={() => window.location.href = `tel:${profissional.telefone}`}
            >
              Ligar para Profissional
            </button>
            <button
              onClick={() => window.location.href = `https://wa.me/${profissional.telefone}?text=Olá ${profissional.nome},%20estou%20interessado%20em%20seus%20serviços.`}
            >
              Enviar WhatsApp
            </button>
          </div>
        ) : null}
        {/* passando o objeto profissional para a pagina AvaliacaoPage por meio de State */}
        <Link to={`/avaliar/${profissional.id}`} state= {{ profissional}}>
          <button className='botaoavaliar'><p className='botao__texto'>Avaliar</p><FaRegStar className='star-icon'/></button>
        </Link>
      </div>
    </div>
  );
};

export default ProfissionalProfile;