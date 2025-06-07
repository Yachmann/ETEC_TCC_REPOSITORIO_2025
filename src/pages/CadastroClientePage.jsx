import FormCadastroCliente from "../components/FormCadastroCliente"
import { motion } from 'framer-motion';
const CadastroClientePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <>
                <FormCadastroCliente />
            </>
        </motion.div>
    )
}
export default CadastroClientePage