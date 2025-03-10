import CardProfissional from "../CardProfissional"
import './MainBusca.css'

const MainBusca = ({HandleProfissionalPage, profissionaisFiltrados, profissionais }) => {
    return (
        <>
            <div className="mainBusca">
                <form>
                    {/* Your form inputs and buttons here */}
                </form>
                <div className="cardContainer">
                    {profissionaisFiltrados.length === 0 ? profissionais.map(profissional => (
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
                            abrirProfissional={HandleProfissionalPage}
                            className="card">
                        </CardProfissional>
                    )) : profissionaisFiltrados.map(filtrado => (
                        <CardProfissional
                            key={filtrado.id}
                            id={filtrado.id}
                            nome={filtrado.nome}
                            profissao={filtrado.profissao}
                            email={filtrado.email}
                            telefone={filtrado.telefone}
                            anosExperiencia={filtrado.anosExperiencia}
                            valorBotao={"Contratar"}
                            localizacao={filtrado.localizacao}
                            abrirProfissional={HandleProfissionalPage}
                            className="card">
                                
                        </CardProfissional>
                    ))}
                </div>
            </div>
        </>
    )
}

export default MainBusca