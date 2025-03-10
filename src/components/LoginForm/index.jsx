import CampoTexto from "../CampoTexto";
import { useState } from "react";
import './LoginForm.css';

const LoginForm = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const HandleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, senha);
        setEmail('');
        setSenha('');
    }

    return (
        <form className="login-form" onSubmit={HandleSubmit}>
            <CampoTexto 
                Label="Email" 
                placeHolder="Digite aqui..." 
                aoAlterar={setEmail}
                valor={email}
                required
            />
            <CampoTexto
                Label="Senha" 
                placeHolder="Digite aqui..." 
                aoAlterar={setSenha}
                valor={senha}
                required
                type="password"
            />
            <button type="submit">ENTRAR</button>
        </form>
    );
}

export default LoginForm;