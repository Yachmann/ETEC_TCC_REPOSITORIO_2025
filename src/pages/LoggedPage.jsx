import PainelProfissional from "../components/PainelProfissional";
import useAuth from "../components/useAuth";
import { motion } from 'framer-motion';

const LoggedPage = () => {
    useAuth();

    const profissional = JSON.parse(localStorage.getItem('profissional'));
    console.log(profissional);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div>
                <PainelProfissional profissional={profissional} />
            </div>
        </motion.div>
    );
}
export default LoggedPage;