import { motion } from 'framer-motion';
import Form from '../components/Form';
function Cadastro() {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <>
                <div>
                    <Form />
                </div>
            </>
        </motion.div>
    )
}
export default Cadastro;