import axios from 'axios'
import professionalService from '../services/config'
import { useState } from 'react';
import Form from '../components/Form';
function Cadastro(){
      
    return(
        <>
            <div>
               <h1>Página de Cadastro</h1>
               <Form/>
            </div>
        </>
    )
}
export default Cadastro;