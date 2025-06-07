import Backbutton from '../components/Backbutton'
import './AboutPage.css'
import { motion } from 'framer-motion';
const AboutPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div>
                <Backbutton rota={'/'} />
                <h1 className='about-title'>Como Funciona</h1>
                <div className="main">
                    <h2>Sobre o Sistema</h2>
                    <hr />
                    <p>O sistema é uma plataforma de gerenciamento de serviços Autônomos, onde profissionais podem se cadastrar e oferecer seus serviços, enquanto pacientes podem encontrar e agendar consultas com esses profissionais.</p>

                    <h2>Cliente:</h2>
                    <hr />
                    <ul>
                        <li>Use Nossa Busca Personalizada com Diversos Filtros</li>
                        <li>Selecione o Profissional de Acordo com Seus Requisitos</li>
                        <li>Solicite Um Serviço</li>
                        <li>Aguarde seu Profissional Aceitar Seu Pedido</li>

                    </ul>
                    <h2>Profissional:</h2>
                    <hr />
                    <ul>
                        <li> Se Cadastre Com Suas Informações</li>
                        <li>Use Os Recursos de Apoio Ao Profissional - Planners, Calendário - </li>
                        <li>Receba Pedidos de Serviço</li>
                        <li>Aplique Aos Serviços</li>
                        <li>Cheque Feedback dos Clientes</li>

                    </ul>
                    <h2>Funcionalidades</h2>
                    <hr />
                    <ul>
                        <li>Cadastro de profissionais Autônomos</li>
                        <li>Cadastro de Clientes, Necessitados de Suporte Geral</li>
                        <li>Agendamento de Serviços</li>
                        <li>Gerenciamento de Serviços</li>
                        <li>Feedback de Atendimentos</li>
                        <li>Acesso  à Planners Pessoais</li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}
export default AboutPage