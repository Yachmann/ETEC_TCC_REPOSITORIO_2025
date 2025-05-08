import './CardProfissional.css'
import { useState,useEffect } from 'react'
const CardProfissional = ({abrirProfissional,id,nome,profissao,email,telefone,anosExperiencia,localizacao,valorBotao,userId}) => {
    const [appear,setAppear] = useState(false)
    useEffect(() => {
        setAppear(true)
    }, [])
    return (
        <>
            <div key={id} className={`card ${appear ? 'card-appear' : ''}`}>
                <h3>{nome.toUpperCase()}</h3>
                <h4>{profissao.toUpperCase()}</h4>
                <div>
                    <p className="email">{email}</p>
                    <p className="telefone">{telefone}</p>
                    <p>Anos de Experiencia: {anosExperiencia}</p>
                    <p>Localizacao: {localizacao.toUpperCase()}</p>
                </div>
                <button onClick={abrirProfissional} id={id} className="botao" value={valorBotao}>{valorBotao}</button>
                
            </div>
        </>
    )
}
export default CardProfissional