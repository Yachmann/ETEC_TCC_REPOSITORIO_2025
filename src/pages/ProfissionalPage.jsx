import ProfissionalProfile from "../components/ProfissionalProfile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import supabase from "../../supabase";
import { useEffect, useState } from "react";
import ServicoPedidoForm from "../components/ServicoPedidoForm";
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';

const ProfissionalPage = () => {
    const { id } = useParams();
    const [profissional, setProfissional] = useState(null);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState(false)
    const location = useLocation()
    const [favoritado, setFavoritado] = useState(false);

    const userIdRecebido = location.state?.userId;
    const vindoDeFavoritos = location.state?.vindoDeFavoritos;

    useEffect(() => {
        async function checkSession() {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                // Redireciona para a página de login se não houver sessão ativa
                navigate('/logincliente');
                ser
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
    useEffect(() => {
        async function verificarFavorito() {
            const { data, error } = await supabase
                .from("favoritos")
                .select("*")
                .eq("usuario_id", userIdRecebido)
                .eq("profissional_id", id)


            if (data && data.length > 0) { setFavoritado(true); console.log('favoritado: ', data) }
            else setFavoritado(false);
        }

        if (userIdRecebido && id) verificarFavorito();
    }, [userIdRecebido, id]);
    useEffect(() => {
        if (!userIdRecebido) {
            navigate('/buscar');
        }
    }, [userIdRecebido, navigate])

    async function adicionarFavorito(usuarioId, profissionalId) {
        const { error } = await supabase
            .from("favoritos")
            .insert([{ usuario_id: usuarioId, profissional_id: profissionalId }]);

        if (error) console.error("Erro ao adicionar favorito:", error);
    }



    async function removerFavorito(usuarioId, profissionalId) {
        const { error } = await supabase
            .from("favoritos")
            .delete()
            .eq("usuario_id", usuarioId)
            .eq("profissional_id", profissionalId);

        if (error) console.error("Erro ao remover favorito:", error);
    }
    const alternarFavorito = async () => {
        if (favoritado) {
            await removerFavorito(userIdRecebido, profissional.id);
            setFavoritado(false);
        } else {
            await adicionarFavorito(userIdRecebido, profissional.id);
            setFavoritado(true);
        }
    };



    if (!profissional && loading) {
        return <div><Spinner /> <h2>Carregando...</h2>;</div>
    }
    if (profissional && profissional.id !== Number(id)) {
        navigate('/');
    }

    if (errorMessage) {
        return <div style={{
            backgroundColor: " #ffe3e3",
            color: `#e63946`
        }} className="error">{errorMessage}</div>
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div>

                <ProfissionalProfile usuarioId={userIdRecebido} vindoDeFavoritos={vindoDeFavoritos} aoToggleFavorito={alternarFavorito} favoritado={favoritado} profissional={profissional} />
                <ServicoPedidoForm profissionalId={id} aoPedidoCriado={() => { }} />
            </div>
        </motion.div>
    );
}
export default ProfissionalPage;