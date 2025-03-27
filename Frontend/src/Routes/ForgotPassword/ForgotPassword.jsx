import ForgotPasswordForm from '../../Layout/ForgotPassword/ForgotPasswordForm';
import ResetPasswordForm from '../../Layout/ResetPasswordForm/ResetPasswordForm'
import ResetIMG from '../../assets/reset.svg';
import styles from './ForgotPassword.module.css';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ForgotPassword({reset=false}){
    
    return(
        <motion.div 
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
            >
                { !reset ? 
                  (
                     <ForgotPasswordForm/>
                  ):(
                      <ResetPasswordForm/> 
                  )}
            </motion.div>
            <div className={styles.textCard}>
                <img src={ResetIMG} alt='reset-img' className={styles.loginImg}/>
            </div>  
       </motion.div>
    )
}