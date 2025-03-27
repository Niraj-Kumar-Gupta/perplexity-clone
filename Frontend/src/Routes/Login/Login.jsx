import styles from './Login.module.css'
import React from 'react';
import LoginForm from '../../Layout/LoginForm/LoginForm'
import loginImg from '../../assets/LoginIMG.svg'
import { motion } from 'framer-motion';

export default function Login(){
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
                <LoginForm/>
            </motion.div>
            <div className={styles.textCard}>
                <img src={loginImg} alt='signup-img' className={styles.loginImg}/>
            </div>  
       </motion.div>
    )
}