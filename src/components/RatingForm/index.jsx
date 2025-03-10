import CampoTexto from "../CampoTexto";
import { useState } from "react";
import supabase from "../../../supabase"; 
import Backbutton from "../Backbutton";
const RatingForm = ({profissional,onNewEvaluation,refreshEvaluations}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [message,setMessage] = useState('')
    
    const notas = [1, 2, 3, 4, 5];
  
    const HandleSubmit = async (e) => {
      e.preventDefault();
      const newEvaluation = { 
          nota: rating, 
          comentario: comment, 
          profissional_id: profissional.id 
      };
  
      const { data, error } = await supabase
        .from('avaliacoes')
        .insert([newEvaluation]);
  
      if (error) {
        console.error('Error saving evaluation:', error);
      } else {
        setRating(0);
        setComment('');
        setMessage('Sua Avaliação Foi Enviada!');
        onNewEvaluation(newEvaluation);
        // Aguarde a inserção antes de atualizar a lista
      }
  };

      
    return (<>
           <Backbutton rota={`/profissional/${profissional.id}`}/>
        <form onSubmit={HandleSubmit}>
        <label>
            Nota:
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                {notas.map((nota) => (
                    <option key={nota} value={nota}>
                        {nota}
                    </option>
                ))}
            </select> 
        </label>
        <CampoTexto valor={comment} aoAlterar={setComment}/>
        <button type="submit">Submit</button>
            {message && <p style={{background: '#CDEFD9'}}>{message}</p>}
        </form>
        </>
    );
    };
    export default RatingForm;