import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoTexto from "../CampoTexto";
import supabase from "../../../supabase";
import './FormCadastroCliente.css';
import Backbutton from "../BackButton";

const FormCadastroCliente = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirma, setSenhaConfirma] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== senhaConfirma) {
      setMessage('As senhas não coincidem.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      setMessage('Erro ao registrar usuário: ' + error.message);
    } else if (data && data.user) {
      const { error: userError } = await supabase
        .from('usuarios')
        .insert([{ id: data.user.id, nome, telefone, dataNascimento, endereco, email }]);

      if (userError) {
        setMessage('Erro ao salvar informações do usuário: ' + userError.message);
      } else {
        setMessage('Usuário registrado com sucesso!');
        navigate('/logincliente');
      }
    } else {
      setMessage('Erro desconhecido ao registrar usuário.');
    }
  };

  return (
    <div className="cadastro-container">
      <Backbutton rota={'/logincliente'} />
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <h2>Cadastro de Cliente</h2>
        <CampoTexto
          type="text"
          Label="Nome Completo"
          PlaceHolder="Digite seu nome..."
          aoAlterar={setNome}
          valor={nome}
          required
        />
        <CampoTexto
          type="email"
          Label="E-mail"
          PlaceHolder="Digite seu email..."
          aoAlterar={setEmail}
          valor={email}
          required
        />
        <CampoTexto
          type="tel"
          Label="Telefone"
          PlaceHolder="Digite seu telefone..."
          aoAlterar={setTelefone}
          valor={telefone}
          required
        />
        <CampoTexto
          type="date"
          Label="Data de Nascimento"
          PlaceHolder="Selecione sua data de nascimento..."
          aoAlterar={setDataNascimento}
          valor={dataNascimento}
          required
        />
        <CampoTexto
          type="text"
          Label="Endereço"
          PlaceHolder="Digite seu endereço completo..."
          aoAlterar={setEndereco}
          valor={endereco}
          required
        />
        <CampoTexto
          type="password"
          Label="Senha"
          PlaceHolder="Digite sua senha..."
          aoAlterar={setSenha}
          valor={senha}
          required
        />
        <CampoTexto
          type="password"
          Label="Confirme sua Senha"
          PlaceHolder="Digite sua senha novamente..."
          aoAlterar={setSenhaConfirma}
          valor={senhaConfirma}
          required
        />
        <button type="submit">CADASTRAR</button>
        {message && (
          <p className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default FormCadastroCliente;