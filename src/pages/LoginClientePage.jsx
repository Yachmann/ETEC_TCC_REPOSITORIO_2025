import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import Backbutton from '../components/Backbutton';
import './LoginClientePage.css';
import { motion } from 'framer-motion';

const LoginClientePage = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();
  const traduzErro = (mensagemOriginal) => {
    if (mensagemOriginal.includes('Invalid login credentials')) {
      return 'Email ou senha inválidos.';
    }
    if (mensagemOriginal.includes('Email not confirmed')) {
      return 'Email não confirmado. Verifique sua caixa de entrada.';
    }
    if (mensagemOriginal.includes('User not found')) {
      return 'Usuário não encontrado.';
    }

    return 'Erro ao logar usuário: ' + mensagemOriginal;
  };

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
    setLoading(true);
    e.preventDefault();
    const { email, senha } = formData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro(traduzErro(error.message));
      setTimeout(() => {
        setErro(null);
      }, 2000)
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
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="login-container">
        <Backbutton rota={'/'} />
        <h1>Login de Usuário</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className='campoTexto'>
            <label>
              <span>Email:</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className='campoTexto'>
            <label>
              <span>Senha:</span>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
              />
            </label>
          </div>
          <button disabled={loading} type="submit">{loading ? 'Carregando...' : 'Login'}</button>
          <p className='pformclient'>Não tem uma conta? <Link className='link' to={'/cadastrocliente'}>Cadastre-se</Link></p>
        </form>
        {message && <p className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>{message}</p>}
        {erro && <p className={`message error`}>{erro}</p>}
      </div>
    </motion.div>
  );
};

export default LoginClientePage;