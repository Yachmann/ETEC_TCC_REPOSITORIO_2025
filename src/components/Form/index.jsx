import CampoTexto from '../CampoTexto'
import supabase from '../../../supabase'
import { useEffect, useState } from 'react'
import './Form.css'
import Backbutton from '../BackButton'
import { useNavigate } from 'react-router-dom'


const Form = () => {
    const [nome, setNome] = useState('')
    const [telefone, setTelefone] = useState('')
    const [profissao, setProfissao] = useState('')
    const [anosExperiencia, setAnosExperiencia] = useState('')
    const [localizacao, setLocalizacao] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [senhaConfirma, setSenhaConfirma] = useState('');
    const [message, setMessage] = useState('')
    const [erro, setErro] = useState(null)
    const [profissional, setProfissional] = useState('')
    const navigate = useNavigate()

    // validacoes.js
    const isEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isSenhaForte = (senha) =>
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(senha); // mínimo 6 caracteres, letras e números

    const isTelefoneValido = (telefone) => /^\d{10,}$/.test(telefone);

    const isNumeroPositivo = (valor) => Number(valor) > 0;

    const fetchProfissional = async () => {
        const { data, error } = await supabase
            .from('profissionais')
            .select('*')
            .eq('email', email)
            .eq('senha', senha);

        if (error) {
            setErro('Erro Interno');
        } else {
            if (data && data.length > 0) {
                setProfissional(data[0]);
                console.log('Usuário encontrado', data[0]);
            } else {
                setErro('Profissional não encontrado');
            }
        }
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();

        // Verificações básicas
        if (!nome || !telefone || !profissao || !anosExperiencia || !localizacao || !email || !senha) {
            setErro('Por favor, preencha todos os campos.');
            setTimeout(() => {
                setErro(null)
            }, 5000)
            return;
        }

        if (!isEmailValido(email)) {
            setErro('E-mail inválido.');
            setTimeout(() => {
                setErro(null)
            }, 5000)
            return;
        }

        if (!isSenhaForte(senha)) {
            setErro('A senha deve ter no mínimo 6 caracteres, incluindo letras e números.');
            setTimeout(() => {
                setErro(null)
            }, 5000)
            return;
        }
        if (senha !== senhaConfirma) {
            setErro('As senhas não coincidem.');
            setTimeout(() => {
                setErro(null)
            }, 5000)
            return;
        }

        if (!isTelefoneValido(telefone)) {
            setErro('Telefone inválido. Digite apenas números com no mínimo 10 dígitos.');
            setTimeout(() => {
                setErro(null)
            }, 5000)
            return;
        }

        if (!isNumeroPositivo(anosExperiencia)) {
            setErro('Anos de experiência deve ser um número positivo.');
            setTimeout(() => {
                setErro(null)
            }, 5000)
            return;
        }

        const { error } = await supabase.from("profissionais").insert([
            { nome, email, telefone, profissao, anosExperiencia, localizacao, senha },
        ]);

        if (error) {
            setErro('Erro ao cadastrar: ' + error.message);
        } else {
            setMessage('Cadastro realizado com sucesso! Estamos te Redirecionando ...');
            setAnosExperiencia('')
            setEmail('')
            setNome('')
            setLocalizacao('')
            setProfissao('')
            setTelefone('')
            setSenha('')
            await fetchProfissional();
            if (profissional && profissional.id) {
                setTimeout(() => {
                    navigate(`/loginprofissional`);
                }, 2000);
            } else {
                setErro('Erro: Não foi possível encontrar o profissional.');
                setTimeout(() => {
                    setErro(null);
                }, 5000);
            }

        }
    };

    return (
        <div className="signup-container">
            <Backbutton rota={'/loginprofissional'} />
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
                    type='password'
                    valor={senhaConfirma}
                    aoAlterar={setSenhaConfirma}
                    Label='Confirme sua Senha'
                    placeHolder='Digite sua senha novamente...'
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
                {erro && (
                    <p className='erro'>
                        {erro}
                    </p>
                )}
            </form>
        </div>
    )
}

export default Form
