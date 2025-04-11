import CampoTexto from '../CampoTexto'
import supabase from '../../../supabase'
import { useState } from 'react'
import './Form.css'
import Backbutton from '../BackButton'

const Form = () => {
    const [nome, setNome] = useState('')
    const [telefone, setTelefone] = useState('')
    const [profissao, setProfissao] = useState('')
    const [anosExperiencia, setAnosExperiencia] = useState('')
    const [localizacao, setLocalizacao] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [message, setMessage] = useState('')

    const HandleSubmit = async (e) => {
        e.preventDefault()
        
        const { error } = await supabase.from("profissionais").insert([
            { nome, email, telefone, profissao, anosExperiencia, localizacao, senha },
        ]);
        
        if (error) {
            setMessage('Erro ao cadastrar: ' + error.message);
        } else {
            setMessage('Cadastro realizado com sucesso!');
            setAnosExperiencia('')
            setEmail('')
            setNome('')
            setLocalizacao('')
            setProfissao('')
            setTelefone('')
            setSenha('')
        }
    };

    return (
        <div className="signup-container">
            <Backbutton rota={'/loginprofissional'}/>
            <form className="signup-form" onSubmit={HandleSubmit}>
                <h2>Cadastro de Profissional</h2>
                <CampoTexto 
                    valor={nome} 
                    aoAlterar={setNome} 
                    Label='Nome' 
                    placeHolder='Digite seu nome completo...' 
                    required 
                />
                <CampoTexto 
                    valor={email} 
                    aoAlterar={setEmail} 
                    Label='Email' 
                    placeHolder='Digite seu email...' 
                    type="email"
                    required 
                />
                <CampoTexto 
                    type={'password'} 
                    valor={senha} 
                    aoAlterar={setSenha}
                    Label='Senha' 
                    placeHolder='Digite sua senha...'
                    required 
                />
                <CampoTexto 
                    valor={telefone} 
                    aoAlterar={setTelefone}
                    Label='Telefone' 
                    placeHolder='Digite seu telefone...'
                    required 
                />
                <CampoTexto 
                    valor={profissao} 
                    aoAlterar={setProfissao}
                    Label='Profissão' 
                    placeHolder='Digite sua profissão...'
                    required 
                />
                <CampoTexto 
                    valor={anosExperiencia} 
                    aoAlterar={setAnosExperiencia}
                    Label='Anos de Experiência' 
                    placeHolder='Digite seus anos de experiência...'
                    type="number"
                    required 
                />
                <CampoTexto 
                    valor={localizacao} 
                    aoAlterar={setLocalizacao}
                    Label='Localização' 
                    placeHolder='Digite sua cidade/estado...'
                    required 
                />
                <button type='submit'>CADASTRAR</button>
                {message && (
                    <p className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    )
}

export default Form