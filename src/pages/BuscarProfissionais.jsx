import { useState, useEffect } from "react";
import supabase from "../../supabase";
import MainBusca from "../components/MainBusca";
import './busca.css'
import { Link, useNavigate } from "react-router-dom";
import Backbutton from "../components/Backbutton";
import { GiHamburgerMenu } from "react-icons/gi";

function BuscarProfissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [busca, setBusca] = useState("");
  const [selectedSearch, setSelectedSearch] = useState(""); 
  const [profissionaisFiltrados,setProfissionaisFiltrados] = useState([])
  const navegar = useNavigate();
  const [userId,setUserId] = useState('')
  console.log(profissionais)
  const searchOptions = ["Nome", "Localização", "Profissão", "Anos de Experiência"];

  useEffect(() => {
    async function checkSession() {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        // Redireciona para a página de login se não houver sessão ativa
        navegar('/logincliente');
      } else {
        setUserId(sessionData.session.user.id);
      }
    }
    checkSession();
  }, [navegar]);
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("profissionais").select("*");
      if (error) {
        alert("Erro ao carregar profissionais: " + error.message);
      } else {
        setProfissionais(data);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (busca && selectedSearch) {
        if (selectedSearch === 'anosExperiencia') {
            const filtered = profissionais.filter(profissional => {
                const searchValue = Number(busca); // Transforma o input em número
                const profissionalValue = Number(profissional[selectedSearch]) || 0; // Garante que é um número
                return profissionalValue <= searchValue; // Faz a comparação corretamente
            });
            setProfissionaisFiltrados(filtered);
        } else {
            const filtered = profissionais.filter(profissional => {
                const searchValue = busca.toLowerCase();
                const profissionalValue = profissional[selectedSearch.toLowerCase()] || ''; 
                return profissionalValue.toString().toLowerCase().includes(searchValue);
            });
            setProfissionaisFiltrados(filtered);
        }
    } else {
        setProfissionaisFiltrados([]); // Limpa os resultados se a busca ou o filtro não estiverem definidos
    }
}, [busca, selectedSearch, profissionais]);

  useEffect(() => {
    console.log('profissionais filtrados: ', profissionaisFiltrados);
  }, [profissionaisFiltrados])
  const HandleBusca = (e) => {
    setBusca(e.target.value); // Atualiza o valor de busca
    
};

 
const HandleProfissionalPage = (e) => {
  console.log('profissional selecionado: ',e.target.id);
  navegar(`/profissional/${e.target.id}`);
};  
  

  return (
    <>
    <Backbutton rota={'/'}/>
    <Link to={`/usuario/${userId}`}><GiHamburgerMenu/></Link>
      <div className="container">
        <div className="header">
        <h1>Buscar Profissionais</h1>
        <div className="busca">
          <h3 style={{color: 'white'}}>Filtrar por:</h3>
        <select value={selectedSearch} onChange={(e)=>setSelectedSearch(e.target.value)}>
            <option value='' disabled>Escolha um filtro...</option>
            {/* {searchOptions.map(item => (<option key={item} value={item}>{item}</option>))} */}
            <option key='Nome' value={'Nome'}>Nome</option>
            <option key='localizacao' value={'localizacao'}>Localização</option>
            <option key='profissao' value={'profissao'}>Profissão</option>
            
           
        </select>
          

          <input
            className="border p-2 rounded ml-2 w-64"
            value={busca}
            onChange={HandleBusca}
            placeholder="Digite sua busca..."
          />
          </div>
        </div>
        <div>
        {/* <div className="profissionais">
          {profissionais.map((profissional) => (
            <CardProfissional
              key={profissional.id}
              id={profissional.id}
              nome={profissional.nome}
              profissao={profissional.profissao}
              email={profissional.email}
              telefone={profissional.telefone}
              anosExperiencia={profissional.anosExperiencia}
              localizacao={profissional.localizacao}
              valorBotao={"Contratar"}
            />
          ))}
        </div> */}
        <MainBusca HandleProfissionalPage={HandleProfissionalPage} profissionais = {profissionais} profissionaisFiltrados = {profissionaisFiltrados}></MainBusca>
        </div>
      </div>
    </>
  );
}

export default BuscarProfissionais;
