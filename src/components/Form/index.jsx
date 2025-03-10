import CampoTexto from '../CampoTexto'
import professionalService from '../../services/config'
import supabase from '../../../supabase'
import { useState } from 'react'
const Form = ()=> {
    const [nome,setNome] = useState('')
    const [telefone,setTelefone] = useState('')
    const [profissao,setProfissao] = useState('')
    const [anosExperiencia,setAnosExperiencia] = useState('')
    const [localizacao,setLocalizacao] = useState('')
    const [email,setEmail] = useState('')
    const [senha,setSenha] = useState('')

    const HandleSubmit = async (e)=> {
        e.preventDefault()
        const novoProfissional = {
            nome: nome,
            email: email,   
            telefone: telefone,
            profissao: profissao,
            anosExperiencia: anosExperiencia,
            localizacao: localizacao
        }
        const { error } = await supabase.from("profissionais").insert([
            { nome, email, telefone,profissao,anosExperiencia,localizacao,senha },
          ]);
          if (error) {
            alert("Erro ao cadastrar: " + error.message);
          } else {
            alert("Cadastro realizado com sucesso!");
            
            setAnosExperiencia('')
            setEmail('')
            setNome('')
            setLocalizacao('')
            setProfissao('')
            setTelefone('')
          }
        };

    
    return (
        <>
            <div>
                <form onSubmit={HandleSubmit}>
                    <CampoTexto valor={nome} aoAlterar={setNome} Label = 'Nome' placeHolder='Digite aqui...' />
                    <CampoTexto valor={email} aoAlterar={setEmail} Label = 'Email' placeHolder='Digite aqui...' />
                    <CampoTexto type={'password'} valor={senha} aoAlterar={setSenha}Label = 'Senha'  placeHolder='Digite aqui...' />
                    <CampoTexto valor={telefone} aoAlterar={setTelefone}Label = 'Telefone'  placeHolder='Digite aqui...' />
                    <CampoTexto valor={profissao} aoAlterar={setProfissao}Label = 'Profissao'  placeHolder='Digite aqui...' />
                    <CampoTexto valor={anosExperiencia} aoAlterar={setAnosExperiencia}Label='Anos de Experiencia'  placeHolder='Digite aqui...' />
                    <CampoTexto valor={localizacao} aoAlterar={setLocalizacao}Label = 'Localizacao'  placeHolder='Digite aqui...' />
                    <button type='submit'>CADASTRAR</button>
                </form>
            </div>
        </>
    )
}
export default Form