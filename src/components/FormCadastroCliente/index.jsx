import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoTexto from "../CampoTexto";
import supabase from "../../../supabase";

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
      // Save additional user info in the database
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
    <>
      <form className="cadastro-cliente-form" onSubmit={handleSubmit}>
        <CampoTexto
          type={'text'}
          Label={'Nome'}
          PlaceHolder={'Digite aqui...'}
          aoAlterar={setNome}
          valor={nome}
        />
        <CampoTexto
          type={'email'}
          Label={'E-mail'}
          PlaceHolder={'Digite aqui...'}
          aoAlterar={setEmail}
          valor={email}
        />
        <CampoTexto
          type={'text'}
          Label={'Telefone'}
          PlaceHolder={'Digite aqui...'}
          aoAlterar={setTelefone}
          valor={telefone}
        />
        <CampoTexto
          type={'date'}
          Label={'Data de Nascimento: '}
          PlaceHolder={'Digite aqui...'}
          aoAlterar={setDataNascimento}
          valor={dataNascimento}
        />
        <CampoTexto
          type={'text'}
          Label={'Endereço'}
          PlaceHolder={'Digite aqui...'}
          aoAlterar={setEndereco}
          valor={endereco}
        />
        <CampoTexto
          type={'password'}
          Label={'Senha'}
          PlaceHolder={'Digite aqui...'}
          aoAlterar={setSenha}
          valor={senha}
        />
        <CampoTexto
          type={'password'}
          Label={'Confirme sua Senha'}
          PlaceHolder={'Digite aqui...'}
          aoAlterar={setSenhaConfirma}
          valor={senhaConfirma}
        />
        <button type="submit">Cadastrar</button>
        {message && <p>{message}</p>}
      </form>
    </>
  );
};

export default FormCadastroCliente;