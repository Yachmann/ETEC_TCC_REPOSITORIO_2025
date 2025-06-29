import axios from 'axios'
import './Home.css'
import { AlertCircle, Stethoscope, Clock, MapPin, Search, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
const Home = () => {
  const navigate = useNavigate()
  // useEffect(() => {
  // const profissional = localStorage.getItem('profissional')
  // if(profissional){
  //   const profissionalData = JSON.parse(profissional)
  //   navigate(`logged/${profissionalData.id}`)}})
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <>

        <div className="container">
          {/* Hero Section */}
          <header className="hero">
            <nav className="navbar">
              <div className="logo">

                <h1 className='h1Contrata'>Contrat<span>Aí</span></h1>
              </div>
              <div className="nav-links">
                <a id='headerb3' className='btn-secondary' href="about">Como Funciona</a>

                <Link id='headerb1' to="/loginprofissional" className="btn-secondary">Logar como Profissional</Link>
                <Link id='headerb2' to="/buscar" className="btn-primary">Achar Profissional</Link>
              </div>
            </nav>

            <div className="hero-content">
              <h1>Serviço de Emergencia na Palma da sua Mão</h1>
              <p>Conecte-se Com Profissionais para serviço Imediato</p>
              <div className="hero-buttons">
                <Link to="/logincliente" className="btn-primary">Achar Ajuda Agora</Link>
                <Link to="/loginprofissional" className="btn-secondary">Entrar Como Profissional</Link>
              </div>
            </div>
          </header>

          {/* Features Section */}
          <section className="features">
            <h2>Porque escolher ContratAÍ?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <Clock color="#457b9d" size={32} />
                <h3>24/7 DIsponibilidade</h3>
                <p>Acesso a serviços de emergência o dia inteiro</p>
              </div>
              {/* <div className="feature-card">
            <Stethoscope color="#457b9d" size={32} />
            <h3>Qualified Professionals</h3>
            <p>Verified experts in various emergency fields</p>
          </div> */}
              <div className="feature-card">
                <MapPin color="#457b9d" size={32} />
                <h3>Serviços Locais</h3>
                <p>Encontre ajuda em sua área rapidamente</p>
              </div>
              <div className="feature-card">
                <Search color="#457b9d" size={32} />
                <h3>Busca Intuitiva</h3>
                <p>Ache o profissional certo em minutos</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta">
            <div className="cta-content">
              <h2>Preparado(a) para entrar em nosso NetWork?</h2>
              <p>Se torne parte da nossa comunidade crecente de profissionais</p>
              <Link to="/cadastro" className="btn-primary">
                <UserPlus size={20} style={{ marginRight: '8px' }} />
                Resgistre-se agora
              </Link>
            </div>
          </section>
        </div>
      </>
    </motion.div>
  )
}
export default Home;