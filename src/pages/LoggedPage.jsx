import PainelProfissional from "../components/PainelProfissional";
import useAuth from "../components/useAuth";


const LoggedPage = () => {
    useAuth();
    
    const profissional = JSON.parse(localStorage.getItem('profissional'));
    console.log(profissional);
    return (
        <div>
        <PainelProfissional profissional={profissional}/>
        </div>
    );
    }
    export default LoggedPage;