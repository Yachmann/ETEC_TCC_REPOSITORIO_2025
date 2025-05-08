import ProfissionalProfile from "../components/ProfissionalProfile";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../supabase";
import { useEffect, useState } from "react";
import ServicoPedidoForm from "../components/ServicoPedidoForm";
import Spinner from '../components/Spinner'
const ProfissionalPage = () => {
    const { id } = useParams();
    const [profissional, setProfissional] = useState(null);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState(false)

      useEffect(() => {
    async function checkSession() {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        // Redireciona para a página de login se não houver sessão ativa
        navigate('/logincliente');
      } else {
        
      }
    }
    checkSession();
  }, [navigate]);

    useEffect(() => {

        async function fetchProfissional() {
            const { data, error } = await supabase
                .from("profissionais")
                .select("*")
                .eq("id", id)
                .single()

            if (error) {
                setErrorMessage('Erro Ao Carregar o Profissional. Estamos te Redirecionando...')
                setTimeout(() => {
                    navigate('/buscar')
                }, 2000)
            } else {
                setProfissional(data);
            }
        }
        fetchProfissional().finally(() => setLoading(false));
    }, [id]);
    useEffect(() => {
        console.log('profissional:', profissional);
    }, [profissional]);
    if (!profissional && loading) {
        return <div><Spinner /> <h2>Carregando...</h2>;</div>
    }
    if (profissional && profissional.id == !Number(id)) {
        navigate('/')
    }
    if (errorMessage) {
        return <div style={{
            backgroundColor: " #ffe3e3",
            color: `#e63946`
        }} className="error">{errorMessage}</div>
    }
    return (
        <div>

            <ProfissionalProfile profissional={profissional} />
            <ServicoPedidoForm profissionalId={id} aoPedidoCriado={() => { }} />
        </div>
    );
}
export default ProfissionalPage;