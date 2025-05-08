import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../../supabase'
import CampoTexto from '../CampoTexto'
import Spinner from '../Spinner'
import Backbutton from '../BackButton'
import './Form.css'

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
  const isSenhaForte = s => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(s)
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

    const payload = { nome, email, telefone, profissao, anosExperiencia, localizacao, senha }
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

  return (
    <div className="signup-container">
      {loading && <Spinner />}
      <Backbutton rota="/loginprofissional" />
      <form className="signup-form" onSubmit={HandleSubmit}>
        <h2>Cadastro de Profissional</h2>
        {erro && <p className="message error">{erro}</p>}
        {message && <p className="message success">{message}</p>}

        <CampoTexto valor={nome} aoAlterar={setNome} Label="Nome" />
        <CampoTexto valor={email} aoAlterar={setEmail} Label="Email" type="email" />
        <CampoTexto valor={senha} aoAlterar={setSenha} Label="Senha" type="password" />
        <CampoTexto valor={senhaConfirma} aoAlterar={setSenhaConfirma} Label="Confirmar Senha" type="password" />
        <CampoTexto valor={telefone} aoAlterar={setTelefone} Label="Telefone" />
        <CampoTexto valor={profissao} aoAlterar={setProfissao} Label="Profissão" />
        <CampoTexto valor={anosExperiencia} aoAlterar={setAnosExperiencia} Label="Anos de Experiência" type="number" />

        <div className="modo-localizacao">
          <label><input type="radio" value="auto" checked={modoLocalizacao==='auto'} onChange={()=>setModoLocalizacao('auto')} /> Detectar automaticamente</label>
          <label><input type="radio" value="manual" checked={modoLocalizacao==='manual'} onChange={()=>setModoLocalizacao('manual')} /> Escolher cidade</label>
        </div>

        {modoLocalizacao === 'auto' ? (
          <CampoTexto valor={localizacao} Label="Localização (detectada)" readOnly />
        ) : (
          <div className="campo-manual">
            <label>Município (SP):</label>
            <select value={localizacao} onChange={e=>setLocalizacao(e.target.value)}>
              <option value="">Selecione sua cidade...</option>
              {cidadesSP.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        <button type="submit" disabled={loading}>{loading?'Enviando...':'CADASTRAR'}</button>
      </form>
    </div>
  )
}

