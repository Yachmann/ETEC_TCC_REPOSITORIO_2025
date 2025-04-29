import Backbutton from '../components/Backbutton'
import './AboutPage.css'
const AboutPage = ()=>{
    return(
        <div>
            <Backbutton rota={'/'}/>
            <h1>Como Funciona</h1>
            <div className="main">
                <h2>Sobre o Sistema</h2>
                <p>O sistema é uma plataforma de gerenciamento de serviços Autônomos, onde profissionais podem se cadastrar e oferecer seus serviços, enquanto pacientes podem encontrar e agendar consultas com esses profissionais.</p>
                <h2>Funcionalidades</h2>
                <ul>
                    <li>Cadastro de profissionais de saúde</li>
                    <li>Cadastro de pacientes</li>
                    <li>Agendamento de consultas</li>
                    <li>Gerenciamento de prontuários</li>
                    <li>Relatórios de atendimentos</li>
                </ul>
            </div>
        </div>
    )
}
export default AboutPage