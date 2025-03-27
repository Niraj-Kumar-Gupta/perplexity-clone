import React from 'react';
import SignupForm from '../../Layout/SignupForm/SignupForm';
import signupIMG from '../../assets/signupIMG.svg';
import './Signup.css';
import { motion } from 'framer-motion';

const Signup = () => {
  return (
    <div className="signup-container">
      <div className="signup-text-card">
        <img src={signupIMG} alt="signup-img" className="signup-img" />
      </div>
      <motion.div 
        className='signup-container-card'
        initial={{ x: -20 }}
        animate={{ x: 1 }}
        transition={{ type:'spring', tiffness: 100  }}
       
      >
        <SignupForm/>
      </motion.div>
    </div>
  );
};

export default Signup;
