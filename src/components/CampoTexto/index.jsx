import './CampoTexto.css'
const CampoTexto = ({type,Label,PlaceHolder,aoAlterar,valor}) => {
    return (
        <>
            <div className='campoTexto'>
                <label>{Label}</label>
                <input 
                value={valor}
                onChange={(e)=>aoAlterar(e.target.value)} 
                type={type}
                placeholder={PlaceHolder} />
            </div>
        </>
    )
}
export default CampoTexto;