import { useState } from "react";
import ForgotPassword from '../../Components/ForgotPassword/ForgotPassword'
import { GoPasskeyFill } from "react-icons/go";
import styles from './ForgotPasswordForm.module.css'
import usePasswordReset from "../../Hooks/usePasswordReset";
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { toast } from "react-toastify";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import { ImWink } from "react-icons/im";


export default function ForgotPasswordForm(){
    const [confirmatinPage , setConfirmationPage] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
      });
  
    const { loadingPasswordReset,handlePasswordReset} = usePasswordReset();
   
    const handleSubmit= async(e) =>{
       e.preventDefault();
        const isReset = await handlePasswordReset(formData.email);
        if(!isReset){
            toast.error("User not found, Enter valid Email!")
            return;
        }
        toast.success("A reset link has been sent to your email address");
        setConfirmationPage(true);
    }
    return(
        <div className={styles.loginCard}>
          { confirmatinPage ?(
              <div>
                    <MdOutlineMarkEmailRead className={styles.privacyLoginIcon}/>
                    <h2 className={styles.title}>Check Your Email</h2>
                    <p className={styles.subTitle}>A reset link has been sent to your email address.</p>
                     <button type="button" 
                       className={styles.submitButton}
                       onClick={()=> window.open('https://mail.google.com')}
                       >
                        Open email inbox
                     </button>
                    
              </div>
               ):( 
              <div>
                    <GoPasskeyFill className={styles.privacyLoginIcon}/>
                    <h2 className={styles.title}>Forgot Your Password?</h2>
                    <p className={styles.subTitle}>Enter your email address </p>
                    
                    <ForgotPassword
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    loadingPasswordReset={loadingPasswordReset}
                    />
            </div>
            )}
            
             <div className={styles.terms}>
                  <MdKeyboardArrowLeft className={styles.termsIcon}/>
                  <Link to='/login' className={styles.termsText}>Back to Login</Link>
            </div>
           { confirmatinPage && <MdVerified className={styles.confirmIcon}/>}
           {!confirmatinPage && <ImWink className={styles.waitingIcon}/>}
        </div>
    )
}