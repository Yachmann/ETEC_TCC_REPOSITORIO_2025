import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import Backbutton from '../components/Backbutton';
import './LoginClientePage.css';

const LoginClientePage = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Erro ao obter sessão do usuário:', sessionError);
      } else if (sessionData && sessionData.session) {
        navigate('/buscar');
      }
    };

    checkSession();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, senha } = formData;
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
  
    if (error) {
      setMessage('Erro ao logar usuário: ' + error.message);
    } else {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
  
      if (session) {
        setMessage('Usuário logado com sucesso!');
        navigate(`/usuario/${session.user.id}`);
      } else {
        setMessage('Erro ao obter sessão do usuário.');
      }
    }
  };

  return (
    <div className="login-cliente-container">
      <Backbutton rota={'/'} />
      <h1>Login de Usuário</h1>
      <form className="login-cliente-form" onSubmit={handleSubmit}>
        <label>
          <span>Email:</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          <span>Senha:</span>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Login</button>
        <p>Não tem uma conta? <Link to={'/cadastrocliente'}>Cadastre-se</Link></p>
      </form>
      {message && <p className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>{message}</p>}
    </div>
  );
};

export default LoginClientePage;