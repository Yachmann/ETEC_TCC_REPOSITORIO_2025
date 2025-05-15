import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoTexto from "../CampoTexto";
import supabase from "../../../supabase";
import './FormCadastroCliente.css';
import Backbutton from "../BackButton";
import { cpf } from 'cpf-cnpj-validator';

const FormCadastroCliente = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirma, setSenhaConfirma] = useState('');
  const [message, setMessage] = useState('');
  const [erro, Seterro] = useState(null)
  const [cpfForm, setCpfForm] = useState('')
  const navigate = useNavigate();

  const isEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isSenhaForte = (senha) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(senha); // Letras + números, mínimo 6 caracteres

  const isTelefoneValido = (telefone) => /^\d{10,}$/.test(telefone);

  const isMaiorDeIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade >= 18;
  };
  const formatarCPF = (cpf) => {
    return cpf
      .replace(/\D/g, '') // remove não dígitos
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !telefone || !dataNascimento || !endereco || !senha || !senhaConfirma) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (!isEmailValido(email)) {
      setMessage('E-mail inválido.');
      return;
    }

    if (!isSenhaForte(senha)) {
      setMessage('A senha deve ter no mínimo 6 caracteres, incluindo letras e números.');
      return;
    }

    if (!isTelefoneValido(telefone)) {
      setMessage('Telefone inválido. Digite apenas números com no mínimo 10 dígitos.');
      return;
    }

    if (!isMaiorDeIdade(dataNascimento)) {
      setMessage('Você deve ter pelo menos 18 anos para se cadastrar.');
      return;
    }

    if (senha !== senhaConfirma) {
      setMessage('As senhas não coincidem.');
      return;
    }
    if (!cpf.isValid(cpfForm)) {
      Seterro('CPF Inválido!');
      return;
    }
    // Cadastro no Supabase
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
        <div>
          <label>CPF: </label>
          <input
            type="text"
            placeholder="CPF"
            value={cpfForm}
            onChange={(e) => {
              const valor = e.target.value
              setCpfForm(formatarCPF(valor))
            }}
          />
        </div>
        <button type="submit">CADASTRAR</button>
        {message && (
          <p className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
        {erro && (
          <p className={'message error'}>
            {erro}
          </p>
        )}
      </form>
    </div>
  );
};

export default FormCadastroCliente;