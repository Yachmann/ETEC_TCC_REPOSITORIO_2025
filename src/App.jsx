
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import BuscarProfissionais from './pages/BuscarProfissionais';
import ProfissionalPage from './pages/ProfissionalPage';
import LoginPage from './pages/LoginPage';
import LoggedPage from './pages/LoggedPage';
import AvaliacaoPage from './pages/AvaliacaoPage';
import CadastroClientePage from './pages/CadastroClientePage';
import LoginClientePage from './pages/LoginClientePage';
import UsuarioPage from './pages/UsuarioPage';
import SuccessPage from './pages/SuccessPage';
import AboutPage from './pages/AboutPage';
import NotasPage from "./pages/NotasPage";
import { useEffect, useState } from "react";

function App() {

  const [temaEscuro, setTemaEscuro] = useState(() => {
    const temaSalvo = localStorage.getItem("tema");
    return temaSalvo ? JSON.parse(temaSalvo) : false;
  });

  useEffect(() => {
    document.body.className = temaEscuro ? "dark-mode" : "light-mode";
    localStorage.setItem("tema", JSON.stringify(temaEscuro));
  }, [temaEscuro]);
  return (
    <Router>
       <button
        style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}
        onClick={() => setTemaEscuro((prev) => !prev)}
      >
        {temaEscuro ? "☀️ Tema Claro" : "🌙 Tema Escuro"}
      </button>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/cadastro" element={<Cadastro />}></Route>
          <Route path="/buscar" element={<BuscarProfissionais />}></Route>
          <Route path='*' element={<h1>Not Found</h1>}></Route>
          <Route path='/profissional/:id' element={<ProfissionalPage />}></Route>
          <Route path='/logged/:id' element={<LoggedPage />}></Route>
          <Route path='/loginprofissional' element={<LoginPage />}></Route>
          <Route path='/avaliar/:id' element={<AvaliacaoPage />}></Route>
          <Route path='/cadastrocliente' element={<CadastroClientePage />}></Route>
          <Route path='/logincliente' element={<LoginClientePage />}></Route>
          <Route path='/usuario/:id' element={<UsuarioPage />}></Route>
          <Route path='/success' element={<SuccessPage />}></Route>
          <Route path='/about' element={<AboutPage />}></Route>
          <Route path='/planner/:profissionalId' element={<NotasPage/>}></Route>
        </Routes>
    </Router>
  )
}

export default App
