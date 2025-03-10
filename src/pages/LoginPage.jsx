import LoginForm from "../components/LoginForm";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import './LoginPage.css';
import { IoIosArrowBack } from "react-icons/io";
import Backbutton from "../components/Backbutton";

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
      useEffect(() => {
      const profissional = localStorage.getItem('profissional')
      if(profissional){
        const profissionalData = JSON.parse(profissional)
        navigate(`/logged/${profissionalData.id}`)}})

    const HandleLogin = async (email, senha) => {
        console.log(email, senha);
        const { data, error } = await supabase
          .from('profissionais')
          .select('*')
          .eq('email', email)
          .eq('senha', senha)
          .single();
    
        if (error) {
            setError('Invalid email or password');
        } else {
            localStorage.setItem('profissional', JSON.stringify(data));
            console.log('navegar para /logged/'+data.id);
            navigate('/logged/'+data.id);
        }
    }

    return (
        <div className="login-container">
            <Backbutton rota={'/'}/>
            <h1>Login</h1>
            {error && <p className="error-message">{error}</p>}
            <LoginForm onLogin={HandleLogin}/>
        </div>
    );
}

export default LoginPage;