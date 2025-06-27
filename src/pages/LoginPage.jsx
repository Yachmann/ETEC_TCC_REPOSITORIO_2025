import LoginForm from "../components/LoginForm";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import './LoginPage.css';
import { IoIosArrowBack } from "react-icons/io";
import Backbutton from "../components/Backbutton";
import { motion } from 'framer-motion';
import { set } from "date-fns";
const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const profissional = localStorage.getItem('profissional')
        if (profissional) {
            const profissionalData = JSON.parse(profissional)
            navigate(`/logged/${profissionalData.id}`)
        }
    })

    const HandleLogin = async (email, senha) => {
        setLoading(true);
        console.log(email, senha);
        const { data, error } = await supabase
            .from('profissionais')
            .select('*')
            .eq('email', email)
            .eq('senha', senha)
            .single();

        if (error) {
            setError('Email ou senha inválidos.');
            setTimeout(() => {
                setError(null);
            },2000)
        } else {
            localStorage.setItem('profissional', JSON.stringify(data));
            console.log('navegar para /logged/' + data.id);
            navigate('/logged/' + data.id);
        }
        setLoading(false);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="login-container">
                <Backbutton rota={'/'} />
                <h1>Login de Profissional</h1>
                {error && <p className="error-message">{error}</p>}
                <LoginForm loading={loading} onLogin={HandleLogin} />
            </div>
        </motion.div>
    );
}

export default LoginPage;