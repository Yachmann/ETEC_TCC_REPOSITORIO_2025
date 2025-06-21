import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '../components/CampoTexto'; // Certifique-se de importar corretamente

function AssinaturaCartao() {
  const [nome, setNome] = useState('');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const valor = 29.90;
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome || !numeroCartao || !validade || !cvv) {
      alert('Preencha todos os campos.');
      return;
    }

    setSucesso(true);

    setTimeout(() => {
      navigate('/obrigado'); // Altere conforme sua aplicação
    }, 3000);
  };

  return (
    <div>
     

      {!sucesso ? (
        <form className='cadastro-container' onSubmit={handleSubmit}>
             <h1>Assinar Plano</h1>
          <p><strong>Valor da assinatura:</strong> R${valor.toFixed(2)}</p>

          <CampoTexto
            type="text"
            Label="Nome no Cartão"
            PlaceHolder="Digite o nome como está no cartão"
            valor={nome}
            aoAlterar={setNome}
          />

          <CampoTexto
            type="text"
            Label="Número do Cartão"
            PlaceHolder="Digite o número do cartão"
            valor={numeroCartao}
            aoAlterar={setNumeroCartao}
          />

          <CampoTexto
            type="text"
            Label="Validade (MM/AA)"
            PlaceHolder="Ex: 06/26"
            valor={validade}
            aoAlterar={setValidade}
          />

          <CampoTexto
            type="text"
            Label="CVV"
            PlaceHolder="Ex: 123"
            valor={cvv}
            aoAlterar={setCvv}
          />

          <button type="submit">Assinar</button>
        </form>
      ) : (
        <div>
          <h2>Assinatura realizada com sucesso!</h2>
          <p>Redirecionando...</p>
        </div>
      )}
    </div>
  );
}

export default AssinaturaCartao;
