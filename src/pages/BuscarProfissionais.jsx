import { useState, useEffect } from "react";
import supabase from "../../supabase";
import MainBusca from "../components/MainBusca";
import './busca.css'
import { Link, useNavigate } from "react-router-dom";
import Backbutton from "../components/Backbutton";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser } from "react-icons/fa";

import { motion } from 'framer-motion';
function BuscarProfissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [busca, setBusca] = useState("");
  const [selectedSearch, setSelectedSearch] = useState("");
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([])
  const navegar = useNavigate();
  const [userId, setUserId] = useState('')
  console.log(profissionais)
  const searchOptions = ["Nome", "Localização", "Profissão", "Anos de Experiência"];
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [filtrarPorProximidade, setFiltrarPorProximidade] = useState(false);
  const [loading, setLoading] = useState(true)


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
    fetchData().finally(() => setLoading(false))
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLatitude(position.coords.latitude);
        setUserLongitude(position.coords.longitude);
      });
    }
  }, []);
  useEffect(() => {
    if (filtrarPorProximidade && userLatitude && userLongitude) {
      const proximos = profissionais.filter(p => {
        if (p.latitude && p.longitude) {
          const distancia = calcularDistancia(userLatitude, userLongitude, p.latitude, p.longitude);
          return distancia <= 10; // até 10 km de distância
        }
        return false;
      });
      setProfissionaisFiltrados(proximos);
    }
  }, [filtrarPorProximidade, userLatitude, userLongitude, profissionais]);

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

  useEffect(() => {
    if (!filtrarPorProximidade && !busca) {
      // Se a busca estiver vazia e o filtro de proximidade foi desmarcado
      setProfissionaisFiltrados([]);
    }
  }, [filtrarPorProximidade, busca]);

  const HandleProfissionalPage = (e) => {
    console.log('profissional selecionado: ', e.target.id);
    navegar(`/profissional/${e.target.id}`, { state: { userId: userId } });
  };
  const HandleFiltrarPorProximidade = (e) => {
    setBusca('');
    setFiltrarPorProximidade(e.target.checked)
  }

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distância em km
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <>

        <div className="container">
          <Backbutton style="" rota={'/'} />
          <Link className="user-icon" to={`/usuario/${userId}`}><FaUser /></Link>
          <div className="header">

            <h1>Buscar Profissionais</h1>
            <div className="busca">
              <h3>Filtrar por:</h3>
              <select value={selectedSearch} onChange={(e) => setSelectedSearch(e.target.value)}>
                <option value='' disabled>Escolha um filtro...</option>
                {/* {searchOptions.map(item => (<option key={item} value={item}>{item}</option>))} */}
                <option key='Nome' value={'Nome'}>Nome</option>
                <option key='localizacao' value={'localizacao'}>Localização</option>
                <option key='profissao' value={'profissao'}>Profissão</option>


              </select>




              <input
                className="buscaInput"
                value={busca}
                onChange={HandleBusca}
                placeholder="Digite sua busca..."
              />
            </div>
          </div>
          <div>
            <div className="filtrarProximidadeContainer">
              <label className="toggle-container">
                <input
                  type="checkbox"
                  id="filtrarProximidade"
                  checked={filtrarPorProximidade}
                  onChange={(e) => HandleFiltrarPorProximidade(e)}
                />
                <span className="toggle-switch"></span>
                Mostrar apenas profissionais próximos (até 10 km)
              </label>
            </div>
            <MainBusca userId={userId} HandleProfissionalPage={HandleProfissionalPage} profissionais={profissionais} profissionaisFiltrados={profissionaisFiltrados}></MainBusca>
          </div>
        </div>
      </>
    </motion.div>
  );
}

export default BuscarProfissionais;
