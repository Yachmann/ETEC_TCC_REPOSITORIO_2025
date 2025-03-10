import ProfissionalProfile from "../components/ProfissionalProfile";
import { useParams } from "react-router-dom";
import supabase from "../../supabase";
import { useEffect,useState } from "react";
import ServicoPedidoForm from "../components/ServicoPedidoForm";
const ProfissionalPage = () => {
    const { id } = useParams();
    const [profissional, setProfissional] = useState(null);
    useEffect(()=>{
        async function fetchProfissional() {
            const {data,error} = await supabase
            .from("profissionais")
            .select("*")
            .eq("id",id)
            .single()
        if (error) {
            alert("Erro ao carregar profissional: " + error.message);
        }else{
            setProfissional(data);
        }
    }
    fetchProfissional();
    },[id]);
    useEffect(()=>{
        console.log('profissional:',profissional);
    },[profissional]);
        if (!profissional) {
            return <h1>Carregando...</h1>;
        }
    return (
        <div>
        
            <ProfissionalProfile profissional={profissional} />
            <ServicoPedidoForm profissionalId={id} aoPedidoCriado={()=>{}}/>
        </div>
    );
    }
export default ProfissionalPage;