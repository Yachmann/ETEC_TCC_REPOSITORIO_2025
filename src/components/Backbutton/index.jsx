
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import './Backbutton.css'
const Backbutton = ({rota}) => {
    return(
        <>
            <Link className="backbutton" to={rota}><IoIosArrowBack></IoIosArrowBack></Link>
        </>
    )
}
export default Backbutton