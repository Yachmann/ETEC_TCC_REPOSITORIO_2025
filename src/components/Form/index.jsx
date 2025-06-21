import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../../supabase'
import CampoTexto from '../CampoTexto'
import Spinner from '../Spinner'
import Backbutton from '../Backbutton/index.jsx'
import './Form.css'
import { cpf } from 'cpf-cnpj-validator';
import InputMask from 'react-input-mask';

export default function Form() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [profissao, setProfissao] = useState('')
  const [anosExperiencia, setAnosExperiencia] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirma, setSenhaConfirma] = useState('')
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [cidadesSP, setCidadesSP] = useState([])
  const [modoLocalizacao, setModoLocalizacao] = useState('auto')
  const [message, setMessage] = useState('')
  const [erro, setErro] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cpfForm, setCpfForm] = useState('')
  const [outraProfissao, setOutraProfissao] = useState(null)
  const profissoes = [
    "Advogado(a)",
    "Agente Autônomo de Investimentos",
    "Analista de Marketing Digital",
    "Arquiteto(a)",
    "Artesão(ã)",
    "Babá",
    "Barbeiro(a)",
    "Cabeleireiro(a)",
    "Chef de Cozinha",
    "Cientista de Dados",
    "Coach de Carreira",
    "Consultor(a)",
    "Contador(a)",
    "Confeiteiro(a)",
    "Corretor(a) de Imóveis",
    "Corretor(a) de Seguros",
    "Costureiro(a)",
    "Criador(a) de Conteúdo",
    "Cuidador(a) de Pets",
    "Designer Gráfico",
    "Designer UX/UI",
    "Designer de Interiores",
    "Desenvolvedor(a) de Software",
    "Diarista",
    "DJ",
    "Editor(a) de Vídeo",
    "Eletricista",
    "Empreendedor(a) de Clube de Assinatura",
    "Enfermeiro(a)",
    "Especialista em Cibersegurança",
    "Esteticista",
    "Fisioterapeuta",
    "Fotógrafo(a)",
    "Franqueado(a)",
    "Guia Turístico",
    "Influenciador(a) Digital",
    "Instrutor(a) de Trânsito",
    "Jornalista",
    "Leiloeiro(a)",
    "Maquiador(a)",
    "Manicure/Pedicure",
    "Marceneiro(a)",
    "Massagista",
    "Montador(a) de Móveis",
    "Motorista de Aplicativo",
    "Músico(a)",
    "Nômade Digital",
    "Nutricionista",

    "Padeiro(a)",
    "Pedreiro(a)",
    "Personal Trainer",
    "Pintor(a)",
    "Professor(a) Particular",
    "Programador(a)",
    "Programador(a) de Aplicativos Móveis",
    "Proprietário(a) de Coworking",
    "Proprietário(a) de E-commerce",
    "Publicitário(a)",
    "Redator(a) de Conteúdo",
    "Representante Comercial",
    "Social Media / Marketing Digital",
    "Sommelier",
    "Tatuador(a)",
    "Terapeuta Ocupacional",
    "Tradutor(a)/Intérprete",
    "Turismólogo(a)",
    "Vendedor(a) Online",
    "Veterinário(a)",
    "Videomaker",
    "Youtuber",
    "Outro(a)"
  ]




  const navigate = useNavigate()

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLatitude(coords.latitude)
          setLongitude(coords.longitude)
        },
        () => setErro('Não foi possível obter localização.'),
        { timeout: 5000 }
      )
    }
  }, [])

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/SP/municipios')
      .then(res => res.json())
      .then(json => setCidadesSP(json.map(c => c.nome)))
      .catch(() => setErro('Erro ao carregar cidades.'))
  }, [])

  useEffect(() => {
    if (modoLocalizacao === 'auto' && latitude && longitude) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(res => res.json())
        .then(data => {
          const addr = data.address || {}
          setLocalizacao(addr.city || addr.town || addr.village || '')
        })
        .catch(() => setErro('Erro no geocoding.'))
    }
  }, [modoLocalizacao, latitude, longitude])

  const isEmailValido = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const isSenhaForte = s => /^.{8,}$/.test(s);

  const isTelefoneValido = t => /^\d{10,}$/.test(t)
  const isNumeroPositivo = v => Number(v) > 0

  const HandleSubmit = async e => {
    e.preventDefault()
    setErro(null)
    if (!nome || !telefone || !profissao || !anosExperiencia || !localizacao || !email || !senha) {
      setErro('Preencha todos os campos.'); return
    }
    if (!isEmailValido(email)) { setErro('E-mail inválido.'); return }
    if (!isSenhaForte(senha)) { setErro('Senha fraca.'); return }
    if (senha !== senhaConfirma) { setErro('Senhas não coincidem.'); return }
    if (!isTelefoneValido(telefone)) { setErro('Telefone inválido.'); return }
    if (!isNumeroPositivo(anosExperiencia)) { setErro('Anos de experiência deve ser positivo.'); return }
    if (!cpf.isValid(cpfForm)) {
      setErro('CPF Inválido!');
      return;
    }
    const profissaoFinal = profissao === 'Outra' ? outraProfissao : profissao
    const payload = { nome, email, telefone, profissao: profissaoFinal, anosExperiencia, localizacao, senha }
    if (modoLocalizacao === 'auto') Object.assign(payload, { latitude, longitude })

    setLoading(true)
    const { error } = await supabase.from('profissionais').insert([payload])
    setLoading(false)

    if (error) {
      setErro('Erro ao cadastrar: ' + error.message)
    } else {
      setMessage('Cadastro realizado com sucesso!')
      setTimeout(() => navigate('/loginprofissional'), 1500)
    }
  }
  const formatarCPF = (cpf) => {
    return cpf
      .replace(/\D/g, '') // remove não dígitos
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }


  return (
    <div className="signup-container">
      {loading && <Spinner />}
      <Backbutton rota="/loginprofissional" />
      <form className="signup-form" onSubmit={HandleSubmit}>
        <h2>Cadastro de Profissional</h2>
        {erro && <p className="message error">{erro}</p>}
        {message && <p className="message success">{message}</p>}

        <CampoTexto valor={nome} aoAlterar={setNome} Label="Nome Completo" />
        <CampoTexto valor={email} aoAlterar={setEmail} Label="E-mail" type="email" />
        <CampoTexto valor={senha} aoAlterar={setSenha} Label="Senha" type="password" />
        <CampoTexto valor={senhaConfirma} aoAlterar={setSenhaConfirma} Label="Confirmar Senha" type="password" />
        <CampoTexto valor={telefone} aoAlterar={setTelefone} Label="Telefone" />
        <label>Profissão:</label>
        <select value={profissao} onChange={(e) => setProfissao(e.target.value)}>
          <option value="">Selecione sua profissão...</option>
          {profissoes.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {profissao === "Outro(a)" && (
          <input
            type="text"
            placeholder="Digite sua profissão"
            value={outraProfissao}
            onChange={(e) => setOutraProfissao(e.target.value)}
          />
        )}
        <CampoTexto valor={anosExperiencia} aoAlterar={setAnosExperiencia} Label="Anos de Experiência" type="number" />
        <div className='campoTexto'>
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

        <div className="modo-localizacao">
          <label><input type="radio" value="auto" checked={modoLocalizacao === 'auto'} onChange={() => setModoLocalizacao('auto')} /> Detectar automaticamente</label>
          <label><input type="radio" value="manual" checked={modoLocalizacao === 'manual'} onChange={() => setModoLocalizacao('manual')} /> Escolher cidade</label>
        </div>

        {modoLocalizacao === 'auto' ? (
          <CampoTexto valor={localizacao} Label="Localização (detectada)" readOnly />
        ) : (
          <div className="campo-manual">
            <label>Município (SP):</label>
            <select value={localizacao} onChange={e => setLocalizacao(e.target.value)}>
              <option value="">Selecione sua cidade...</option>
              {cidadesSP.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'CADASTRAR'}</button>
      </form>

    </div>
  )
}

