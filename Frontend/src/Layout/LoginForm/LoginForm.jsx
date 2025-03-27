import { useState } from "react";
import { Link } from 'react-router-dom';

import Login from '../../Components/Login/Login'
import { BsPersonCircle } from "react-icons/bs";
import styles from './LoginForm.module.css'

import useLogin from "../../Hooks/useLogin";
import useFingerprint from '../../Hooks/useFingerprintAuth'
import useGoogleAuth from '../../Hooks/useGoogleAuth'

import { IoFingerPrintSharp } from "react-icons/io5";
import { PiLineVerticalThin } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";



export default function LoginForm(){
  const { error,success, authenticateFingerprint ,registerFingerprint} = useFingerprint();
  const { handleGoogleLogin } = useGoogleAuth();


  const handleAuthenticate = async (e) => {
    e.preventDefault();
    // const email = window.prompt();
    const email = "nigupta@griddynamics.com";
    await authenticateFingerprint(email);
};


    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });

    const { loading, handleLoginSubmit, errorMessage } = useLogin();

    const handleSubmit=async(e)=>{
       e.preventDefault();
       await handleLoginSubmit(formData);
    }
    return(
        <div className={styles.loginCard}>
             <h2 className={styles.title}>Login</h2>
               <p className={styles.subTitle}>Securely with your fingerprint</p>
               
               <IoFingerPrintSharp 
               className={styles.privacyLoginIcon}
               onClick={handleAuthenticate}
               />
               
    
               <p>&#x2015;&#x2015; <span>  or  </span> &#x2015;&#x2015;</p>
           
            <Login
             formData={formData}
             setFormData={setFormData}
             handleSubmit={handleSubmit}
             loading={loading}
             errorMessage={errorMessage}
            />

              <div className="terms">
                 <a href="/reset">Forgot Password</a>
                  <br/>
                <span>Don't have an account? <Link to='/signup'>Sign up</Link></span>
               </div>
             <div className={styles.AuthIcon}>
                 {/* <IoFingerPrintSharp className={styles.fingerIcon}/>
                 <PiLineVerticalThin className={styles.lineIcon}/> */}
                 <FcGoogle className={styles.googleIcon} onClick={handleGoogleLogin} />
                
             </div>
             {error && <p style={{ color: "red" , fontSize:'12px'}}>{error}</p>}
             {success && <p style={{ color: "green" ,fontSize:'12px'}}>Authentication Successful!</p>}
      </div>
    )
}