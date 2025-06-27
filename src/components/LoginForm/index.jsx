import CampoTexto from "../CampoTexto";
import { useState } from "react";
import './LoginForm.css';
import { Link } from "react-router-dom";

const LoginForm = ({onLogin,loading}) => {
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
            <button disabled={loading} type="submit">{loading? 'Carregando...' : 'ENTRAR'}</button>
            <p>Nao tem uma conta? <Link className="link" to={'/cadastro'}>Cadastre-se</Link></p>
        </form>
    );
}

export default LoginForm;