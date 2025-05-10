import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";  // seu arquivo CSS global

import Home from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import BuscarProfissionais from "./pages/BuscarProfissionais";
import ProfissionalPage from "./pages/ProfissionalPage";
import LoginPage from "./pages/LoginPage";
import LoggedPage from "./pages/LoggedPage";
import AvaliacaoPage from "./pages/AvaliacaoPage";
import CadastroClientePage from "./pages/CadastroClientePage";
import LoginClientePage from "./pages/LoginClientePage";
import UsuarioPage from "./pages/UsuarioPage";
import SuccessPage from "./pages/SuccessPage";
import AboutPage from "./pages/AboutPage";
import NotasPage from "./pages/NotasPage";

function App() {
  const [temaEscuro, setTemaEscuro] = useState(() => {
    const temaSalvo = localStorage.getItem("tema");
    return temaSalvo ? JSON.parse(temaSalvo) : false;
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", temaEscuro);
    localStorage.setItem("tema", JSON.stringify(temaEscuro));
  }, [temaEscuro]);

  return (
    <Router>
      Botão de alternar tema
      <button
        className="theme-toggle"
        onClick={() => setTemaEscuro(prev => !prev)}
      >
        {temaEscuro ? "☀️" : "🌙"}
      </button>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/buscar" element={<BuscarProfissionais />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/profissional/:id" element={<ProfissionalPage />} />
        <Route path="/logged/:id" element={<LoggedPage />} />
        <Route path="/loginprofissional" element={<LoginPage />} />
        <Route path="/avaliar/:id" element={<AvaliacaoPage />} />
        <Route path="/cadastrocliente" element={<CadastroClientePage />} />
        <Route path="/logincliente" element={<LoginClientePage />} />
        <Route path="/usuario/:id" element={<UsuarioPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/planner/:profissionalId" element={<NotasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
